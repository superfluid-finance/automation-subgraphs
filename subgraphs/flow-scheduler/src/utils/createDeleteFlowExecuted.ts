import { log } from "@graphprotocol/graph-ts";
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
    event.params.superToken,
  ]) as DeleteFlowExecutedEvent;

  ev.superToken = event.params.superToken;
  ev.sender = event.params.sender;
  ev.receiver = event.params.receiver;

  ev.endDate = event.params.endDate;
  ev.userData = event.params.userData;

  const receipt = event.receipt;
  if (receipt) {
    ev.gasUsed = receipt.gasUsed;
  } else {
      log.critical("receipt MUST NOT be null, set `receipt: true` under `eventHandlers` in the manifest file", []);
  }

  return ev;
}
