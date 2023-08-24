import { VestingEndExecutedEvent } from "../types/schema";
import { VestingEndExecuted } from "../types/VestingScheduler/VestingScheduler";
import { createEventID, setBaseProperties } from "./general";

export function createVestingEndExecutedEventEntity(
  event: VestingEndExecuted
): VestingEndExecutedEvent {
  let ev = new VestingEndExecutedEvent(
    createEventID("VestingEndExecuted", event)
  );

  ev = setBaseProperties("VestingEndExecutedEvent", event, ev, [
    event.params.sender,
    event.params.receiver,
  ]) as VestingEndExecutedEvent;

  ev.superToken = event.params.superToken;
  ev.sender = event.params.sender;
  ev.receiver = event.params.receiver;
  ev.endDate = event.params.endDate;
  ev.earlyEndCompensation = event.params.earlyEndCompensation;
  ev.didCompensationFail = event.params.didCompensationFail;

  return ev;
}
