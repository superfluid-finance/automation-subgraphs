import { BigInt } from "@graphprotocol/graph-ts";
import { VestingScheduleUpdatedEvent } from "../types/schema";
import { VestingScheduleUpdated } from "../types/VestingScheduler/VestingScheduler";
import { VestingScheduleUpdated as VestingScheduleUpdated_v2 } from "../types/VestingScheduler_v2/VestingScheduler";
import { createEventID, setBaseProperties } from "./general";

export function createVestingUpdatedEntity_v1(
  event: VestingScheduleUpdated,
  contractVersion: string
): VestingScheduleUpdatedEvent {
  let ev = new VestingScheduleUpdatedEvent(
    createEventID("VestingScheduleUpdated", event, contractVersion)
  );

  ev = setBaseProperties("VestingScheduleUpdatedEvent", event, ev, [
    event.params.sender,
    event.params.receiver,
  ]) as VestingScheduleUpdatedEvent;

  ev.superToken = event.params.superToken;
  ev.sender = event.params.sender;
  ev.receiver = event.params.receiver;
  ev.oldEndDate = event.params.oldEndDate;
  ev.endDate = event.params.endDate;

  ev.remainderAmount = BigInt.fromI32(0);

  return ev;
}

export function createVestingUpdatedEntity_v2(
  event: VestingScheduleUpdated_v2,
  contractVersion: string
): VestingScheduleUpdatedEvent {
  let ev = new VestingScheduleUpdatedEvent(
    createEventID("VestingScheduleUpdated", event, contractVersion)
  );

  ev = setBaseProperties("VestingScheduleUpdatedEvent", event, ev, [
    event.params.sender,
    event.params.receiver,
  ]) as VestingScheduleUpdatedEvent;

  ev.superToken = event.params.superToken;
  ev.sender = event.params.sender;
  ev.receiver = event.params.receiver;
  ev.oldEndDate = event.params.oldEndDate;
  ev.endDate = event.params.endDate;
  
  ev.remainderAmount = event.params.remainderAmount;

  return ev;
}
