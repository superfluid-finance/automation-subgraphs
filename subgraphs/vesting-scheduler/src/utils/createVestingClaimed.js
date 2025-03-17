"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVestingClaimedEventEntity = createVestingClaimedEventEntity;
const schema_1 = require("../types/schema");
const general_1 = require("./general");
function createVestingClaimedEventEntity(event, contractVersion) {
    let ev = new schema_1.VestingClaimedEvent((0, general_1.createEventID)("VestingClaimed", event, contractVersion));
    ev = (0, general_1.setBaseProperties)("VestingClaimedEvent", event, ev, [
        event.params.sender,
        event.params.receiver,
    ]);
    ev.superToken = event.params.superToken;
    ev.sender = event.params.sender;
    ev.receiver = event.params.receiver;
    ev.claimer = event.params.claimer;
    return ev;
}
