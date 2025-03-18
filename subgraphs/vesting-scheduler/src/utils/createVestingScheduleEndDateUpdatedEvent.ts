import { VestingScheduleEndDateUpdatedEvent } from "../types/schema";
import { createEventID, setBaseProperties } from "./general";
import { VestingScheduleEndDateUpdated as VestingScheduleEndDateUpdated_v3 } from "../types/VestingScheduler_v3/VestingScheduler";

export function createVestingScheduleEndDateUpdatedEventEntity(
  event: VestingScheduleEndDateUpdated_v3,
  contractVersion: string
): VestingScheduleEndDateUpdatedEvent {
  let ev = new VestingScheduleEndDateUpdatedEvent(
    createEventID("VestingScheduleEndDateUpdated", event, contractVersion)
  );

  ev = setBaseProperties("VestingScheduleEndDateUpdatedEvent", event, ev, [
    event.params.sender,
    event.params.receiver,
  ]) as VestingScheduleEndDateUpdatedEvent;

  ev.superToken = event.params.superToken;
  ev.sender = event.params.sender;
  ev.receiver = event.params.receiver;
  ev.oldEndDate = event.params.oldEndDate;
  ev.endDate = event.params.endDate;
  ev.remainderAmount = event.params.remainderAmount;

  return ev;
}