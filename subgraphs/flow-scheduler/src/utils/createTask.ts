import { BigInt } from "@graphprotocol/graph-ts";
import {
  CreateTask,
  DeleteTask,
  FlowScheduleCreatedEvent,
} from "../types/schema";

export function createCreateTask(event: FlowScheduleCreatedEvent): CreateTask {
  const id = `CreateFlowScheduleTask-${event.transactionHash.toHexString()}-${event.logIndex.toString()}`;
  let task = new CreateTask(id);

  task.type = "CREATE_FLOW";

  task.superToken = event.superToken;
  task.sender = event.sender;
  task.receiver = event.receiver;

  task.startDate = event.startDate;
  task.flowRate = event.flowRate;
  task.startAmount = event.startAmount;
  task.startDateMaxDelay = event.startDateMaxDelay;

  task.createdAt = event.timestamp;
  task.executionAt = event.startDate;
  task.expirationAt = event.startDate.plus(event.startDateMaxDelay);
  task.executedAt = null;
  task.cancelledAt = null;

  return task;
}

export function createDeleteTask(event: FlowScheduleCreatedEvent): DeleteTask {
  const id = `DeleteFlowScheduleTask-${event.transactionHash.toHexString()}-${event.logIndex.toString()}`;
  let task = new DeleteTask(id);

  task.type = "DELETE_FLOW";

  task.superToken = event.superToken;
  task.sender = event.sender;
  task.receiver = event.receiver;

  task.createdAt = event.timestamp;
  task.executionAt = event.endDate;
  task.expirationAt = BigInt.fromI64(864000000000);

  task.executedAt = null;
  task.cancelledAt = null;

  return task;
}
