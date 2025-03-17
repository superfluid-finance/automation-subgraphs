"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleVestingCliffAndFlowExecuted_v1 = handleVestingCliffAndFlowExecuted_v1;
exports.handleVestingCliffAndFlowExecuted_v2 = handleVestingCliffAndFlowExecuted_v2;
exports.handleVestingScheduleCreated_v1 = handleVestingScheduleCreated_v1;
exports.handleVestingScheduleCreated_v2 = handleVestingScheduleCreated_v2;
exports.handleVestingScheduleCreated_v3 = handleVestingScheduleCreated_v3;
exports.handleVestingScheduleDeleted_v1 = handleVestingScheduleDeleted_v1;
exports.handleVestingScheduleDeleted_v2 = handleVestingScheduleDeleted_v2;
exports.handleVestingScheduleDeleted_v3 = handleVestingScheduleDeleted_v3;
exports.handleVestingScheduleUpdated_v1 = handleVestingScheduleUpdated_v1;
exports.handleVestingScheduleUpdated_v2 = handleVestingScheduleUpdated_v2;
exports.handleVestingScheduleUpdated_v3 = handleVestingScheduleUpdated_v3;
exports.handleVestingEndExecuted_v1 = handleVestingEndExecuted_v1;
exports.handleVestingEndExecuted_v2 = handleVestingEndExecuted_v2;
exports.handleVestingEndExecuted_v3 = handleVestingEndExecuted_v3;
exports.handleVestingEndFailed_v1 = handleVestingEndFailed_v1;
exports.handleVestingEndFailed_v2 = handleVestingEndFailed_v2;
exports.handleVestingEndFailed_v3 = handleVestingEndFailed_v3;
exports.handleVestingClaimed_v2 = handleVestingClaimed_v2;
exports.handleVestingClaimed_v3 = handleVestingClaimed_v3;
exports.handleVestingScheduleTotalAmountUpdated_v3 = handleVestingScheduleTotalAmountUpdated_v3;
exports.handleVestingScheduleEndDateUpdated_v3 = handleVestingScheduleEndDateUpdated_v3;
const graph_ts_1 = require("@graphprotocol/graph-ts");
const schema_1 = require("../types/schema");
const VestingScheduler_1 = require("../types/VestingScheduler/VestingScheduler");
const createTask_1 = require("../utils/createTask");
const createVestingCliffAndFlowExecuted_1 = require("../utils/createVestingCliffAndFlowExecuted");
const createVestingEndExecuted_1 = require("../utils/createVestingEndExecuted");
const createVestingEndFailed_1 = require("../utils/createVestingEndFailed");
const createVestingScheduleCreated_1 = require("../utils/createVestingScheduleCreated");
const createVestingScheduleDeleted_1 = require("../utils/createVestingScheduleDeleted");
const createVestingScheduleUpdated_1 = require("../utils/createVestingScheduleUpdated");
const tokenSenderReceiverCursor_1 = require("../utils/tokenSenderReceiverCursor");
const vestingSchedule_1 = require("../utils/vestingSchedule");
const createVestingClaimed_1 = require("../utils/createVestingClaimed");
const graph_ts_2 = require("@graphprotocol/graph-ts");
function handleVestingCliffAndFlowExecuted_v1(event) {
    _handleVestingCliffAndFlowExecuted(event, "v1");
}
function handleVestingCliffAndFlowExecuted_v2(event) {
    _handleVestingCliffAndFlowExecuted(event, "v2");
}
function _handleVestingCliffAndFlowExecuted(event, contractVersion) {
    const ev = (0, createVestingCliffAndFlowExecuted_1.createVestingCliffAndFlowExecutedEntity)(event, contractVersion);
    ev.save();
    const cursor = (0, tokenSenderReceiverCursor_1.getOrCreateTokenSenderReceiverCursor)(ev.superToken, ev.sender, ev.receiver, contractVersion);
    const currentVestingSchedule = (0, vestingSchedule_1.getVestingSchedule)(cursor);
    if (currentVestingSchedule) {
        currentVestingSchedule.cliffAndFlowExecutedAt = ev.timestamp;
        let events = currentVestingSchedule.events;
        events.push(ev.id);
        currentVestingSchedule.events = events;
        currentVestingSchedule.save();
        if (cursor.currentCliffAndFlowTask) {
            const task = schema_1.Task.load(cursor.currentCliffAndFlowTask);
            task.executedAt = event.block.timestamp;
            task.save();
        }
        cursor.currentCliffAndFlowTask = null;
        cursor.save();
    }
}
function handleVestingScheduleCreated_v1(event) {
    const storedEvent = (0, createVestingScheduleCreated_1.createVestingScheduleCreatedEventEntity_v1)(event);
    storedEvent.save();
    _handleVestingScheduleCreated(event, storedEvent, "v1");
}
function handleVestingScheduleCreated_v2(event) {
    const storedEvent = (0, createVestingScheduleCreated_1.createVestingScheduleCreatedEventEntity_v2)(event);
    storedEvent.save();
    _handleVestingScheduleCreated(event, storedEvent, "v2");
}
function handleVestingScheduleCreated_v3(event) {
    const storedEvent = (0, createVestingScheduleCreated_1.createVestingScheduleCreatedEventEntity_v3)(event);
    storedEvent.save();
    _handleVestingScheduleCreated(event, storedEvent, "v3");
}
function _handleVestingScheduleCreated(event, storedEvent, contractVersion) {
    const currentVestingSchedule = (0, vestingSchedule_1.createVestingSchedule)(storedEvent, event.address, contractVersion);
    const cursor = (0, tokenSenderReceiverCursor_1.getOrCreateTokenSenderReceiverCursor)(storedEvent.superToken, storedEvent.sender, storedEvent.receiver, contractVersion);
    if (storedEvent.claimValidityDate == graph_ts_1.BigInt.fromI32(0)) {
        const cliffAndFlowTask = (0, createTask_1.createTask)(currentVestingSchedule, "ExecuteCliffAndFlow", event.transaction.hash.toHexString(), event.logIndex, contractVersion);
        cursor.currentCliffAndFlowTask = cliffAndFlowTask.id;
        cliffAndFlowTask.save();
    }
    else {
        cursor.currentCliffAndFlowTask = null;
    }
    const endVestingTask = (0, createTask_1.createTask)(currentVestingSchedule, "ExecuteEndVesting", event.transaction.hash.toHexString(), event.logIndex, contractVersion);
    cursor.currentVestingSchedule = currentVestingSchedule.id;
    cursor.currentEndVestingTask = endVestingTask.id;
    currentVestingSchedule.save();
    cursor.save();
    endVestingTask.save();
}
function handleVestingScheduleDeleted_v1(event) {
    _handleVestingScheduleDeleted(event, "v1");
}
function handleVestingScheduleDeleted_v2(event) {
    _handleVestingScheduleDeleted(event, "v2");
}
function handleVestingScheduleDeleted_v3(event) {
    _handleVestingScheduleDeleted(event, "v3");
}
function _handleVestingScheduleDeleted(event, contractVersion) {
    const ev = (0, createVestingScheduleDeleted_1.createVestingScheduleDeletedEventEntity)(event, contractVersion);
    ev.save();
    const cursor = (0, tokenSenderReceiverCursor_1.getOrCreateTokenSenderReceiverCursor)(ev.superToken, ev.sender, ev.receiver, contractVersion);
    const currentVestingSchedule = (0, vestingSchedule_1.getVestingSchedule)(cursor);
    if (currentVestingSchedule) {
        currentVestingSchedule.deletedAt = ev.timestamp;
        let events = currentVestingSchedule.events;
        events.push(ev.id);
        currentVestingSchedule.events = events;
        currentVestingSchedule.save();
    }
    if (cursor.currentCliffAndFlowTask) {
        const cliffAndFlowTask = schema_1.Task.load(cursor.currentCliffAndFlowTask);
        cliffAndFlowTask.cancelledAt = ev.timestamp;
        cursor.currentCliffAndFlowTask = null;
        cliffAndFlowTask.save();
    }
    if (cursor.currentEndVestingTask) {
        const endVestingTask = schema_1.Task.load(cursor.currentEndVestingTask);
        endVestingTask.cancelledAt = ev.timestamp;
        cursor.currentEndVestingTask = null;
        endVestingTask.save();
    }
    cursor.currentVestingSchedule = null;
    cursor.save();
}
function handleVestingScheduleUpdated_v1(event) {
    const storedEvent = (0, createVestingScheduleUpdated_1.createVestingUpdatedEntity_v1)(event, "v1");
    storedEvent.save();
    _handleVestingScheduleUpdated(event, storedEvent, "v1");
}
function handleVestingScheduleUpdated_v2(event) {
    const storedEvent = (0, createVestingScheduleUpdated_1.createVestingUpdatedEntity_v2)(event, "v2");
    storedEvent.save();
    _handleVestingScheduleUpdated(event, storedEvent, "v2");
}
function handleVestingScheduleUpdated_v3(event) {
    const storedEvent = (0, createVestingScheduleUpdated_1.createVestingUpdatedEntity_v3)(event, "v3");
    storedEvent.save();
    _handleVestingScheduleUpdated(event, storedEvent, "v3");
}
function _handleVestingScheduleUpdated(event, storedEvent, contractVersion) {
    const vestingScheduler = VestingScheduler_1.VestingScheduler.bind(event.address);
    const endValidBeforeSeconds = vestingScheduler.END_DATE_VALID_BEFORE();
    const cursor = (0, tokenSenderReceiverCursor_1.getOrCreateTokenSenderReceiverCursor)(storedEvent.superToken, storedEvent.sender, storedEvent.receiver, contractVersion);
    const currentVestingSchedule = (0, vestingSchedule_1.getVestingSchedule)(cursor);
    if (currentVestingSchedule) {
        currentVestingSchedule.endDate = storedEvent.endDate;
        currentVestingSchedule.remainderAmount = graph_ts_1.BigInt.fromI32(0);
        let events = currentVestingSchedule.events;
        events.push(storedEvent.id);
        currentVestingSchedule.events = events;
        const task = schema_1.Task.load(cursor.currentEndVestingTask);
        if (task) {
            task.executionAt = storedEvent.endDate.minus(endValidBeforeSeconds);
            task.save();
        }
        currentVestingSchedule.save();
        cursor.save();
    }
}
function handleVestingEndExecuted_v1(event) {
    _handleVestingEndExecuted(event, "v1");
}
function handleVestingEndExecuted_v2(event) {
    _handleVestingEndExecuted(event, "v2");
}
function handleVestingEndExecuted_v3(event) {
    _handleVestingEndExecuted(event, "v3");
}
function _handleVestingEndExecuted(event, contractVersion) {
    const ev = (0, createVestingEndExecuted_1.createVestingEndExecutedEventEntity)(event, contractVersion);
    ev.save();
    const cursor = (0, tokenSenderReceiverCursor_1.getOrCreateTokenSenderReceiverCursor)(ev.superToken, ev.sender, ev.receiver, contractVersion);
    const currentVestingSchedule = (0, vestingSchedule_1.getVestingSchedule)(cursor);
    if (currentVestingSchedule) {
        currentVestingSchedule.endExecutedAt = ev.timestamp;
        let events = currentVestingSchedule.events;
        events.push(ev.id);
        currentVestingSchedule.events = events;
        currentVestingSchedule.didEarlyEndCompensationFail = ev.didCompensationFail;
        currentVestingSchedule.earlyEndCompensation = ev.earlyEndCompensation;
        currentVestingSchedule.save();
    }
    if (cursor.currentEndVestingTask) {
        const task = schema_1.Task.load(cursor.currentEndVestingTask);
        task.executedAt = event.block.timestamp;
        cursor.currentEndVestingTask = null;
        cursor.save();
        task.save();
    }
}
function handleVestingEndFailed_v1(event) {
    _handleVestingEndFailed(event, "v1");
}
function handleVestingEndFailed_v2(event) {
    _handleVestingEndFailed(event, "v2");
}
function handleVestingEndFailed_v3(event) {
    _handleVestingEndFailed(event, "v3");
}
function _handleVestingEndFailed(event, contractVersion) {
    const ev = (0, createVestingEndFailed_1.createVestingEndFailedEventEntity)(event, contractVersion);
    ev.save();
    const cursor = (0, tokenSenderReceiverCursor_1.getOrCreateTokenSenderReceiverCursor)(ev.superToken, ev.sender, ev.receiver, contractVersion);
    const currentVestingSchedule = (0, vestingSchedule_1.getVestingSchedule)(cursor);
    if (currentVestingSchedule) {
        currentVestingSchedule.endExecutedAt = null;
        let events = currentVestingSchedule.events;
        events.push(ev.id);
        currentVestingSchedule.events = events;
        currentVestingSchedule.failedAt = ev.timestamp;
        currentVestingSchedule.save();
    }
    if (cursor.currentEndVestingTask) {
        const task = schema_1.Task.load(cursor.currentEndVestingTask);
        task.failedAt = ev.timestamp;
        cursor.currentEndVestingTask = null;
        cursor.save();
        task.save();
    }
}
function handleVestingClaimed_v2(event) {
    const ev = (0, createVestingClaimed_1.createVestingClaimedEventEntity)(event, "v2");
    ev.save();
    const cursor = (0, tokenSenderReceiverCursor_1.getOrCreateTokenSenderReceiverCursor)(ev.superToken, ev.sender, ev.receiver, "v2");
    const currentVestingSchedule = (0, vestingSchedule_1.getVestingSchedule)(cursor);
    if (currentVestingSchedule) {
        currentVestingSchedule.claimedAt = ev.timestamp;
        let events = currentVestingSchedule.events;
        events.push(ev.id);
        currentVestingSchedule.events = events;
        currentVestingSchedule.save();
        cursor.save();
    }
}
function handleVestingClaimed_v3(event) {
    const ev = (0, createVestingClaimed_1.createVestingClaimedEventEntity)(event, "v3");
    ev.save();
    const cursor = (0, tokenSenderReceiverCursor_1.getOrCreateTokenSenderReceiverCursor)(ev.superToken, ev.sender, ev.receiver, "v3");
    const currentVestingSchedule = (0, vestingSchedule_1.getVestingSchedule)(cursor);
    if (currentVestingSchedule) {
        currentVestingSchedule.claimedAt = ev.timestamp;
        let events = currentVestingSchedule.events;
        events.push(ev.id);
        currentVestingSchedule.events = events;
        currentVestingSchedule.save();
        cursor.save();
    }
}
function handleVestingScheduleTotalAmountUpdated_v3(event) {
    // TODO: Implement handler
    graph_ts_2.log.debug("VestingScheduleTotalAmountUpdated_v3 event: superToken: {}, sender: {}, receiver: {}, previousFlowRate: {}, newFlowRate: {}, previousTotalAmount: {}, newTotalAmount: {}, remainderAmount: {}", [
        event.params.superToken.toHexString(),
        event.params.sender.toHexString(),
        event.params.receiver.toHexString(),
        event.params.previousFlowRate.toString(),
        event.params.newFlowRate.toString(),
        event.params.previousTotalAmount.toString(),
        event.params.newTotalAmount.toString(),
        event.params.remainderAmount.toString()
    ]);
}
function handleVestingScheduleEndDateUpdated_v3(event) {
    // TODO: Implement handler
    graph_ts_2.log.debug("VestingScheduleEndDateUpdated_v3 event: superToken: {}, sender: {}, receiver: {}, oldEndDate: {}, endDate: {}, previousFlowRate: {}, newFlowRate: {}, remainderAmount: {}", [
        event.params.superToken.toHexString(),
        event.params.sender.toHexString(),
        event.params.receiver.toHexString(),
        event.params.oldEndDate.toString(),
        event.params.endDate.toString(),
        event.params.previousFlowRate.toString(),
        event.params.newFlowRate.toString(),
        event.params.remainderAmount.toString()
    ]);
}
