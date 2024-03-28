import { VestingScheduleCreatedEvent } from "../types/schema";
import { VestingScheduleCreated } from "../types/VestingScheduler/VestingScheduler";
import { createEventID, setBaseProperties } from "./general";

export function createVestingScheduleCreatedEventEntity(
  event: VestingScheduleCreated,
  contractVersion: string
): VestingScheduleCreatedEvent {
  let ev = new VestingScheduleCreatedEvent(
    createEventID("VestingScheduleCreated", event, contractVersion)
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

  return ev;
}
