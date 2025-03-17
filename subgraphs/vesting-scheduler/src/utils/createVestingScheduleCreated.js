"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVestingScheduleCreatedEventEntity_v3 = createVestingScheduleCreatedEventEntity_v3;
exports.createVestingScheduleCreatedEventEntity_v2 = createVestingScheduleCreatedEventEntity_v2;
exports.createVestingScheduleCreatedEventEntity_v1 = createVestingScheduleCreatedEventEntity_v1;
const graph_ts_1 = require("@graphprotocol/graph-ts");
const schema_1 = require("../types/schema");
const general_1 = require("./general");
function createVestingScheduleCreatedEventEntity_v3(event) {
    let ev = new schema_1.VestingScheduleCreatedEvent((0, general_1.createEventID)("VestingScheduleCreated", event, "v3"));
    ev = (0, general_1.setBaseProperties)("VestingScheduleCreatedEvent", event, ev, [
        event.params.sender,
        event.params.receiver,
    ]);
    ev.superToken = event.params.superToken;
    ev.sender = event.params.sender;
    ev.receiver = event.params.receiver;
    ev.startDate = event.params.startDate;
    ev.cliffDate = event.params.cliffDate;
    ev.flowRate = event.params.flowRate;
    ev.endDate = event.params.endDate;
    ev.cliffAmount = event.params.cliffAmount;
    ev.claimValidityDate = event.params.claimValidityDate;
    ev.remainderAmount = event.params.remainderAmount;
    return ev;
}
function createVestingScheduleCreatedEventEntity_v2(event) {
    let ev = new schema_1.VestingScheduleCreatedEvent((0, general_1.createEventID)("VestingScheduleCreated", event, "v2"));
    ev = (0, general_1.setBaseProperties)("VestingScheduleCreatedEvent", event, ev, [
        event.params.sender,
        event.params.receiver,
    ]);
    ev.superToken = event.params.superToken;
    ev.sender = event.params.sender;
    ev.receiver = event.params.receiver;
    ev.startDate = event.params.startDate;
    ev.cliffDate = event.params.cliffDate;
    ev.flowRate = event.params.flowRate;
    ev.endDate = event.params.endDate;
    ev.cliffAmount = event.params.cliffAmount;
    ev.claimValidityDate = event.params.claimValidityDate;
    ev.remainderAmount = event.params.remainderAmount;
    return ev;
}
function createVestingScheduleCreatedEventEntity_v1(event) {
    let ev = new schema_1.VestingScheduleCreatedEvent((0, general_1.createEventID)("VestingScheduleCreated", event, "v1"));
    ev = (0, general_1.setBaseProperties)("VestingScheduleCreatedEvent", event, ev, [
        event.params.sender,
        event.params.receiver,
    ]);
    ev.superToken = event.params.superToken;
    ev.sender = event.params.sender;
    ev.receiver = event.params.receiver;
    ev.startDate = event.params.startDate;
    ev.cliffDate = event.params.cliffDate;
    ev.flowRate = event.params.flowRate;
    ev.endDate = event.params.endDate;
    ev.cliffAmount = event.params.cliffAmount;
    ev.claimValidityDate = graph_ts_1.BigInt.fromI32(0);
    ev.remainderAmount = graph_ts_1.BigInt.fromI32(0);
    return ev;
}
