"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewCreateVestingScheduleEvent = createNewCreateVestingScheduleEvent;
exports.createNewDeleteVestingScheduleEvent = createNewDeleteVestingScheduleEvent;
exports.createNewVestingEndExecutedEvent = createNewVestingEndExecutedEvent;
exports.createNewVestingEndFailedEvent = createNewVestingEndFailedEvent;
exports.createNewVestingCliffAndFlowExecutedEvent = createNewVestingCliffAndFlowExecutedEvent;
exports.createNewVestingScheduleUpdatedEvent = createNewVestingScheduleUpdatedEvent;
exports.createNewVestingClaimedEvent = createNewVestingClaimedEvent;
const matchstick_as_1 = require("matchstick-as");
const converters_1 = require("./converters");
function createNewCreateVestingScheduleEvent(superToken, sender, receiver, startDate, cliffDate, flowRate, endDate, cliffAmount) {
    const event = changetype((0, matchstick_as_1.newMockEvent)());
    event.parameters = new Array();
    event.parameters.push((0, converters_1.getAddressEventParam)("superToken", superToken));
    event.parameters.push((0, converters_1.getAddressEventParam)("sender", sender));
    event.parameters.push((0, converters_1.getAddressEventParam)("receiver", receiver));
    event.parameters.push((0, converters_1.getBigIntEventParam)("startDate", startDate));
    event.parameters.push((0, converters_1.getBigIntEventParam)("cliffDate", cliffDate));
    event.parameters.push((0, converters_1.getBigIntEventParam)("flowRate", flowRate));
    event.parameters.push((0, converters_1.getBigIntEventParam)("cliffAmount", cliffAmount));
    event.parameters.push((0, converters_1.getBigIntEventParam)("endDate", endDate));
    // event.parameters.push(getBigIntEventParam("claimValidityDate", claimValidityDate));
    // event.parameters.push(getBigIntEventParam("remainderAmount", remainderAmount));
    return event;
}
function createNewDeleteVestingScheduleEvent(superToken, sender, receiver) {
    const event = changetype((0, matchstick_as_1.newMockEvent)());
    event.parameters = new Array();
    event.parameters.push((0, converters_1.getAddressEventParam)("superToken", superToken));
    event.parameters.push((0, converters_1.getAddressEventParam)("sender", sender));
    event.parameters.push((0, converters_1.getAddressEventParam)("receiver", receiver));
    return event;
}
function createNewVestingEndExecutedEvent(superToken, sender, receiver, endDate, earlyEndCompensation, didCompensationFail) {
    const event = changetype((0, matchstick_as_1.newMockEvent)());
    event.parameters = new Array();
    event.parameters.push((0, converters_1.getAddressEventParam)("superToken", superToken));
    event.parameters.push((0, converters_1.getAddressEventParam)("sender", sender));
    event.parameters.push((0, converters_1.getAddressEventParam)("receiver", receiver));
    event.parameters.push((0, converters_1.getBigIntEventParam)("endDate", endDate));
    event.parameters.push((0, converters_1.getBigIntEventParam)("earlyEndCompensation", earlyEndCompensation));
    event.parameters.push((0, converters_1.getBooleanEventParam)("didCompensationFail", didCompensationFail));
    return event;
}
function createNewVestingEndFailedEvent(superToken, sender, receiver, endDate) {
    const event = changetype((0, matchstick_as_1.newMockEvent)());
    event.parameters = new Array();
    event.parameters.push((0, converters_1.getAddressEventParam)("superToken", superToken));
    event.parameters.push((0, converters_1.getAddressEventParam)("sender", sender));
    event.parameters.push((0, converters_1.getAddressEventParam)("receiver", receiver));
    event.parameters.push((0, converters_1.getBigIntEventParam)("endDate", endDate));
    return event;
}
function createNewVestingCliffAndFlowExecutedEvent(superToken, sender, receiver, cliffAndFlowDate, flowRate, cliffAmount, flowDelayCompensation) {
    const event = changetype((0, matchstick_as_1.newMockEvent)());
    event.parameters = new Array();
    event.parameters.push((0, converters_1.getAddressEventParam)("superToken", superToken));
    event.parameters.push((0, converters_1.getAddressEventParam)("sender", sender));
    event.parameters.push((0, converters_1.getAddressEventParam)("receiver", receiver));
    event.parameters.push((0, converters_1.getBigIntEventParam)("cliffAndFlowDate", cliffAndFlowDate));
    event.parameters.push((0, converters_1.getBigIntEventParam)("flowRate", flowRate));
    event.parameters.push((0, converters_1.getBigIntEventParam)("cliffAmount", cliffAmount));
    event.parameters.push((0, converters_1.getBigIntEventParam)("flowDelayCompensation", flowDelayCompensation));
    return event;
}
function createNewVestingScheduleUpdatedEvent(superToken, sender, receiver, oldEndDate, endDate) {
    const event = changetype((0, matchstick_as_1.newMockEvent)());
    event.parameters = new Array();
    event.parameters.push((0, converters_1.getAddressEventParam)("superToken", superToken));
    event.parameters.push((0, converters_1.getAddressEventParam)("sender", sender));
    event.parameters.push((0, converters_1.getAddressEventParam)("receiver", receiver));
    event.parameters.push((0, converters_1.getBigIntEventParam)("oldEndDate", oldEndDate));
    event.parameters.push((0, converters_1.getBigIntEventParam)("endDate", endDate));
    // event.parameters.push(getBigIntEventParam("remainderAmount", remainderAmount));
    return event;
}
function createNewVestingClaimedEvent(superToken, sender, receiver, claimer) {
    const event = changetype((0, matchstick_as_1.newMockEvent)());
    event.parameters = new Array();
    event.parameters.push((0, converters_1.getAddressEventParam)("superToken", superToken));
    event.parameters.push((0, converters_1.getAddressEventParam)("sender", sender));
    event.parameters.push((0, converters_1.getAddressEventParam)("receiver", receiver));
    event.parameters.push((0, converters_1.getAddressEventParam)("claimer", claimer));
    return event;
}
