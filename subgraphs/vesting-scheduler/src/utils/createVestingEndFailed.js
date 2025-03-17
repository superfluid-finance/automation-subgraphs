"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVestingEndFailedEventEntity = createVestingEndFailedEventEntity;
const graph_ts_1 = require("@graphprotocol/graph-ts");
const schema_1 = require("../types/schema");
const general_1 = require("./general");
function createVestingEndFailedEventEntity(event, contractVersion) {
    let ev = new schema_1.VestingEndFailedEvent((0, general_1.createEventID)("VestingEndFailed", event, contractVersion));
    ev = (0, general_1.setBaseProperties)("VestingEndFailedEvent", event, ev, [
        event.params.sender,
        event.params.receiver,
    ]);
    ev.superToken = event.params.superToken;
    ev.sender = event.params.sender;
    ev.receiver = event.params.receiver;
    ev.endDate = event.params.endDate;
    const receipt = event.receipt;
    if (receipt) {
        ev.gasUsed = receipt.gasUsed;
    }
    else {
        graph_ts_1.log.critical("receipt MUST NOT be null, set `receipt: true` under `eventHandlers` in the manifest file", []);
    }
    return ev;
}
