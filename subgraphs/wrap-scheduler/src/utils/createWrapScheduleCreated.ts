import {  WrapSchedule, WrapScheduleCreatedEvent } from "../types/schema";
import { WrapScheduleCreated } from "../types/WrapScheduler/WrapManager";
import { createEventID, setBaseProperties } from "./general";

export function createWrapScheduleCreatedEventEntity(
  event: WrapScheduleCreated
): WrapScheduleCreatedEvent {
  let ev = new WrapScheduleCreatedEvent(
    createEventID("WrapScheduleCreated", event)
  );

  ev.wrapScheduleId = event.params.id;
  ev = setBaseProperties("WrapScheduleCreatedEvent", event, ev, [
    event.params.strategy,
    event.params.user,
    event.params.superToken,
    event.params.liquidityToken,
  ]) as WrapScheduleCreatedEvent;

  ev.account = event.params.user;
  ev.superToken = event.params.superToken;
  ev.strategy = event.params.strategy;
  ev.liquidityToken = event.params.liquidityToken;
  ev.expiry = event.params.expiry;
  ev.lowerLimit = event.params.lowerLimit;
  ev.upperLimit = event.params.upperLimit;

  ev.superToken = event.params.superToken;
  
  return ev;
}
