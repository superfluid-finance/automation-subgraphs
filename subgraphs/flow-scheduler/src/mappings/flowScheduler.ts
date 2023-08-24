import {
  CreateFlowExecuted,
  DeleteFlowExecuted,
  FlowScheduleCreated,
  FlowScheduleDeleted,
} from "../types/FlowScheduler/FlowScheduler";
import { CreateTask, DeleteTask } from "../types/schema";
import { createCreateFlowExecutedEventEntity } from "../utils/createCreateFlowExecuted";
import { createDeleteFlowExecutedEventEntity } from "../utils/createDeleteFlowExecuted";
import { createFlowScheduleCreatedEventEntity } from "../utils/createFlowScheduleCreated";
import { createFlowScheduleDeletedEventEntity } from "../utils/createFlowScheduleDeleted";
import { createCreateTask, createDeleteTask } from "../utils/createTask";
import { getOrCreateTokenSenderReceiverCursor } from "../utils/tokenSenderReceiverCursor";

export function handleFlowScheduleCreated(event: FlowScheduleCreated): void {
  const ev = createFlowScheduleCreatedEventEntity(event);
  ev.save();

  let cursor = getOrCreateTokenSenderReceiverCursor(
    ev.superToken,
    ev.sender,
    ev.receiver
  );

  let createFlowTask: CreateTask | null = null;
  let deleteFlowTask: DeleteTask | null = null;

  let keepCreate = false;
  let keepDelete = false;

  // Deal with the previous tasks.

  if (cursor.currentCreateFlowTask) {
    createFlowTask = CreateTask.load(cursor.currentCreateFlowTask!)!;

    const isSameCreateFlowTask =
      createFlowTask.startDate == ev.startDate &&
      createFlowTask.startAmount == ev.startAmount &&
      createFlowTask.startDateMaxDelay == ev.startDateMaxDelay &&
      createFlowTask.flowRate == ev.flowRate;

    if (!isSameCreateFlowTask) {
      createFlowTask.cancelledAt = ev.timestamp;

      createFlowTask.save();

      createFlowTask = null;
    } else {
      keepCreate = true;
    }
  }

  if (cursor.currentDeleteFlowTask) {
    deleteFlowTask = DeleteTask.load(cursor.currentDeleteFlowTask!)!;

    const isSameDeleteFlowTask = deleteFlowTask.executionAt == ev.endDate;

    if (!isSameDeleteFlowTask) {
      deleteFlowTask.cancelledAt = ev.timestamp;

      deleteFlowTask.save();

      deleteFlowTask = null;
    } else {
      keepDelete = true;
    }
  }

  // New Schedule

  if (!ev.startDate.isZero() && !keepCreate) {
    createFlowTask = createCreateTask(ev);
    createFlowTask.save();
  }

  if (!ev.endDate.isZero() && !keepDelete) {
    deleteFlowTask = createDeleteTask(ev);
    deleteFlowTask.save();
  }

  cursor.currentCreateFlowTask = createFlowTask ? createFlowTask.id : null;
  cursor.currentDeleteFlowTask = deleteFlowTask ? deleteFlowTask.id : null;

  cursor.save();
}

export function handleFlowScheduleDeleted(event: FlowScheduleDeleted): void {
  const ev = createFlowScheduleDeletedEventEntity(event);
  ev.save();

  const cursor = getOrCreateTokenSenderReceiverCursor(
    ev.superToken,
    ev.sender,
    ev.receiver
  );

  if (cursor.currentCreateFlowTask) {
    const createTask = CreateTask.load(cursor.currentCreateFlowTask!)!;

    createTask.cancelledAt = ev.timestamp;

    cursor.currentCreateFlowTask = null;

    createTask.save();
  }

  if (cursor.currentDeleteFlowTask) {
    const deleteTask = DeleteTask.load(cursor.currentDeleteFlowTask!)!;

    deleteTask.cancelledAt = ev.timestamp;

    cursor.currentDeleteFlowTask = null;

    deleteTask.save();
  }

  cursor.save();
}

export function handleCreateFlowExecuted(event: CreateFlowExecuted): void {
  const ev = createCreateFlowExecutedEventEntity(event);
  ev.save();

  const cursor = getOrCreateTokenSenderReceiverCursor(
    ev.superToken,
    ev.sender,
    ev.receiver
  );

  if (cursor.currentCreateFlowTask) {
    const task = CreateTask.load(cursor.currentCreateFlowTask!)!;

    task.executedAt = ev.timestamp;
    cursor.currentCreateFlowTask = null;

    task.save();
    cursor.save();
  }
}

export function handleDeleteFlowExecuted(event: DeleteFlowExecuted): void {
  const ev = createDeleteFlowExecutedEventEntity(event);
  ev.save();

  const cursor = getOrCreateTokenSenderReceiverCursor(
    ev.superToken,
    ev.sender,
    ev.receiver
  );

  if (cursor.currentDeleteFlowTask) {
    const task = DeleteTask.load(cursor.currentDeleteFlowTask!)!;

    task.executedAt = ev.timestamp;
    cursor.currentDeleteFlowTask = null;

    task.save();
    cursor.save();
  }
}
