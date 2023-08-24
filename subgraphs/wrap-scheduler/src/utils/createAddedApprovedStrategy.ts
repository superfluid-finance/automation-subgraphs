import { AddedApprovedStrategy } from "../types/WrapScheduler/WrapManager";
import { AddedApprovedStrategyEvent } from "../types/schema";
import { createEventID, setBaseProperties } from "./general";

export function createAddedApprovedStrategyEventEntity(
    event: AddedApprovedStrategy
  ): AddedApprovedStrategyEvent {
    let ev = new AddedApprovedStrategyEvent(
      createEventID("AddedApprovedStrategy", event)
    );
    
    
    ev = setBaseProperties("AddedApprovedStrategy", event, ev, [
        ev.strategy
    ]) as AddedApprovedStrategyEvent;
  
    ev.strategy = event.params.strategy;
    
    return ev;
  }
