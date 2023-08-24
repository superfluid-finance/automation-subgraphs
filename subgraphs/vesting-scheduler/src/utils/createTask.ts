import { BigInt } from "@graphprotocol/graph-ts";
import { Task, VestingSchedule } from "../types/schema";

export function createTask(
  schedule: VestingSchedule,
  type: string,
  hash: string,
  logIndex: BigInt
): Task {
  const id = `${type}-${hash}-${logIndex.toString()}`;
  let task = new Task(id);

  task.type = type;

  if (type == "ExecuteCliffAndFlow") {
    task.executionAt = schedule.cliffAndFlowDate;
    task.expirationAt = schedule.cliffAndFlowExpirationAt;
  }

  if (type == "ExecuteEndVesting") {
    task.executionAt = schedule.endDateValidAt;
    task.expirationAt = BigInt.fromI64(864000000000);
  }

  task.executedAt = null;
  task.cancelledAt = null;
  task.failedAt = null;

  task.vestingSchedule = schedule.id;

  return task;
}
