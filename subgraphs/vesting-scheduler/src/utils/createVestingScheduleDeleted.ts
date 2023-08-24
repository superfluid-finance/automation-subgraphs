import { VestingScheduleDeletedEvent } from "../types/schema";
import { VestingScheduleDeleted } from "../types/VestingScheduler/VestingScheduler";
import { createEventID, setBaseProperties } from "./general";

export function createVestingScheduleDeletedEventEntity(
  event: VestingScheduleDeleted
): VestingScheduleDeletedEvent {
  let ev = new VestingScheduleDeletedEvent(
    createEventID("VestingScheduleDeleted", event)
  );

  ev = setBaseProperties("VestingScheduleDeletedEvent", event, ev, [
    event.params.sender,
    event.params.receiver,
  ]) as VestingScheduleDeletedEvent;

  ev.sender = event.params.sender;
  ev.receiver = event.params.receiver;
  ev.superToken = event.params.superToken;

  return ev;
}
