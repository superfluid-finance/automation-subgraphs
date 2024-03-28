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

export function handleVestingCliffAndFlowExecuted(
  event: VestingCliffAndFlowExecuted
): void {
  const ev = createVestingCliffAndFlowExecutedEntity(event);
  ev.save();

  const cursor = getOrCreateTokenSenderReceiverCursor(
    ev.superToken,
    ev.sender,
    ev.receiver
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

export function handleVestingScheduleCreated(
  event: VestingScheduleCreated
): void {
  const ev = createVestingScheduleCreatedEventEntity(event);
  ev.save();

  const currentVestingSchedule = createVestingSchedule(ev, event.address);
  const cursor = getOrCreateTokenSenderReceiverCursor(
    ev.superToken,
    ev.sender,
    ev.receiver
  );

  const cliffAndFlowTask = createTask(
    currentVestingSchedule,
    "ExecuteCliffAndFlow",
    event.transaction.hash.toHexString(),
    event.logIndex
  );

  const endVestingTask = createTask(
    currentVestingSchedule,
    "ExecuteEndVesting",
    event.transaction.hash.toHexString(),
    event.logIndex
  );

  cursor.currentVestingSchedule = currentVestingSchedule.id;
  cursor.currentCliffAndFlowTask = cliffAndFlowTask.id;
  cursor.currentEndVestingTask = endVestingTask.id;

  currentVestingSchedule.save();
  cursor.save();
  cliffAndFlowTask.save();
  endVestingTask.save();
}

export function handleVestingScheduleCreatedV2(
  event: VestingScheduleCreated
): void {
  const ev = createVestingScheduleCreatedEventEntity(event);
  ev.save();

  const currentVestingSchedule = createVestingSchedule(ev, event.address);
  const cursor = getOrCreateTokenSenderReceiverCursor(
    ev.superToken,
    ev.sender,
    ev.receiver
  );

  const cliffAndFlowTask = createTask(
    currentVestingSchedule,
    "ExecuteCliffAndFlow",
    event.transaction.hash.toHexString(),
    event.logIndex
  );

  const endVestingTask = createTask(
    currentVestingSchedule,
    "ExecuteEndVesting",
    event.transaction.hash.toHexString(),
    event.logIndex
  );

  cursor.currentVestingSchedule = currentVestingSchedule.id;
  cursor.currentCliffAndFlowTask = cliffAndFlowTask.id;
  cursor.currentEndVestingTask = endVestingTask.id;

  currentVestingSchedule.save();
  cursor.save();
  cliffAndFlowTask.save();
  endVestingTask.save();
}

export function handleVestingScheduleDeleted(
  event: VestingScheduleDeleted
): void {
  const ev = createVestingScheduleDeletedEventEntity(event);
  ev.save();

  const cursor = getOrCreateTokenSenderReceiverCursor(
    ev.superToken,
    ev.sender,
    ev.receiver
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

export function handleVestingScheduleUpdated(
  event: VestingScheduleUpdated
): void {
  const ev = createVestingUpdatedEntity(event);
  ev.save();

  const vestingScheduler = VestingScheduler.bind(event.address);
  const endValidBeforeSeconds = vestingScheduler.END_DATE_VALID_BEFORE();

  const cursor = getOrCreateTokenSenderReceiverCursor(
    ev.superToken,
    ev.sender,
    ev.receiver
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

export function handleVestingEndExecuted(event: VestingEndExecuted): void {
  const ev = createVestingEndExecutedEventEntity(event);
  ev.save();

  const cursor = getOrCreateTokenSenderReceiverCursor(
    ev.superToken,
    ev.sender,
    ev.receiver
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

export function handleVestingEndFailed(event: VestingEndFailed): void {
  const ev = createVestingEndFailedEventEntity(event);
  ev.save();

  const cursor = getOrCreateTokenSenderReceiverCursor(
    ev.superToken,
    ev.sender,
    ev.receiver
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
