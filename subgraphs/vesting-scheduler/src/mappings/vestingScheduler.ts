import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  Task,
  VestingScheduleCreatedEvent,
  VestingScheduleUpdatedEvent,
} from "../types/schema";
import {
  VestingScheduler,
  VestingCliffAndFlowExecuted as VestingCliffAndFlowExecuted_v1,
  VestingEndExecuted as VestingEndExecuted_v1,
  VestingEndFailed as VestingEndFailed_v1,
  VestingScheduleCreated as VestingScheduleCreated_v1,
  VestingScheduleDeleted as VestingScheduleDeleted_v1,
  VestingScheduleUpdated as VestingScheduleUpdated_v1,
} from "../types/VestingScheduler/VestingScheduler";
import {
  VestingScheduleDeleted as VestingScheduleDeleted_v2,
  VestingClaimed as VestingClaimed_v2,
  VestingCliffAndFlowExecuted as VestingCliffAndFlowExecuted_v2,
  VestingScheduleCreated as VestingScheduleCreated_v2,
  VestingScheduleUpdated as VestingScheduleUpdated_v2,
  VestingEndExecuted as VestingEndExecuted_v2,
  VestingEndFailed as VestingEndFailed_v2,
} from "../types/VestingScheduler_v2/VestingScheduler";
import {
  VestingScheduler as VestingScheduler_v3,
  VestingCliffAndFlowExecuted as VestingCliffAndFlowExecuted_v3,
  VestingClaimed as VestingClaimed_v3,
  VestingScheduleCreated as VestingScheduleCreated_v3,
  VestingScheduleDeleted as VestingScheduleDeleted_v3,
  VestingScheduleUpdated as VestingScheduleUpdated_v3,
  VestingScheduleTotalAmountUpdated as VestingScheduleTotalAmountUpdated_v3,
  VestingScheduleEndDateUpdated as VestingScheduleEndDateUpdated_v3,
  VestingEndExecuted as VestingEndExecuted_v3,
  VestingEndFailed as VestingEndFailed_v3,
} from "../types/VestingScheduler_v3/VestingScheduler";
import { createTask } from "../utils/createTask";
import { createVestingCliffAndFlowExecutedEntity } from "../utils/createVestingCliffAndFlowExecuted";
import { createVestingEndExecutedEventEntity } from "../utils/createVestingEndExecuted";
import { createVestingEndFailedEventEntity } from "../utils/createVestingEndFailed";
import { createVestingScheduleTotalAmountUpdatedEventEntity } from "../utils/createVestingScheduleTotalAmountUpdated";

import {
  createVestingScheduleCreatedEventEntity_v1,
  createVestingScheduleCreatedEventEntity_v2,
  createVestingScheduleCreatedEventEntity_v3
} from "../utils/createVestingScheduleCreated";
import { createVestingScheduleDeletedEventEntity } from "../utils/createVestingScheduleDeleted";
import {
  createVestingUpdatedEntity_v1,
  createVestingUpdatedEntity_v2,
  createVestingUpdatedEntity_v3
} from "../utils/createVestingScheduleUpdated";

import { getOrCreateTokenSenderReceiverCursor } from "../utils/tokenSenderReceiverCursor";
import {
  createVestingSchedule,
  getVestingSchedule,
} from "../utils/vestingSchedule";
import { createVestingClaimedEventEntity } from "../utils/createVestingClaimed";

import { log } from "@graphprotocol/graph-ts"
import { createVestingScheduleEndDateUpdatedEventEntity } from "../utils/createVestingScheduleEndDateUpdatedEvent";
import { calculateTotalVestedAmount_v1_v2 } from "../utils/calculateTotalVestedAmount";

export function handleVestingCliffAndFlowExecuted_v1(
  event: VestingCliffAndFlowExecuted_v1
): void {
  _handleVestingCliffAndFlowExecuted(event, "v1");
}

export function handleVestingCliffAndFlowExecuted_v2(
  event: VestingCliffAndFlowExecuted_v1
): void {
  _handleVestingCliffAndFlowExecuted(event, "v2");
}

export function handleVestingCliffAndFlowExecuted_v3(
  event: VestingCliffAndFlowExecuted_v1
): void {
  _handleVestingCliffAndFlowExecuted(event, "v3");
}

function _handleVestingCliffAndFlowExecuted(
  event: VestingCliffAndFlowExecuted_v1,
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
  event: VestingScheduleCreated_v1
): void {
  const storedEvent = createVestingScheduleCreatedEventEntity_v1(event);
  storedEvent.save();

  _handleVestingScheduleCreated(event, storedEvent, "v1");
}

export function handleVestingScheduleCreated_v2(
  event: VestingScheduleCreated_v2
): void {
  const storedEvent = createVestingScheduleCreatedEventEntity_v2(event);
  storedEvent.save();

  _handleVestingScheduleCreated(event, storedEvent, "v2");
}

