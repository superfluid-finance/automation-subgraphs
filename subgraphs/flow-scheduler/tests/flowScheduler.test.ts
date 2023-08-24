import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { assert, beforeEach, clearStore, describe, test } from "matchstick-as";
import {
  handleCreateFlowExecuted,
  handleDeleteFlowExecuted,
  handleFlowScheduleCreated,
  handleFlowScheduleDeleted,
} from "../src/mappings/flowScheduler";
import { CreateTask, DeleteTask } from "../src/types/schema";
import { getOrCreateTokenSenderReceiverCursor } from "../src/utils/tokenSenderReceiverCursor";

import { assertEventBaseProperties } from "./assertionHelper";
import { alice, bob, maticx } from "./constants";
import {
  createNewCreateFlowExecutedEvent,
  createNewDeleteFlowExecutedEvent,
  createNewFlowScheduleCreatedEvent,
  createNewFlowScheduleDeletedEvent,
} from "./flowScheduler.helper";

const sender = alice;
const receiver = bob;
const superToken = maticx;
const startDate = BigInt.fromI32(100);
const startDateMaxDelay = BigInt.fromI32(666);
const startAmount = BigInt.fromI32(1000);
const flowRate = BigInt.fromI32(100);
const endDate = BigInt.fromI32(150);
const userData = Bytes.fromHexString("0x");

