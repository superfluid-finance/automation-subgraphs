import { log } from "@graphprotocol/graph-ts";
import { WrapExecutedEvent } from "../types/schema";
import { WrapExecuted } from "../types/WrapScheduler/WrapManager";
import { createEventID, setBaseProperties } from "./general";

export function createWrapExecutedEventEntity(
  event: WrapExecuted
): WrapExecutedEvent {
  let ev = new WrapExecutedEvent(
    createEventID("WrapExecuted", event)
  );
  
  ev = setBaseProperties("WrapExecuted", event, ev, [
    event.params.id,
  ]) as WrapExecutedEvent;

  ev.wrapScheduleId = event.params.id;
  ev.amount = event.params.wrapAmount;

  const receipt = event.receipt;
  if (receipt) {
    ev.gasUsed = receipt.gasUsed;
  } else {
      log.critical("receipt MUST NOT be null, set `receipt: true` under `eventHandlers` in the manifest file", []);
  }

  return ev;
}

