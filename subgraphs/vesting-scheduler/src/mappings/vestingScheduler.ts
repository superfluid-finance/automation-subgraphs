import { BigInt } from '@graphprotocol/graph-ts';
import { Task } from "../types/schema";
import {
  VestingCliffAndFlowExecuted,
  VestingEndExecuted,
  VestingEndFailed,
  VestingScheduleCreated,
  VestingScheduleDeleted,
  VestingScheduler,
  VestingScheduleUpdated,
} from "../types/VestingScheduler/VestingScheduler";
import { createTask } from "../utils/createTask";
import { createVestingCliffAndFlowExecutedEntity } from "../utils/createVestingCliffAndFlowExecuted";
import { createVestingEndExecutedEventEntity } from "../utils/createVestingEndExecuted";
import { createVestingEndFailedEventEntity } from "../utils/createVestingEndFailed";

import { createVestingScheduleCreatedEventEntity } from "../utils/createVestingScheduleCreated";
import { createVestingScheduleDeletedEventEntity } from "../utils/createVestingScheduleDeleted";
import { createVestingUpdatedEntity } from "../utils/createVestingScheduleUpdated";

import { getOrCreateTokenSenderReceiverCursor } from "../utils/tokenSenderReceiverCursor";
import {
  createVestingSchedule,
  getVestingSchedule,
} from "../utils/vestingSchedule";

export function handleVestingCliffAndFlowExecuted_v1(
  event: VestingCliffAndFlowExecuted
): void {
  _handleVestingCliffAndFlowExecuted(event, "v1");
}

export function handleVestingCliffAndFlowExecuted_v2(
  event: VestingCliffAndFlowExecuted
): void {
  _handleVestingCliffAndFlowExecuted(event, "v2");
}

function _handleVestingCliffAndFlowExecuted(
  event: VestingCliffAndFlowExecuted,
  contractVersion: string
): void {
  const ev = createVestingCliffAndFlowExecutedEntity(event, contractVersion);
  ev.save();

  const cursor = getOrCreateTokenSenderReceiverCursor(
    ev.superToken,
    ev.sender,
    ev.receiver,
    contractVersion
  );

  const currentVestingSchedule = getVestingSchedule(cursor);

  if (currentVestingSchedule) {
    currentVestingSchedule.cliffAndFlowExecutedAt = ev.timestamp;

    let events = currentVestingSchedule.events;
    events.push(ev.id);
    currentVestingSchedule.events = events;

    currentVestingSchedule.save();

    if (cursor.currentCliffAndFlowTask) {
      const task = Task.load(cursor.currentCliffAndFlowTask!)!;

      task.executedAt = event.block.timestamp;

      task.save();
    }

    cursor.currentCliffAndFlowTask = null;

    cursor.save();
  }
}

export function handleVestingScheduleCreated_v1(
  event: VestingScheduleCreated
): void {
  _handleVestingScheduleCreated(event, "v1");
}

export function handleVestingScheduleCreated_v2(
  event: VestingScheduleCreated
): void {
  _handleVestingScheduleCreated(event, "v2");
}

function _handleVestingScheduleCreated(
  event: VestingScheduleCreated,
  contractVersion: string
): void {
  const ev = createVestingScheduleCreatedEventEntity(event, contractVersion);
  ev.save();

  const currentVestingSchedule = createVestingSchedule(
    ev,
    event.address,
    contractVersion
  );
  const cursor = getOrCreateTokenSenderReceiverCursor(
    ev.superToken,
    ev.sender,
    ev.receiver,
    contractVersion
  );

  if(ev.claimValidityDate == BigInt.fromI32(0)){
    const cliffAndFlowTask = createTask(
      currentVestingSchedule,
      "ExecuteCliffAndFlow",
      event.transaction.hash.toHexString(),
      event.logIndex,
      contractVersion
    );
    cursor.currentCliffAndFlowTask = cliffAndFlowTask.id;
    cliffAndFlowTask.save();
  } else {
    cursor.currentCliffAndFlowTask = null;
  }
    
    const endVestingTask = createTask(
    currentVestingSchedule,
    "ExecuteEndVesting",
    event.transaction.hash.toHexString(),
    event.logIndex,
    contractVersion
  );

  cursor.currentVestingSchedule = currentVestingSchedule.id;
  cursor.currentEndVestingTask = endVestingTask.id;

  currentVestingSchedule.save();
  cursor.save();
  endVestingTask.save();
}

export function handleVestingScheduleDeleted_v1(
  event: VestingScheduleDeleted
): void {
  _handleVestingScheduleDeleted(event, "v1");
}

export function handleVestingScheduleDeleted_v2(
  event: VestingScheduleDeleted
): void {
  _handleVestingScheduleDeleted(event, "v2");
}

