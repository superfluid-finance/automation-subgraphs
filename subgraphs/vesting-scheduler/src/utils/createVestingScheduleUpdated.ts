import { BigInt } from "@graphprotocol/graph-ts";
import { VestingSchedule, VestingScheduleUpdatedEvent } from "../types/schema";
import { VestingScheduleUpdated } from "../types/VestingScheduler/VestingScheduler";
import { VestingScheduleUpdated as VestingScheduleUpdated_v2 } from "../types/VestingScheduler_v2/VestingScheduler";
import { VestingScheduleUpdated as VestingScheduleUpdated_v3 } from "../types/VestingScheduler_v3/VestingScheduler";
import { createEventID, setBaseProperties } from "./general";

export function createVestingUpdatedEntity_v3(
  event: VestingScheduleUpdated_v3,
  contractVersion: string,
  vestingSchedule: VestingSchedule
): VestingScheduleUpdatedEvent {
  let ev = new VestingScheduleUpdatedEvent(
    createEventID("VestingScheduleUpdated", event, contractVersion)
  );

  ev = setBaseProperties("VestingScheduleUpdatedEvent", event, ev, [
    event.params.sender,
    event.params.receiver,
    event.params.superToken,
  ]) as VestingScheduleUpdatedEvent;

  ev.superToken = event.params.superToken;
  ev.sender = event.params.sender;
  ev.receiver = event.params.receiver;

  ev.endDate = event.params.endDate;
  ev.oldEndDate = vestingSchedule.endDate;

  ev.flowRate = event.params.flowRate;
  ev.oldFlowRate = vestingSchedule.flowRate;

  ev.remainderAmount = event.params.remainderAmount;
  ev.oldRemainderAmount = vestingSchedule.remainderAmount;

  ev.totalAmount = event.params.totalAmount;
  ev.oldTotalAmount = vestingSchedule.totalAmount;

  ev.settledAmount = event.params.settledAmount;

  return ev;
}

export function createVestingUpdatedEntity_v2(
  event: VestingScheduleUpdated_v2,
  contractVersion: string,
  vestingSchedule: VestingSchedule
): VestingScheduleUpdatedEvent {
  let ev = new VestingScheduleUpdatedEvent(
    createEventID("VestingScheduleUpdated", event, contractVersion)
  );

  ev = setBaseProperties("VestingScheduleUpdatedEvent", event, ev, [
    event.params.sender,
    event.params.receiver,
    event.params.superToken,
  ]) as VestingScheduleUpdatedEvent;

  ev.superToken = event.params.superToken;
  ev.sender = event.params.sender;
  ev.receiver = event.params.receiver;

  ev.endDate = event.params.endDate;
  ev.oldEndDate = event.params.oldEndDate;

  ev.remainderAmount = event.params.remainderAmount;
  ev.oldRemainderAmount = vestingSchedule.remainderAmount;

  // Note: flow rate can't change in V2.
  ev.flowRate = vestingSchedule.flowRate;
  ev.oldFlowRate = vestingSchedule.flowRate;

  // Note: Settled amount alway 0 in V2.
  ev.settledAmount = BigInt.fromI32(0);

  ev.oldTotalAmount = vestingSchedule.totalAmount;
  // This needs to be set after the vesting schedule has been updated! So, outside this function.
  ev.totalAmount = BigInt.fromI32(0);

  return ev;
}

export function createVestingUpdatedEntity_v1(
  event: VestingScheduleUpdated,
  contractVersion: string,
  vestingSchedule: VestingSchedule
): VestingScheduleUpdatedEvent {
  let ev = new VestingScheduleUpdatedEvent(
    createEventID("VestingScheduleUpdated", event, contractVersion)
  );

  ev = setBaseProperties("VestingScheduleUpdatedEvent", event, ev, [
    event.params.sender,
    event.params.receiver,
    event.params.superToken,
  ]) as VestingScheduleUpdatedEvent;

  ev.superToken = event.params.superToken;
  ev.sender = event.params.sender;
  ev.receiver = event.params.receiver;

  ev.oldEndDate = event.params.oldEndDate;
  ev.endDate = event.params.endDate;

  // Note: flow rate can't change in V1.
  ev.flowRate = vestingSchedule.flowRate;
  ev.oldFlowRate = vestingSchedule.flowRate;

  // Note: Remainder alway 0 in V1.
  ev.oldRemainderAmount = BigInt.fromI32(0);
  ev.remainderAmount = BigInt.fromI32(0);

  // Note: Settled amount alway 0 in V1.
  ev.settledAmount = BigInt.fromI32(0);

  ev.oldTotalAmount = vestingSchedule.totalAmount;
  // This needs to be set after the vesting schedule has been updated! So, outside this function.
  ev.totalAmount = BigInt.fromI32(0);

  return ev;
}