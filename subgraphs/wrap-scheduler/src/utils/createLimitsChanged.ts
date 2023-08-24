import { LimitsChanged } from "../types/WrapScheduler/WrapManager";
import { LimitsChangedEvent } from "../types/schema";
import { createEventID, setBaseProperties } from "./general";

export function createLimitsChangedEventEntity(
    event: LimitsChanged
  ): LimitsChangedEvent {
    let ev = new LimitsChangedEvent(
      createEventID("LimitsChanged", event)
    );

    ev = setBaseProperties("LimitsChanged", event, ev, []) as LimitsChangedEvent;

    ev.upperLimit = event.params.upperLimit;
    ev.lowerLimit = event.params.lowerLimit;

    return ev;
  }
