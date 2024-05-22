import { log } from "@graphprotocol/graph-ts";
import { WrapExecutedEvent } from "../types/schema";
import { WrapExecuted } from "../types/WrapScheduler/WrapManager";
import { createEventID, setBaseProperties } from "./general";
import { getWrapSchedule } from "./wrapSchedule";
import { getOrCreateUserTokenLiquidityTokenCursor } from "./cursor";

export function createWrapExecutedEventEntity(
  event: WrapExecuted
): WrapExecutedEvent {
  let ev = new WrapExecutedEvent(
    createEventID("WrapExecuted", event)
  );

  ev.wrapScheduleId = event.params.id;
  const cursor = getOrCreateUserTokenLiquidityTokenCursor(
      ev.wrapScheduleId
  );
  const wrapSchedule = getWrapSchedule(cursor)!;
  
  ev = setBaseProperties("WrapExecuted", event, ev, [
    wrapSchedule.strategy,
    wrapSchedule.account,
    wrapSchedule.superToken,
    wrapSchedule.liquidityToken,
  ]) as WrapExecutedEvent;

  ev.amount = event.params.wrapAmount;

  const receipt = event.receipt;
  if (receipt) {
    ev.gasUsed = receipt.gasUsed;
  } else {
      log.critical("receipt MUST NOT be null, set `receipt: true` under `eventHandlers` in the manifest file", []);
  }

  return ev;
}

