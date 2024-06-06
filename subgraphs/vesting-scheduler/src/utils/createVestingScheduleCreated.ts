import { BigInt } from "@graphprotocol/graph-ts";
import { VestingScheduleCreatedEvent } from "../types/schema";
import { createEventID, setBaseProperties } from "./general";
import { VestingScheduleCreated as VestingScheduleCreated_v2 } from "../types/VestingScheduler_v2/VestingScheduler";
import { VestingScheduleCreated } from "../types/VestingScheduler/VestingScheduler";

export function createVestingScheduleCreatedEventEntity_v2(
  event: VestingScheduleCreated_v2
): VestingScheduleCreatedEvent {
  let ev = new VestingScheduleCreatedEvent(
    createEventID("VestingScheduleCreated", event, "v2")
  );

  ev = setBaseProperties("VestingScheduleCreatedEvent", event, ev, [
    event.params.sender,
    event.params.receiver,
  ]) as VestingScheduleCreatedEvent;

  ev.superToken = event.params.superToken;
  ev.sender = event.params.sender;
  ev.receiver = event.params.receiver;

  ev.startDate = event.params.startDate;
  ev.cliffDate = event.params.cliffDate;
  ev.flowRate = event.params.flowRate;
  ev.endDate = event.params.endDate;
  ev.cliffAmount = event.params.cliffAmount;
  
  ev.claimValidityDate = event.params.claimValidityDate;

  return ev;
}

export function createVestingScheduleCreatedEventEntity_v1(
  event: VestingScheduleCreated
): VestingScheduleCreatedEvent {
  let ev = new VestingScheduleCreatedEvent(
    createEventID("VestingScheduleCreated", event, "v1")
  );

  ev = setBaseProperties("VestingScheduleCreatedEvent", event, ev, [
    event.params.sender,
    event.params.receiver,
  ]) as VestingScheduleCreatedEvent;

  ev.superToken = event.params.superToken;
  ev.sender = event.params.sender;
  ev.receiver = event.params.receiver;

  ev.startDate = event.params.startDate;
  ev.cliffDate = event.params.cliffDate;
  ev.flowRate = event.params.flowRate;
  ev.endDate = event.params.endDate;
  ev.cliffAmount = event.params.cliffAmount;
  
  ev.claimValidityDate = BigInt.fromI32(0);

  return ev;
}
