import {
    AddedApprovedStrategy,
    LimitsChanged,
    RemovedApprovedStrategy,
    WrapExecuted,
    WrapScheduleCreated,
    WrapScheduleDeleted
} from "../types/WrapScheduler/WrapManager";
import {createWrapExecutedEventEntity as createWrapExecutedEventEntity} from "../utils/createWrapExecuted";

import {
    createWrapScheduleCreatedEventEntity as createWrapScheduleCreatedEventEntity
} from "../utils/createWrapScheduleCreated";
import {
    createWrapScheduleDeletedEventEntity as createWrapScheduleDeletedEventEntity
} from "../utils/createWrapScheduleDeleted";

import {
    getOrCreateUserTokenLiquidityTokenCursor as getOrCreateUserTokenLiquidityTokenCursor
} from "../utils/tokenSenderReceiverCursor";
import {
    createWrapSchedule,
    getWrapSchedule,
} from "../utils/wrapSchedule";
import {createAddedApprovedStrategyEventEntity} from "../utils/createAddedApprovedStrategy";
import {createRemovedApprovedStrategyEventEntity} from "../utils/createRemovedApprovedStrategy";
import {createLimitsChangedEventEntity} from "../utils/createLimitsChanged";


export function handleWrapScheduleCreated(
    event: WrapScheduleCreated
): void {
    const ev = createWrapScheduleCreatedEventEntity(event);
    ev.save();

    const cursor = getOrCreateUserTokenLiquidityTokenCursor(
        ev.wrapScheduleId
    );

    const oldWrapSchedule = getWrapSchedule(cursor);
    if (oldWrapSchedule) {
        oldWrapSchedule.isActive = false;
        oldWrapSchedule.save();
    }

    const currentWrapSchedule = createWrapSchedule(ev, event.address);
    cursor.currentWrapSchedule = currentWrapSchedule.id;
    currentWrapSchedule.save();
    cursor.save();
}

export function handleWrapScheduleDeleted(
    event: WrapScheduleDeleted
): void {
    const ev = createWrapScheduleDeletedEventEntity(event);
    ev.save();

    const cursor = getOrCreateUserTokenLiquidityTokenCursor(
        ev.wrapScheduleId
    );

    const currentWrapSchedule = getWrapSchedule(cursor);

    if (currentWrapSchedule) {
        currentWrapSchedule.deletedAt = ev.timestamp;
        currentWrapSchedule.isActive = false;
        currentWrapSchedule.updatedAt = ev.timestamp;
        currentWrapSchedule.updatedBlockNumber = ev.blockNumber;
        let events = currentWrapSchedule.events;
        events.push(ev.id);
        currentWrapSchedule.events = events;
        currentWrapSchedule.save();
    }

    cursor.currentWrapSchedule = null;
    cursor.save();
}


export function handleWrapExecuted(
    event: WrapExecuted
): void {
    const ev = createWrapExecutedEventEntity(event);
    ev.save();

    const cursor = getOrCreateUserTokenLiquidityTokenCursor(
        ev.wrapScheduleId
    );

    const currentWrapSchedule = getWrapSchedule(cursor);

    if (currentWrapSchedule) {
        currentWrapSchedule.lastExecutedAt = ev.timestamp;
        currentWrapSchedule.amount = ev.amount;

        currentWrapSchedule.updatedAt = ev.timestamp;
        currentWrapSchedule.updatedBlockNumber = ev.blockNumber;

        let events = currentWrapSchedule.events;
        events.push(ev.id);
        currentWrapSchedule.events = events;
        currentWrapSchedule.save();
        cursor.save();
    }
}

export function handleAddedApprovedStrategy(
    event: AddedApprovedStrategy
): void {
    const ev = createAddedApprovedStrategyEventEntity(event);
    ev.save();
}

export function handleRemovedApprovedStrategy(
    event: RemovedApprovedStrategy
): void {
    const ev = createRemovedApprovedStrategyEventEntity(event);
    ev.save();
}

export function handleLimitsChanged(
    event: LimitsChanged
): void {
    const ev = createLimitsChangedEventEntity(event);
    ev.save();
}
