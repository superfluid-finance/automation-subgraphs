import { log } from "@graphprotocol/graph-ts";
import { CreateFlowExecuted } from "../types/FlowScheduler/FlowScheduler";
import { CreateFlowExecutedEvent } from "../types/schema";
import { createEventID, setBaseProperties } from "./general";

export function createCreateFlowExecutedEventEntity(
  event: CreateFlowExecuted
): CreateFlowExecutedEvent {
  let ev = new CreateFlowExecutedEvent(
    createEventID("CreateFlowExecuted", event)
  );

  ev = setBaseProperties("CreateFlowExecutedEvent", event, ev, [
    event.params.sender,
    event.params.receiver,
  ]) as CreateFlowExecutedEvent;

  ev.superToken = event.params.superToken;
  ev.sender = event.params.sender;
  ev.receiver = event.params.receiver;

  ev.startDate = event.params.startDate;
  ev.startDateMaxDelay = event.params.startMaxDelay;
  ev.flowRate = event.params.flowRate;
  ev.startAmount = event.params.startAmount;
  ev.userData = event.params.userData;

  const receipt = event.receipt;
  if (receipt) {
    ev.gasUsed = receipt.gasUsed;
  } else {
      log.critical("receipt MUST NOT be null, set `receipt: true` under `eventHandlers` in the manifest file", []);
  }

  return ev;
}
