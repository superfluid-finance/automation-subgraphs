"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTask = createTask;
const graph_ts_1 = require("@graphprotocol/graph-ts");
const schema_1 = require("../types/schema");
const general_1 = require("./general");
function createTask(schedule, type, hash, logIndex, contractVersion) {
    const id = `${type}-${hash}-${logIndex.toString()}${(0, general_1.getContractVersionSuffix)(contractVersion)}`;
    let task = new schema_1.Task(id);
    task.type = type;
    if (type == "ExecuteCliffAndFlow") {
        task.executionAt = schedule.cliffAndFlowDate;
        task.expirationAt = schedule.cliffAndFlowExpirationAt;
    }
    if (type == "ExecuteEndVesting") {
        task.executionAt = schedule.endDateValidAt;
        task.expirationAt = graph_ts_1.BigInt.fromI64(864000000000);
    }
    task.executedAt = null;
    task.cancelledAt = null;
    task.failedAt = null;
    task.vestingSchedule = schedule.id;
    return task;
}
