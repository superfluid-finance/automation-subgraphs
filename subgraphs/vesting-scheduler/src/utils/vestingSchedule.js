"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVestingSchedule = createVestingSchedule;
exports.getVestingSchedule = getVestingSchedule;
const graph_ts_1 = require("@graphprotocol/graph-ts");
const VestingScheduler_1 = require("../types/VestingScheduler/VestingScheduler");
const schema_1 = require("./../types/schema");
const general_1 = require("./general");
function createVestingSchedule(ev, scheduler, contractVersion) {
    const vestingScheduler = VestingScheduler_1.VestingScheduler.bind(scheduler);
    const endValidBeforeSeconds = vestingScheduler.END_DATE_VALID_BEFORE();
    const startValidAfterSeconds = vestingScheduler.START_DATE_VALID_AFTER();
    const id = `${ev.transactionHash.toHexString()}-${ev.logIndex}${(0, general_1.getContractVersionSuffix)(contractVersion)}`;
    let vestingSchedule = new schema_1.VestingSchedule(id);
    vestingSchedule.contractVersion = contractVersion;
    vestingSchedule.createdAt = ev.timestamp;
    vestingSchedule.superToken = ev.superToken;
    vestingSchedule.sender = ev.sender;
    vestingSchedule.receiver = ev.receiver;
    vestingSchedule.startDate = ev.startDate;
    vestingSchedule.endDate = ev.endDate;
    vestingSchedule.cliffDate =
        ev.cliffDate != graph_ts_1.BigInt.zero() ? ev.cliffDate : null;
    vestingSchedule.cliffAndFlowDate =
        ev.cliffDate != graph_ts_1.BigInt.zero() ? ev.cliffDate : ev.startDate;
    vestingSchedule.cliffAmount = ev.cliffAmount;
    vestingSchedule.flowRate = ev.flowRate;
    vestingSchedule.cliffAndFlowExpirationAt =
        vestingSchedule.cliffAndFlowDate.plus(startValidAfterSeconds);
    vestingSchedule.endDateValidAt = ev.endDate.minus(endValidBeforeSeconds);
    vestingSchedule.events = [ev.id];
    vestingSchedule.claimValidityDate = ev.claimValidityDate;
    vestingSchedule.remainderAmount = ev.remainderAmount;
    return vestingSchedule;
}
function getVestingSchedule(cursor) {
    if (cursor && cursor.currentVestingSchedule) {
        let vestingSchedule = schema_1.VestingSchedule.load(cursor.currentVestingSchedule);
        return vestingSchedule;
    }
    return null;
}
