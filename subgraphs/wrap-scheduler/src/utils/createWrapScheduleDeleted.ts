import {  WrapScheduleDeletedEvent } from "../types/schema";
import { WrapScheduleDeleted } from "../types/WrapScheduler/WrapManager";
import { createEventID, setBaseProperties } from "./general";

export function createWrapScheduleDeletedEventEntity(
  event: WrapScheduleDeleted
): WrapScheduleDeletedEvent {
  let ev = new WrapScheduleDeletedEvent(
    createEventID("WrapScheduleDeletedEvent", event)
  );

  ev = setBaseProperties("WrapScheduleDeletedEvent", event, ev, [
    event.params.id,
    event.params.liquidityToken,
    event.params.strategy,
    event.params.superToken,
    event.params.user,
  ]) as WrapScheduleDeletedEvent;

  ev.liquidityToken = event.params.liquidityToken;
  ev.strategy = event.params.strategy;
  ev.superToken = event.params.superToken;
  ev.account = event.params.user;
  ev.wrapScheduleId = event.params.id;
  return ev;
}
