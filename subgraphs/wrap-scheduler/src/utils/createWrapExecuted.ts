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

  return ev;
}