describe("Host Mapper Unit Tests", () => {
  describe("Event Entity Mapping Tests", () => {
    beforeEach(() => {
      clearStore();
    });

    describe("handlers", () => {
      test("handleFlowScheduleCreated() - Should create a new CreateFlowScheduleEvent entity", () => {
        const event = createNewFlowScheduleCreatedEvent(
          superToken,
          sender,
          receiver,
          startDate,
          startDateMaxDelay,
          flowRate,
          endDate,
          startAmount,
          userData
        );

        handleFlowScheduleCreated(event);

        const id = assertEventBaseProperties(event, "FlowScheduleCreated");
        assert.fieldEquals(
          "FlowScheduleCreatedEvent",
          id,
          "superToken",
          superToken
        );
        assert.fieldEquals("FlowScheduleCreatedEvent", id, "sender", sender);
        assert.fieldEquals(
          "FlowScheduleCreatedEvent",
          id,
          "receiver",
          receiver
        );
        assert.fieldEquals(
          "FlowScheduleCreatedEvent",
          id,
          "startDate",
          startDate.toString()
        );
        assert.fieldEquals(
          "FlowScheduleCreatedEvent",
          id,
          "startDateMaxDelay",
          startDateMaxDelay.toString()
        );
        assert.fieldEquals(
          "FlowScheduleCreatedEvent",
          id,
          "startAmount",
          startAmount.toString()
        );
        assert.fieldEquals(
          "FlowScheduleCreatedEvent",
          id,
          "flowRate",
          flowRate.toString()
        );
        assert.fieldEquals(
          "FlowScheduleCreatedEvent",
          id,
          "userData",
          userData.toHexString()
        );
      });

      test("handleFlowScheduleDeleted() - Should create a new FlowScheduleDeletedEvent entity", () => {
        const event = createNewFlowScheduleDeletedEvent(
          superToken,
          sender,
          receiver
        );

        handleFlowScheduleDeleted(event);

        const id = assertEventBaseProperties(event, "FlowScheduleDeleted");
        assert.fieldEquals(
          "FlowScheduleDeletedEvent",
          id,
          "superToken",
          superToken
        );
        assert.fieldEquals("FlowScheduleDeletedEvent", id, "sender", sender);
        assert.fieldEquals(
          "FlowScheduleDeletedEvent",
          id,
          "receiver",
          receiver
        );
      });

      test("handleCreateFlowExecuted() - Should create a new CreateFlowExecutedEvent entity", () => {
        const event = createNewCreateFlowExecutedEvent(
          superToken,
          sender,
          receiver,
          startDate,
          startDateMaxDelay,
          flowRate,
          startAmount,
          userData
        );

        handleCreateFlowExecuted(event);

        const id = assertEventBaseProperties(event, "CreateFlowExecuted");
        assert.fieldEquals(
          "CreateFlowExecutedEvent",
          id,
          "superToken",
          superToken
        );
        assert.fieldEquals("CreateFlowExecutedEvent", id, "sender", sender);
        assert.fieldEquals("CreateFlowExecutedEvent", id, "receiver", receiver);
        assert.fieldEquals(
          "CreateFlowExecutedEvent",
          id,
          "startDate",
          startDate.toString()
        );
        assert.fieldEquals(
          "CreateFlowExecutedEvent",
          id,
          "startDateMaxDelay",
          startDateMaxDelay.toString()
        );
        assert.fieldEquals(
          "CreateFlowExecutedEvent",
          id,
          "flowRate",
          flowRate.toString()
        );

        assert.fieldEquals(
          "CreateFlowExecutedEvent",
          id,
          "startAmount",
          startAmount.toString()
        );

        assert.fieldEquals(
          "CreateFlowExecutedEvent",
          id,
          "userData",
          userData.toHexString()
        );
      });

      test("handleDeleteFlowExecuted() - Should create a new DeleteFlowExecutedEvent entity", () => {
        const event = createNewDeleteFlowExecutedEvent(
          superToken,
          sender,
          receiver,
          endDate,
          userData
        );

        handleDeleteFlowExecuted(event);

        const id = assertEventBaseProperties(event, "DeleteFlowExecuted");
        assert.fieldEquals(
          "DeleteFlowExecutedEvent",
          id,
          "superToken",
          superToken
        );
        assert.fieldEquals("DeleteFlowExecutedEvent", id, "sender", sender);
        assert.fieldEquals("DeleteFlowExecutedEvent", id, "receiver", receiver);
        assert.fieldEquals(
          "DeleteFlowExecutedEvent",
          id,
          "endDate",
          endDate.toString()
        );

        assert.fieldEquals(
          "DeleteFlowExecutedEvent",
          id,
          "userData",
          userData.toHexString()
        );
      });
    });

    describe("Tasks", () => {
      test("handleCreateFlowSchedule should create tasks for start/end flow", () => {
        const event = createNewFlowScheduleCreatedEvent(
          superToken,
          sender,
          receiver,
          startDate,
          startDateMaxDelay,
          flowRate,
          endDate,
          startAmount,
          Bytes.fromHexString("")
        );

        handleFlowScheduleCreated(event);

        const cursor = getOrCreateTokenSenderReceiverCursor(
          Bytes.fromHexString(superToken),
          Bytes.fromHexString(sender),
          Bytes.fromHexString(receiver)
        );

        assert.assertNotNull(cursor.currentCreateFlowTask);
        assert.assertNotNull(cursor.currentDeleteFlowTask);

        const createTask = CreateTask.load(cursor.currentCreateFlowTask!)!;
        const deleteTask = DeleteTask.load(cursor.currentDeleteFlowTask!)!;

        assert.bigIntEquals(createTask.executionAt, startDate);
        assert.fieldEquals("CreateTask", createTask.id, "executedAt", "null");
        assert.fieldEquals("CreateTask", createTask.id, "cancelledAt", "null");

        assert.bigIntEquals(deleteTask.executionAt, endDate);
        assert.fieldEquals("DeleteTask", deleteTask.id, "executedAt", "null");
        assert.fieldEquals("DeleteTask", deleteTask.id, "cancelledAt", "null");
      });

      test("handleDeleteFlowSchedule should clear tasks for start/end flow", () => {
        const createdEvent = createNewFlowScheduleCreatedEvent(
          superToken,
          sender,
          receiver,
          startDate,
          startDateMaxDelay,
          flowRate,
          endDate,
          startAmount,
          Bytes.fromHexString("")
        );

        const deletedEvent = createNewFlowScheduleDeletedEvent(
          superToken,
          sender,
          receiver
        );

        handleFlowScheduleCreated(createdEvent);

        let cursor = getOrCreateTokenSenderReceiverCursor(
          Bytes.fromHexString(superToken),
          Bytes.fromHexString(sender),
          Bytes.fromHexString(receiver)
        );

        let createTask = CreateTask.load(cursor.currentCreateFlowTask!)!;
        let deleteTask = DeleteTask.load(cursor.currentDeleteFlowTask!)!;

        handleFlowScheduleDeleted(deletedEvent);

        createTask = CreateTask.load(createTask.id)!;
        deleteTask = DeleteTask.load(deleteTask.id)!;

        cursor = getOrCreateTokenSenderReceiverCursor(
          Bytes.fromHexString(superToken),
          Bytes.fromHexString(sender),
          Bytes.fromHexString(receiver)
        );

        assert.assertNull(cursor.currentCreateFlowTask);
        assert.assertNull(cursor.currentDeleteFlowTask);

        assert.bigIntEquals(
          createTask.cancelledAt!,
          deletedEvent.block.timestamp
        );

        assert.bigIntEquals(
          deleteTask.cancelledAt!,
          deletedEvent.block.timestamp
        );
      });

      test("should update create-task when create execution happens", () => {
        const createdEvent = createNewFlowScheduleCreatedEvent(
          superToken,
          sender,
          receiver,
          startDate,
          startDateMaxDelay,
          flowRate,
          endDate,
          startAmount,
          userData
        );

        const executedEvent = createNewCreateFlowExecutedEvent(
          superToken,
          sender,
          receiver,
          startDate,
          startDateMaxDelay,
          flowRate,
          startAmount,
          userData
        );

        handleFlowScheduleCreated(createdEvent);

        const cursor = getOrCreateTokenSenderReceiverCursor(
          Bytes.fromHexString(superToken),
          Bytes.fromHexString(sender),
          Bytes.fromHexString(receiver)
        );

        let createTask = CreateTask.load(cursor.currentCreateFlowTask!)!;

        handleCreateFlowExecuted(executedEvent);

        createTask = CreateTask.load(createTask.id)!;

        assert.bigIntEquals(createTask.executionAt!, startDate);
        assert.bigIntEquals(
          createTask.executedAt!,
          executedEvent.block.timestamp
        );

        assert.fieldEquals(
          "TokenSenderReceiverCursor",
          cursor.id,
          "currentCreateFlowTask",
          "null"
        );
      });

      test("should update delete-task when delete execution happens", () => {
        const createdEvent = createNewFlowScheduleCreatedEvent(
          superToken,
          sender,
          receiver,
          startDate,
          startDateMaxDelay,
          flowRate,
          endDate,
          startAmount,
          userData
        );

        const deleteExecutedEvent = createNewDeleteFlowExecutedEvent(
          superToken,
          sender,
          receiver,
          endDate,
          userData
        );

        handleFlowScheduleCreated(createdEvent);

        const cursor = getOrCreateTokenSenderReceiverCursor(
          Bytes.fromHexString(superToken),
          Bytes.fromHexString(sender),
          Bytes.fromHexString(receiver)
        );

        let deleteTask = DeleteTask.load(cursor.currentDeleteFlowTask!)!;

        handleDeleteFlowExecuted(deleteExecutedEvent);

        deleteTask = DeleteTask.load(deleteTask.id)!;

        assert.bigIntEquals(deleteTask.executionAt!, endDate);

        assert.bigIntEquals(
          deleteTask.executedAt!,
          deleteExecutedEvent.block.timestamp
        );

        assert.fieldEquals("DeleteTask", deleteTask.id, "cancelledAt", "null");
      });
    });
  });
});