function _handleVestingScheduleDeleted(
  event: VestingScheduleDeleted,
  contractVersion: string
): void {
  const ev = createVestingScheduleDeletedEventEntity(event, contractVersion);
  ev.save();

  const cursor = getOrCreateTokenSenderReceiverCursor(
    ev.superToken,
    ev.sender,
    ev.receiver,
    contractVersion
  );
  const currentVestingSchedule = getVestingSchedule(cursor);

  if (currentVestingSchedule) {
    currentVestingSchedule.deletedAt = ev.timestamp;

    let events = currentVestingSchedule.events;
    events.push(ev.id);
    currentVestingSchedule.events = events;

    currentVestingSchedule.save();
  }

  if (cursor.currentCliffAndFlowTask) {
    const cliffAndFlowTask = Task.load(cursor.currentCliffAndFlowTask!)!;

    cliffAndFlowTask.cancelledAt = ev.timestamp;

    cursor.currentCliffAndFlowTask = null;

    cliffAndFlowTask.save();
  }

  if (cursor.currentEndVestingTask) {
    const endVestingTask = Task.load(cursor.currentEndVestingTask!)!;

    endVestingTask.cancelledAt = ev.timestamp;

    cursor.currentEndVestingTask = null;

    endVestingTask.save();
  }

  cursor.currentVestingSchedule = null;

  cursor.save();
}

export function handleVestingScheduleUpdated_v1(
  event: VestingScheduleUpdated
): void {
  _handleVestingScheduleUpdated(event, "v1");
}

export function handleVestingScheduleUpdated_v2(
  event: VestingScheduleUpdated
): void {
  _handleVestingScheduleUpdated(event, "v2");
}

function _handleVestingScheduleUpdated(
  event: VestingScheduleUpdated,
  contractVersion: string
): void {
  const ev = createVestingUpdatedEntity(event, contractVersion);
  ev.save();

  const vestingScheduler = VestingScheduler.bind(event.address);
  const endValidBeforeSeconds = vestingScheduler.END_DATE_VALID_BEFORE();

  const cursor = getOrCreateTokenSenderReceiverCursor(
    ev.superToken,
    ev.sender,
    ev.receiver,
    contractVersion
  );

  const currentVestingSchedule = getVestingSchedule(cursor);

  if (currentVestingSchedule) {
    currentVestingSchedule.endDate = ev.endDate;

    let events = currentVestingSchedule.events;
    events.push(ev.id);
    currentVestingSchedule.events = events;

    const task = Task.load(cursor.currentEndVestingTask!);

    if (task) {
      task.executionAt = ev.endDate.minus(endValidBeforeSeconds);
      task.save();
    }

    currentVestingSchedule.save();
    cursor.save();
  }
}

export function handleVestingEndExecuted_v1(event: VestingEndExecuted): void {
  _handleVestingEndExecuted(event, "v1");
}

export function handleVestingEndExecuted_v2(event: VestingEndExecuted): void {
  _handleVestingEndExecuted(event, "v2");
}

function _handleVestingEndExecuted(
  event: VestingEndExecuted,
  contractVersion: string
): void {
  const ev = createVestingEndExecutedEventEntity(event, contractVersion);
  ev.save();

  const cursor = getOrCreateTokenSenderReceiverCursor(
    ev.superToken,
    ev.sender,
    ev.receiver,
    contractVersion
  );
  const currentVestingSchedule = getVestingSchedule(cursor);

  if (currentVestingSchedule) {
    currentVestingSchedule.endExecutedAt = ev.timestamp;

    let events = currentVestingSchedule.events;
    events.push(ev.id);
    currentVestingSchedule.events = events;

    currentVestingSchedule.didEarlyEndCompensationFail = ev.didCompensationFail;
    currentVestingSchedule.earlyEndCompensation = ev.earlyEndCompensation;

    currentVestingSchedule.save();
  }

  if (cursor.currentEndVestingTask) {
    const task = Task.load(cursor.currentEndVestingTask!)!;

    task.executedAt = event.block.timestamp;

    cursor.currentEndVestingTask = null;

    cursor.save();
    task.save();
  }
}

export function handleVestingEndFailed_v1(event: VestingEndFailed): void {
  _handleVestingEndFailed(event, "v1");
}

export function handleVestingEndFailed_v2(event: VestingEndFailed): void {
  _handleVestingEndFailed(event, "v2");
}

function _handleVestingEndFailed(
  event: VestingEndFailed,
  contractVersion: string
): void {
  const ev = createVestingEndFailedEventEntity(event, contractVersion);
  ev.save();

  const cursor = getOrCreateTokenSenderReceiverCursor(
    ev.superToken,
    ev.sender,
    ev.receiver,
    contractVersion
  );

  const currentVestingSchedule = getVestingSchedule(cursor);

  if (currentVestingSchedule) {
    currentVestingSchedule.endExecutedAt = null;

    let events = currentVestingSchedule.events;
    events.push(ev.id);
    currentVestingSchedule.events = events;
    currentVestingSchedule.failedAt = ev.timestamp;

    currentVestingSchedule.save();
  }

  if (cursor.currentEndVestingTask) {
    const task = Task.load(cursor.currentEndVestingTask!)!;

    task.failedAt = ev.timestamp;

    cursor.currentEndVestingTask = null;

    cursor.save();
    task.save();
  }
}
