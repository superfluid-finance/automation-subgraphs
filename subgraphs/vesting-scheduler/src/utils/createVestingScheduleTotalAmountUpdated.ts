import { VestingScheduleTotalAmountUpdated as VestingScheduleTotalAmountUpdated_v3 } from "../types/VestingScheduler_v3/VestingScheduler";
import { VestingScheduleTotalAmountUpdatedEvent } from "../types/schema";
import { createEventID, setBaseProperties } from "./general";

export function createVestingScheduleTotalAmountUpdatedEventEntity(
    event: VestingScheduleTotalAmountUpdated_v3,
    contractVersion: string
): VestingScheduleTotalAmountUpdatedEvent {
    let ev = new VestingScheduleTotalAmountUpdatedEvent(
        createEventID("VestingScheduleTotalAmountUpdated", event, contractVersion)
    );

    ev = setBaseProperties("VestingScheduleTotalAmountUpdated", event, ev, [
        event.params.sender, 
        event.params.receiver
    ]) as VestingScheduleTotalAmountUpdatedEvent;

    ev.sender = event.params.sender;
    ev.receiver = event.params.receiver;
    ev.superToken = event.params.superToken;

    ev.previousFlowRate = event.params.previousFlowRate;
    ev.newFlowRate = event.params.newFlowRate;
    ev.previousTotalAmount = event.params.previousTotalAmount;
    ev.newTotalAmount = event.params.newTotalAmount;
    ev.remainderAmount = event.params.remainderAmount;

    return ev;
}
