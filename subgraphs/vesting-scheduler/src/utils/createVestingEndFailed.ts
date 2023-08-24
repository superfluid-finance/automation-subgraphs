import { VestingEndFailedEvent } from "../types/schema";
import { VestingEndFailed } from "../types/VestingScheduler/VestingScheduler";
import { createEventID, setBaseProperties } from "./general";

export function createVestingEndFailedEventEntity(
  event: VestingEndFailed
): VestingEndFailedEvent {
  let ev = new VestingEndFailedEvent(createEventID("VestingEndFailed", event));

  ev = setBaseProperties("VestingEndFailedEvent", event, ev, [
    event.params.sender,
    event.params.receiver,
  ]) as VestingEndFailedEvent;

  ev.superToken = event.params.superToken;
  ev.sender = event.params.sender;
  ev.receiver = event.params.receiver;
  ev.endDate = event.params.endDate;

  return ev;
}
