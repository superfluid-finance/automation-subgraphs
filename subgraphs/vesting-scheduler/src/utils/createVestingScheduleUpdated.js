"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVestingUpdatedEntity_v3 = createVestingUpdatedEntity_v3;
exports.createVestingUpdatedEntity_v2 = createVestingUpdatedEntity_v2;
exports.createVestingUpdatedEntity_v1 = createVestingUpdatedEntity_v1;
const graph_ts_1 = require("@graphprotocol/graph-ts");
const schema_1 = require("../types/schema");
const general_1 = require("./general");
function createVestingUpdatedEntity_v3(event, contractVersion) {
    let ev = new schema_1.VestingScheduleUpdatedEvent((0, general_1.createEventID)("VestingScheduleUpdated", event, contractVersion));
    ev = (0, general_1.setBaseProperties)("VestingScheduleUpdatedEvent", event, ev, [
        event.params.sender,
        event.params.receiver,
    ]);
    ev.superToken = event.params.superToken;
    ev.sender = event.params.sender;
    ev.receiver = event.params.receiver;
    ev.oldEndDate = event.params.oldEndDate;
    ev.endDate = event.params.endDate;
    ev.remainderAmount = event.params.remainderAmount;
    return ev;
}
function createVestingUpdatedEntity_v2(event, contractVersion) {
    let ev = new schema_1.VestingScheduleUpdatedEvent((0, general_1.createEventID)("VestingScheduleUpdated", event, contractVersion));
    ev = (0, general_1.setBaseProperties)("VestingScheduleUpdatedEvent", event, ev, [
        event.params.sender,
        event.params.receiver,
    ]);
    ev.superToken = event.params.superToken;
    ev.sender = event.params.sender;
    ev.receiver = event.params.receiver;
    ev.oldEndDate = event.params.oldEndDate;
    ev.endDate = event.params.endDate;
    ev.remainderAmount = event.params.remainderAmount;
    return ev;
}
function createVestingUpdatedEntity_v1(event, contractVersion) {
    let ev = new schema_1.VestingScheduleUpdatedEvent((0, general_1.createEventID)("VestingScheduleUpdated", event, contractVersion));
    ev = (0, general_1.setBaseProperties)("VestingScheduleUpdatedEvent", event, ev, [
        event.params.sender,
        event.params.receiver,
    ]);
    ev.superToken = event.params.superToken;
    ev.sender = event.params.sender;
    ev.receiver = event.params.receiver;
    ev.oldEndDate = event.params.oldEndDate;
    ev.endDate = event.params.endDate;
    ev.remainderAmount = graph_ts_1.BigInt.fromI32(0);
    return ev;
}