export function handleVestingScheduleCreated_v3(
  event: VestingScheduleCreated_v3
): void {
  const storedEvent = createVestingScheduleCreatedEventEntity_v3(event);
  storedEvent.save();

  _handleVestingScheduleCreated(event, storedEvent, "v3");
}

function _handleVestingScheduleCreated(
  event: ethereum.Event,
  storedEvent: VestingScheduleCreatedEvent,
  contractVersion: string
): void {
  const currentVestingSchedule = createVestingSchedule(
    storedEvent,
    event.address,
    contractVersion
  );
  const cursor = getOrCreateTokenSenderReceiverCursor(
    storedEvent.superToken,
    storedEvent.sender,
    storedEvent.receiver,
    contractVersion
  );

  if (storedEvent.claimValidityDate == BigInt.fromI32(0)) {
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
  event: VestingScheduleDeleted_v1
): void {
  _handleVestingScheduleDeleted(event, "v1");
}

export function handleVestingScheduleDeleted_v2(
  event: VestingScheduleDeleted_v1
): void {
  _handleVestingScheduleDeleted(event, "v2");
}

export function handleVestingScheduleDeleted_v3(
  event: VestingScheduleDeleted_v1
): void {
  _handleVestingScheduleDeleted(event, "v3");
}

function _handleVestingScheduleDeleted(
  event: VestingScheduleDeleted_v1,
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
  event: VestingScheduleUpdated_v1
): void {
  const storedEvent = createVestingUpdatedEntity_v1(event, "v1");
  storedEvent.save();

  _handleVestingScheduleUpdated(event, storedEvent, "v1");
}

export function handleVestingScheduleUpdated_v2(
  event: VestingScheduleUpdated_v2
): void {
  const storedEvent = createVestingUpdatedEntity_v2(event, "v2");
  storedEvent.save();

  _handleVestingScheduleUpdated(event, storedEvent, "v2");
}

export function handleVestingScheduleUpdated_v3(
  event: VestingScheduleUpdated_v3
): void {
  const storedEvent = createVestingUpdatedEntity_v3(event, "v3");
  storedEvent.save();

  _handleVestingScheduleUpdated(event, storedEvent, "v3");
}

function _handleVestingScheduleUpdated(
  event: ethereum.Event,
  storedEvent: VestingScheduleUpdatedEvent,
  contractVersion: string
): void {
  const vestingScheduler = VestingScheduler.bind(event.address);
  const endValidBeforeSeconds = vestingScheduler.END_DATE_VALID_BEFORE();

  const cursor = getOrCreateTokenSenderReceiverCursor(
    storedEvent.superToken,
    storedEvent.sender,
    storedEvent.receiver,
    contractVersion
  );

  const currentVestingSchedule = getVestingSchedule(cursor);

  if (currentVestingSchedule) {
    currentVestingSchedule.endDate = storedEvent.endDate;
    currentVestingSchedule.remainderAmount = BigInt.fromI32(0);

    let events = currentVestingSchedule.events;
    events.push(storedEvent.id);
    currentVestingSchedule.events = events;

    const task = Task.load(cursor.currentEndVestingTask!);

    if (task) {
      task.executionAt = storedEvent.endDate.minus(endValidBeforeSeconds);
      task.save();
    }

    // Update the total amount
    if (contractVersion === "v3") {
      const vestingScheduler = VestingScheduler_v3.bind(event.address);
      const totalVestedAmount =
        vestingScheduler.getTotalVestedAmount(
          Address.fromBytes(currentVestingSchedule.superToken),
          Address.fromBytes(currentVestingSchedule.sender),
          Address.fromBytes(currentVestingSchedule.receiver)
        );
      currentVestingSchedule.totalAmount = totalVestedAmount;
    } else {
      currentVestingSchedule.totalAmount = calculateTotalVestedAmount_v1_v2(
        currentVestingSchedule.cliffAndFlowDate,
        currentVestingSchedule.endDate,
        currentVestingSchedule.flowRate,
        currentVestingSchedule.cliffAmount,
        currentVestingSchedule.remainderAmount
      );
    }
    // ---

    currentVestingSchedule.save();
    cursor.save();
  }
}

export function handleVestingEndExecuted_v1(event: VestingEndExecuted_v1): void {
  _handleVestingEndExecuted(event, "v1");
}

export function handleVestingEndExecuted_v2(event: VestingEndExecuted_v1): void {
  _handleVestingEndExecuted(event, "v2");
}

export function handleVestingEndExecuted_v3(event: VestingEndExecuted_v1): void {
  _handleVestingEndExecuted(event, "v3");
}

function _handleVestingEndExecuted(
  event: VestingEndExecuted_v1,
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

export function handleVestingEndFailed_v1(event: VestingEndFailed_v1): void {
  _handleVestingEndFailed(event, "v1");
}

export function handleVestingEndFailed_v2(event: VestingEndFailed_v1): void {
  _handleVestingEndFailed(event, "v2");
}

export function handleVestingEndFailed_v3(event: VestingEndFailed_v1): void {
  _handleVestingEndFailed(event, "v3");
}

function _handleVestingEndFailed(
  event: VestingEndFailed_v1,
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

export function handleVestingClaimed_v2(event: VestingClaimed_v2): void {
  const ev = createVestingClaimedEventEntity(event, "v2");
  ev.save();

  const cursor = getOrCreateTokenSenderReceiverCursor(
    ev.superToken,
    ev.sender,
    ev.receiver,
    "v2"
  );

  const currentVestingSchedule = getVestingSchedule(cursor);

  if (currentVestingSchedule) {
    currentVestingSchedule.claimedAt = ev.timestamp;
    let events = currentVestingSchedule.events;
    events.push(ev.id);
    currentVestingSchedule.events = events;
    currentVestingSchedule.save();
    cursor.save();
  }
}

export function handleVestingClaimed_v3(event: VestingClaimed_v2): void {
  const ev = createVestingClaimedEventEntity(event, "v3");
  ev.save();

  const cursor = getOrCreateTokenSenderReceiverCursor(
    ev.superToken,
    ev.sender,
    ev.receiver,
    "v3"
  );

  const currentVestingSchedule = getVestingSchedule(cursor);

  if (currentVestingSchedule) {
    currentVestingSchedule.claimedAt = ev.timestamp;
    let events = currentVestingSchedule.events;
    events.push(ev.id);
    currentVestingSchedule.events = events;
    currentVestingSchedule.save();
    cursor.save();
  }
}

export function handleVestingScheduleTotalAmountUpdated_v3(event: VestingScheduleTotalAmountUpdated_v3): void {
  const ev = createVestingScheduleTotalAmountUpdatedEventEntity(event, "v3");
  ev.save();

  const cursor = getOrCreateTokenSenderReceiverCursor(
    ev.superToken,
    ev.sender,
    ev.receiver,
    "v3"
  );

  const currentVestingSchedule = getVestingSchedule(cursor);

  if (currentVestingSchedule) {
    currentVestingSchedule.flowRate = ev.newFlowRate;
    currentVestingSchedule.remainderAmount = ev.remainderAmount;

    let events = currentVestingSchedule.events;
    events.push(ev.id);
    currentVestingSchedule.events = events;

    // Update the total amount
    const vestingScheduler = VestingScheduler_v3.bind(event.address);

    const totalVestedAmount =
      vestingScheduler.getTotalVestedAmount(
        Address.fromBytes(currentVestingSchedule.superToken),
        Address.fromBytes(currentVestingSchedule.sender),
        Address.fromBytes(currentVestingSchedule.receiver)
      );
    currentVestingSchedule.totalAmount = totalVestedAmount;
    // ---

    currentVestingSchedule.save();
    cursor.save();
  }
}

export function handleVestingScheduleEndDateUpdated_v3(event: VestingScheduleEndDateUpdated_v3): void {
  const ev = createVestingScheduleEndDateUpdatedEventEntity(event, "v3");
  ev.save();

  const cursor = getOrCreateTokenSenderReceiverCursor(
    ev.superToken,
    ev.sender,
    ev.receiver,
    "v3"
  );

  const currentVestingSchedule = getVestingSchedule(cursor);

  if (currentVestingSchedule) {
    currentVestingSchedule.endDate = ev.endDate;
    currentVestingSchedule.flowRate = event.params.newFlowRate;
    currentVestingSchedule.remainderAmount = ev.remainderAmount;

    let events = currentVestingSchedule.events;
    events.push(ev.id);
    currentVestingSchedule.events = events;

    const vestingScheduler = VestingScheduler_v3.bind(event.address);
    const endValidBeforeSeconds = vestingScheduler.END_DATE_VALID_BEFORE();
    currentVestingSchedule.endDateValidAt = ev.endDate.minus(endValidBeforeSeconds); // Note: this will be used for the new end vesting task in `createTask`

    // Cancel current/olds end vesting task
    if (cursor.currentEndVestingTask) {
      const task = Task.load(cursor.currentEndVestingTask!)!;
      task.cancelledAt = ev.timestamp;
      task.save();
    }
    // ---

    // Create a new task
    const newEndVestingTask = createTask(
      currentVestingSchedule,
      "ExecuteEndVesting",
      event.transaction.hash.toHexString(),
      event.logIndex,
      "v3"
    );
    cursor.currentEndVestingTask = newEndVestingTask.id;
    newEndVestingTask.save();
    // ---

    // Update the total amount
    const totalVestedAmount =
      vestingScheduler.getTotalVestedAmount(
        Address.fromBytes(currentVestingSchedule.superToken),
        Address.fromBytes(currentVestingSchedule.sender),
        Address.fromBytes(currentVestingSchedule.receiver)
      );
    currentVestingSchedule.totalAmount = totalVestedAmount;
    // ---

    currentVestingSchedule.save();
    cursor.save();
  }
}