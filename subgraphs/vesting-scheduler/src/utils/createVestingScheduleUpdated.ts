import { VestingScheduleUpdatedEvent } from "../types/schema";
import { VestingScheduleUpdated } from "../types/VestingScheduler/VestingScheduler";
import { createEventID, setBaseProperties } from "./general";

export function createVestingUpdatedEntity(
  event: VestingScheduleUpdated
): VestingScheduleUpdatedEvent {
  let ev = new VestingScheduleUpdatedEvent(
    createEventID("VestingScheduleUpdated", event)
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

  return ev;
}
