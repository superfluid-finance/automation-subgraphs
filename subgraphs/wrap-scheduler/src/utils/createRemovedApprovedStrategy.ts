import {  RemovedApprovedStrategy } from "../types/WrapScheduler/WrapManager";
import {  RemovedApprovedStrategyEvent } from "../types/schema";
import { createEventID, setBaseProperties } from "./general";

export function createRemovedApprovedStrategyEventEntity(
    event: RemovedApprovedStrategy
  ): RemovedApprovedStrategyEvent {
    let ev = new RemovedApprovedStrategyEvent(
      createEventID("RemovedApprovedStrategy", event)
    );
    
    ev = setBaseProperties("RemovedApprovedStrategy", event, ev, [
        ev.strategy
    ]) as RemovedApprovedStrategyEvent;
  
    ev.strategy = event.params.strategy;
    return ev;
  }
