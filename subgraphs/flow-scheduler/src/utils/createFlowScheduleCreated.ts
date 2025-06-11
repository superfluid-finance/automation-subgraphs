import { FlowScheduleCreated } from "../types/FlowScheduler/FlowScheduler";
import { FlowScheduleCreatedEvent } from "../types/schema";
import { createEventID, setBaseProperties } from "./general";

export function createFlowScheduleCreatedEventEntity(
  event: FlowScheduleCreated
): FlowScheduleCreatedEvent {
  let ev = new FlowScheduleCreatedEvent(
    createEventID("FlowScheduleCreated", event)
  );

  ev = setBaseProperties("FlowScheduleCreatedEvent", event, ev, [
    event.params.sender,
    event.params.receiver,
    event.params.superToken,
  ]) as FlowScheduleCreatedEvent;

  ev.superToken = event.params.superToken;
  ev.sender = event.params.sender;
  ev.receiver = event.params.receiver;

  ev.startDate = event.params.startDate;
  ev.startDateMaxDelay = event.params.startMaxDelay;
  ev.flowRate = event.params.flowRate;
  ev.endDate = event.params.endDate;
  ev.startAmount = event.params.startAmount;
  ev.userData = event.params.userData;

  return ev;
}
