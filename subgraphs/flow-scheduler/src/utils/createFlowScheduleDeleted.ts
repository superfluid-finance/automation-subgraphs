import { FlowScheduleDeleted } from "../types/FlowScheduler/FlowScheduler";
import { FlowScheduleDeletedEvent } from "../types/schema";
import { createEventID, setBaseProperties } from "./general";

export function createFlowScheduleDeletedEventEntity(
  event: FlowScheduleDeleted
): FlowScheduleDeletedEvent {
  let ev = new FlowScheduleDeletedEvent(
    createEventID("FlowScheduleDeleted", event)
  );

  ev = setBaseProperties("FlowScheduleDeletedEvent", event, ev, [
    event.params.sender,
    event.params.receiver,
    event.params.superToken,
  ]) as FlowScheduleDeletedEvent;

  ev.superToken = event.params.superToken;
  ev.sender = event.params.sender;
  ev.receiver = event.params.receiver;

  return ev;
}
