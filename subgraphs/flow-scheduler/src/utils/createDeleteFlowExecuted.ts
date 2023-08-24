import { DeleteFlowExecuted } from "../types/FlowScheduler/FlowScheduler";
import { DeleteFlowExecutedEvent } from "../types/schema";
import { createEventID, setBaseProperties } from "./general";

export function createDeleteFlowExecutedEventEntity(
  event: DeleteFlowExecuted
): DeleteFlowExecutedEvent {
  let ev = new DeleteFlowExecutedEvent(
    createEventID("DeleteFlowExecuted", event)
  );

  ev = setBaseProperties("DeleteFlowExecutedEvent", event, ev, [
    event.params.sender,
    event.params.receiver,
  ]) as DeleteFlowExecutedEvent;

  ev.superToken = event.params.superToken;
  ev.sender = event.params.sender;
  ev.receiver = event.params.receiver;

  ev.endDate = event.params.endDate;
  ev.userData = event.params.userData;

  return ev;
}
