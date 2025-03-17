"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVestingEndExecutedEventEntity = createVestingEndExecutedEventEntity;
const graph_ts_1 = require("@graphprotocol/graph-ts");
const schema_1 = require("../types/schema");
const general_1 = require("./general");
function createVestingEndExecutedEventEntity(event, contractVersion) {
    let ev = new schema_1.VestingEndExecutedEvent((0, general_1.createEventID)("VestingEndExecuted", event, contractVersion));
    ev = (0, general_1.setBaseProperties)("VestingEndExecutedEvent", event, ev, [
        event.params.sender,
        event.params.receiver,
    ]);
    ev.superToken = event.params.superToken;
    ev.sender = event.params.sender;
    ev.receiver = event.params.receiver;
    ev.endDate = event.params.endDate;
    ev.earlyEndCompensation = event.params.earlyEndCompensation;
    ev.didCompensationFail = event.params.didCompensationFail;
    const receipt = event.receipt;
    if (receipt) {
        ev.gasUsed = receipt.gasUsed;
    }
    else {
        graph_ts_1.log.critical("receipt MUST NOT be null, set `receipt: true` under `eventHandlers` in the manifest file", []);
    }
    return ev;
}
