"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVestingScheduleDeletedEventEntity = createVestingScheduleDeletedEventEntity;
const schema_1 = require("../types/schema");
const general_1 = require("./general");
function createVestingScheduleDeletedEventEntity(event, contractVersion) {
    let ev = new schema_1.VestingScheduleDeletedEvent((0, general_1.createEventID)("VestingScheduleDeleted", event, contractVersion));
    ev = (0, general_1.setBaseProperties)("VestingScheduleDeletedEvent", event, ev, [
        event.params.sender,
        event.params.receiver,
    ]);
    ev.sender = event.params.sender;
    ev.receiver = event.params.receiver;
    ev.superToken = event.params.superToken;
    return ev;
}
