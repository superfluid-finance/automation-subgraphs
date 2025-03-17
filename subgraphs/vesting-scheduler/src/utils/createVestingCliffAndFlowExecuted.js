"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVestingCliffAndFlowExecutedEntity = createVestingCliffAndFlowExecutedEntity;
const graph_ts_1 = require("@graphprotocol/graph-ts");
const schema_1 = require("../types/schema");
const general_1 = require("./general");
function createVestingCliffAndFlowExecutedEntity(event, contractVersion) {
    let ev = new schema_1.VestingCliffAndFlowExecutedEvent((0, general_1.createEventID)("VestingCliffAndFlowExecuted", event, contractVersion));
    ev = (0, general_1.setBaseProperties)("VestingCliffAndFlowExecutedEvent", event, ev, [
        event.params.sender,
        event.params.receiver,
    ]);
    ev.superToken = event.params.superToken;
    ev.sender = event.params.sender;
    ev.receiver = event.params.receiver;
    ev.cliffAndFlowDate = event.params.cliffAndFlowDate;
    ev.flowRate = event.params.flowRate;
    ev.cliffAmount = event.params.cliffAmount;
    ev.flowDelayCompensation = event.params.flowDelayCompensation;
    const receipt = event.receipt;
    if (receipt) {
        ev.gasUsed = receipt.gasUsed;
    }
    else {
        graph_ts_1.log.critical("receipt MUST NOT be null, set `receipt: true` under `eventHandlers` in the manifest file", []);
    }
    return ev;
}
