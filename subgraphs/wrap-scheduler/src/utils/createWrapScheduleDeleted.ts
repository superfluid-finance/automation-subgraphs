import {  WrapScheduleDeletedEvent } from "../types/schema";
import { WrapScheduleDeleted } from "../types/WrapScheduler/WrapManager";
import { getOrCreateUserTokenLiquidityTokenCursor } from "./cursor";
import { createEventID, setBaseProperties } from "./general";
import { getWrapSchedule } from "./wrapSchedule";

export function createWrapScheduleDeletedEventEntity(
  event: WrapScheduleDeleted
): WrapScheduleDeletedEvent {
  let ev = new WrapScheduleDeletedEvent(
    createEventID("WrapScheduleDeletedEvent", event)
  );

  ev.wrapScheduleId = event.params.id;
  const cursor = getOrCreateUserTokenLiquidityTokenCursor(
      ev.wrapScheduleId
  );
  const wrapSchedule = getWrapSchedule(cursor)!;

  ev = setBaseProperties("WrapScheduleDeletedEvent", event, ev, [
    wrapSchedule.strategy,
    wrapSchedule.account,
    wrapSchedule.superToken,
    wrapSchedule.liquidityToken,
  ]) as WrapScheduleDeletedEvent;

  ev.liquidityToken = event.params.liquidityToken;
  ev.strategy = event.params.strategy;
  ev.superToken = event.params.superToken;
  ev.account = event.params.user;

  return ev;
}
