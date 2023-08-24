import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
  assert,
  beforeEach,
  clearStore,
  describe,
  mockFunction,
  test,
} from "matchstick-as";
import {
  handleVestingCliffAndFlowExecuted,
  handleVestingEndExecuted,
  handleVestingEndFailed,
  handleVestingScheduleCreated,
  handleVestingScheduleDeleted,
  handleVestingScheduleUpdated,
} from "../src/mappings/vestingScheduler";
import { Task } from "../src/types/schema";
import { getOrCreateTokenSenderReceiverCursor } from "../src/utils/tokenSenderReceiverCursor";
import { getVestingSchedule } from "../src/utils/vestingSchedule";
import { assertEventBaseProperties } from "./assertionHelper";
import { alice, bob, FALSE, maticx } from "./constants";
import {
  createNewCreateVestingScheduleEvent,
  createNewDeleteVestingScheduleEvent,
  createNewVestingCliffAndFlowExecutedEvent,
  createNewVestingEndExecutedEvent,
  createNewVestingEndFailedEvent,
  createNewVestingScheduleUpdatedEvent,
} from "./vestingScheduler.helper";

let contractAddress = Address.fromString(
  "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A"
);

mockFunction(
  contractAddress,
  "START_DATE_VALID_AFTER",
  "START_DATE_VALID_AFTER():(uint32)",
  [],
  //@ts-ignore
  [ethereum.Value.fromI32(1337)],
  false
);
mockFunction(
  contractAddress,
  "END_DATE_VALID_BEFORE",
  "END_DATE_VALID_BEFORE():(uint32)",
  [],
  //@ts-ignore
  [ethereum.Value.fromI32(1338)],
  false
);

const sender = alice;
const receiver = bob;
const superToken = maticx;
const startDate = BigInt.fromI32(100);
const cliffDate = BigInt.fromI32(101);
const cliffAndFlowDate = BigInt.fromI32(102);
const oldEndDate = BigInt.fromI32(103);
const earlyEndCompensation = BigInt.fromI32(104);
const flowDelayCompensation = BigInt.fromI32(105);
const cliffAmount = BigInt.fromI32(1000);
const flowRate = BigInt.fromI32(100);
const endDate = BigInt.fromI32(150);

describe("Host Mapper Unit Tests", () => {
  describe("Event Entity Mapping Tests", () => {
    beforeEach(() => {
      clearStore();
    });

    describe("handlers", () => {
      test("handleVestingScheduleCreated() - Should create a new VestingScheduleCreatedEvent entity", () => {
        const event = createNewCreateVestingScheduleEvent(
          superToken,
          sender,
          receiver,
          startDate,
          cliffDate,
          flowRate,
          cliffAmount,
          endDate
        );

        handleVestingScheduleCreated(event);

        const id = assertEventBaseProperties(event, "VestingScheduleCreated");
        assert.fieldEquals(
          "VestingScheduleCreatedEvent",
          id,
          "superToken",
          superToken
        );
        assert.fieldEquals("VestingScheduleCreatedEvent", id, "sender", sender);
        assert.fieldEquals(
          "VestingScheduleCreatedEvent",
          id,
          "receiver",
          receiver
        );
        assert.fieldEquals(
          "VestingScheduleCreatedEvent",
          id,
          "startDate",
          startDate.toString()
        );
        assert.fieldEquals(
          "VestingScheduleCreatedEvent",
          id,
          "cliffDate",
          cliffDate.toString()
        );
        assert.fieldEquals(
          "VestingScheduleCreatedEvent",
          id,
          "flowRate",
          flowRate.toString()
        );
        assert.fieldEquals(
          "VestingScheduleCreatedEvent",
          id,
          "cliffAmount",
          cliffAmount.toString()
        );
        assert.fieldEquals(
          "VestingScheduleCreatedEvent",
          id,
          "endDate",
          endDate.toString()
        );
      });

      test("handleVestingScheduleDeleted() - Should create a new VestingScheduleDeletedEvent entity", () => {
        const event = createNewDeleteVestingScheduleEvent(
          superToken,
          sender,
          receiver
        );

        handleVestingScheduleDeleted(event);

        const id = assertEventBaseProperties(event, "VestingScheduleDeleted");
        assert.fieldEquals(
          "VestingScheduleDeletedEvent",
          id,
          "superToken",
          superToken
        );
        assert.fieldEquals("VestingScheduleDeletedEvent", id, "sender", sender);
        assert.fieldEquals(
          "VestingScheduleDeletedEvent",
          id,
          "receiver",
          receiver
        );
      });

      test("handleVestingEndExecuted() - Should create a new VestingEndExecutedEvent entity", () => {
        const event = createNewVestingEndExecutedEvent(
          superToken,
          sender,
          receiver,
          endDate,
          earlyEndCompensation,
          false
        );

        handleVestingEndExecuted(event);

        const id = assertEventBaseProperties(event, "VestingEndExecuted");
        assert.fieldEquals(
          "VestingEndExecutedEvent",
          id,
          "superToken",
          superToken
        );
        assert.fieldEquals("VestingEndExecutedEvent", id, "sender", sender);
        assert.fieldEquals("VestingEndExecutedEvent", id, "receiver", receiver);
        assert.fieldEquals(
          "VestingEndExecutedEvent",
          id,
          "endDate",
          endDate.toString()
        );
        assert.fieldEquals(
          "VestingEndExecutedEvent",
          id,
          "earlyEndCompensation",
          earlyEndCompensation.toString()
        );
        assert.fieldEquals(
          "VestingEndExecutedEvent",
          id,
          "didCompensationFail",
          FALSE
        );
      });

      test("handleVestingEndFailed() - Should create a new VestingEndFailedEvent entity", () => {
        const event = createNewVestingEndFailedEvent(
          superToken,
          sender,
          receiver,
          endDate
        );

        handleVestingEndFailed(event);

        const id = assertEventBaseProperties(event, "VestingEndFailed");
        assert.fieldEquals(
          "VestingEndFailedEvent",
          id,
          "superToken",
          superToken
        );
        assert.fieldEquals("VestingEndFailedEvent", id, "sender", sender);
        assert.fieldEquals("VestingEndFailedEvent", id, "receiver", receiver);
        assert.fieldEquals(
          "VestingEndFailedEvent",
          id,
          "endDate",
          endDate.toString()
        );
      });

      test("handleVestingCliffAndFlowExecuted() - Should create a new VestingCliffAndFlowExecutedEvent entity", () => {
        const event = createNewVestingCliffAndFlowExecutedEvent(
          superToken,
          sender,
          receiver,
          cliffAndFlowDate,
          flowRate,
          cliffAmount,
          flowDelayCompensation
        );

        handleVestingCliffAndFlowExecuted(event);

        const id = assertEventBaseProperties(
          event,
          "VestingCliffAndFlowExecuted"
        );
        assert.fieldEquals(
          "VestingCliffAndFlowExecutedEvent",
          id,
          "superToken",
          superToken
        );
        assert.fieldEquals(
          "VestingCliffAndFlowExecutedEvent",
          id,
          "sender",
          sender
        );
        assert.fieldEquals(
          "VestingCliffAndFlowExecutedEvent",
          id,
          "receiver",
          receiver
        );
        assert.fieldEquals(
          "VestingCliffAndFlowExecutedEvent",
          id,
          "cliffAndFlowDate",
          cliffAndFlowDate.toString()
        );
        assert.fieldEquals(
          "VestingCliffAndFlowExecutedEvent",
          id,
          "flowRate",
          flowRate.toString()
        );
        assert.fieldEquals(
          "VestingCliffAndFlowExecutedEvent",
          id,
          "cliffAmount",
          cliffAmount.toString()
        );
        assert.fieldEquals(
          "VestingCliffAndFlowExecutedEvent",
          id,
          "flowDelayCompensation",
          flowDelayCompensation.toString()
        );
      });

      test("handleVestingScheduleUpdated() - Should create a new VestingScheduleUpdatedEvent entity", () => {
        const event = createNewVestingScheduleUpdatedEvent(
          superToken,
          sender,
          receiver,
          oldEndDate,
          endDate
        );

        handleVestingScheduleUpdated(event);

        const id = assertEventBaseProperties(event, "VestingScheduleUpdated");
        assert.fieldEquals(
          "VestingScheduleUpdatedEvent",
          id,
          "superToken",
          superToken
        );
        assert.fieldEquals("VestingScheduleUpdatedEvent", id, "sender", sender);
        assert.fieldEquals(
          "VestingScheduleUpdatedEvent",
          id,
          "receiver",
          receiver
        );

        assert.fieldEquals(
          "VestingScheduleUpdatedEvent",
          id,
          "oldEndDate",
          oldEndDate.toString()
        );
        assert.fieldEquals(
          "VestingScheduleUpdatedEvent",
          id,
          "endDate",
          endDate.toString()
        );
      });
    });

    describe("VestingSchedule", () => {
      test("VestingScheduleCreated", () => {
        const event = createNewCreateVestingScheduleEvent(
          superToken,
          sender,
          receiver,
          startDate,
          cliffDate,
          flowRate,
          cliffAmount,
          endDate
        );

        handleVestingScheduleCreated(event);

        const cursor = getOrCreateTokenSenderReceiverCursor(
          Bytes.fromHexString(superToken),
          Bytes.fromHexString(sender),
          Bytes.fromHexString(receiver)
        );

        const vestingSchedule = getVestingSchedule(cursor)!;

        assert.stringEquals(
          vestingSchedule.id,
          `${event.transaction.hash.toHexString()}-${event.logIndex}`
        );

        assert.bytesEquals(
          Bytes.fromHexString(maticx),
          vestingSchedule.superToken
        );

        assert.bytesEquals(Bytes.fromHexString(alice), vestingSchedule.sender);

        assert.bytesEquals(Bytes.fromHexString(bob), vestingSchedule.receiver);

        assert.bigIntEquals(startDate, vestingSchedule.startDate);

        assert.bigIntEquals(endDate, vestingSchedule.endDate);

        assert.bigIntEquals(cliffDate, vestingSchedule.cliffDate!);

        assert.bigIntEquals(cliffAmount, vestingSchedule.cliffAmount);

        assert.bigIntEquals(flowRate, vestingSchedule.flowRate);
      });

      test("CliffAndFlowExecuted", () => {
        const createEvent = createNewCreateVestingScheduleEvent(
          superToken,
          sender,
          receiver,
          startDate,
          cliffDate,
          flowRate,
          cliffAmount,
          endDate
        );
        const cliffAndFlowEvent = createNewVestingCliffAndFlowExecutedEvent(
          superToken,
          sender,
          receiver,
          cliffAndFlowDate,
          flowRate,
          cliffAmount,
          flowDelayCompensation
        );

        handleVestingScheduleCreated(createEvent);
        handleVestingCliffAndFlowExecuted(cliffAndFlowEvent);

        const cursor = getOrCreateTokenSenderReceiverCursor(
          Bytes.fromHexString(superToken),
          Bytes.fromHexString(sender),
          Bytes.fromHexString(receiver)
        );

        const vestingSchedule = getVestingSchedule(cursor)!;

        assert.bigIntEquals(
          vestingSchedule.cliffAndFlowExecutedAt!,
          cliffAndFlowEvent.block.timestamp
        );
      });

      test("VestingScheduleUpdated", () => {
        const createEvent = createNewCreateVestingScheduleEvent(
          superToken,
          sender,
          receiver,
          startDate,
          cliffDate,
          flowRate,
          cliffAmount,
          oldEndDate
        );

        const updateEvent = createNewVestingScheduleUpdatedEvent(
          superToken,
          sender,
          receiver,
          oldEndDate,
          endDate
        );

        handleVestingScheduleCreated(createEvent);
        handleVestingScheduleUpdated(updateEvent);

        const cursor = getOrCreateTokenSenderReceiverCursor(
          Bytes.fromHexString(superToken),
          Bytes.fromHexString(sender),
          Bytes.fromHexString(receiver)
        );

        const vestingSchedule = getVestingSchedule(cursor)!;

        assert.bigIntEquals(vestingSchedule.endDate, endDate);
      });

      test("VestingScheduleDeleted", () => {
        const createEvent = createNewCreateVestingScheduleEvent(
          superToken,
          sender,
          receiver,
          startDate,
          cliffDate,
          flowRate,
          cliffAmount,
          endDate
        );

        const deletedEvent = createNewDeleteVestingScheduleEvent(
          superToken,
          sender,
          receiver
        );

        handleVestingScheduleCreated(createEvent);
        handleVestingScheduleDeleted(deletedEvent);

        const cursor = getOrCreateTokenSenderReceiverCursor(
          Bytes.fromHexString(superToken),
          Bytes.fromHexString(sender),
          Bytes.fromHexString(receiver)
        );

        assert.fieldEquals(
          "TokenSenderReceiverCursor",
          cursor.id,
          "currentVestingSchedule",
          "null"
        );
      });

      test("VestingEndExecuted", () => {
        const createEvent = createNewCreateVestingScheduleEvent(
          superToken,
          sender,
          receiver,
          startDate,
          cliffDate,
          flowRate,
          cliffAmount,
          endDate
        );

        const executedEvent = createNewVestingEndExecutedEvent(
          superToken,
          sender,
          receiver,
          endDate,
          earlyEndCompensation,
          false
        );

        handleVestingScheduleCreated(createEvent);
        handleVestingEndExecuted(executedEvent);

        const cursor = getOrCreateTokenSenderReceiverCursor(
          Bytes.fromHexString(superToken),
          Bytes.fromHexString(sender),
          Bytes.fromHexString(receiver)
        );

        const vestingSchedule = getVestingSchedule(cursor)!;

        assert.bigIntEquals(
          vestingSchedule.endExecutedAt!,
          executedEvent.block.timestamp
        );
      });

      test("VestingEndFailed", () => {
        const createEvent = createNewCreateVestingScheduleEvent(
          superToken,
          sender,
          receiver,
          startDate,
          cliffDate,
          flowRate,
          cliffAmount,
          endDate
        );

        const failedEvent = createNewVestingEndFailedEvent(
          superToken,
          sender,
          receiver,
          endDate
        );

        handleVestingScheduleCreated(createEvent);
        handleVestingEndFailed(failedEvent);

        const cursor = getOrCreateTokenSenderReceiverCursor(
          Bytes.fromHexString(superToken),
          Bytes.fromHexString(sender),
          Bytes.fromHexString(receiver)
        );

        const vestingSchedule = getVestingSchedule(cursor)!;

        assert.fieldEquals(
          "VestingSchedule",
          vestingSchedule.id,
          "endExecutedAt",
          "null"
        );

        assert.bigIntEquals(
          vestingSchedule.failedAt!,
          createEvent.block.timestamp
        );
      });
    });

    describe("Tasks", () => {
      test("CreateVesting should create tasks for cliffAndFlow/endVesting", () => {
        const event = createNewCreateVestingScheduleEvent(
          superToken,
          sender,
          receiver,
          startDate,
          cliffDate,
          flowRate,
          cliffAmount,
          endDate
        );

        handleVestingScheduleCreated(event);

        const cursor = getOrCreateTokenSenderReceiverCursor(
          Bytes.fromHexString(superToken),
          Bytes.fromHexString(sender),
          Bytes.fromHexString(receiver)
        );

        assert.assertNotNull(cursor.currentCliffAndFlowTask);
        assert.assertNotNull(cursor.currentEndVestingTask);

        const cliffAndFlowTask = Task.load(cursor.currentCliffAndFlowTask!)!;
        const endVestingTask = Task.load(cursor.currentEndVestingTask!)!;

        assert.bigIntEquals(cliffAndFlowTask.executionAt, cliffDate);

        assert.fieldEquals("Task", cliffAndFlowTask.id, "cancelledAt", "null");
        assert.fieldEquals("Task", cliffAndFlowTask.id, "failedAt", "null");
      });

      test("should update cliffAndFlow-task when cliffAndFlow happens", () => {
        const createdEvent = createNewCreateVestingScheduleEvent(
          superToken,
          sender,
          receiver,
          startDate,
          cliffDate,
          flowRate,
          cliffAmount,
          endDate
        );

        const cliffAndFlowEvent = createNewVestingCliffAndFlowExecutedEvent(
          superToken,
          sender,
          receiver,
          cliffAndFlowDate,
          flowRate,
          cliffAmount,
          flowDelayCompensation
        );

        handleVestingScheduleCreated(createdEvent);

        const cursor = getOrCreateTokenSenderReceiverCursor(
          Bytes.fromHexString(superToken),
          Bytes.fromHexString(sender),
          Bytes.fromHexString(receiver)
        );

        let cliffAndFlowTask = Task.load(cursor.currentCliffAndFlowTask!)!;

        handleVestingCliffAndFlowExecuted(cliffAndFlowEvent);

        cliffAndFlowTask = Task.load(cliffAndFlowTask.id)!;

        assert.bigIntEquals(cliffAndFlowTask.executionAt, cliffDate);

        assert.fieldEquals(
          "TokenSenderReceiverCursor",
          cursor.id,
          "currentCliffAndFlowTask",
          "null"
        );
      });

      test("should delete tasks when the VestingSchedule is deleted", () => {
        const createdEvent = createNewCreateVestingScheduleEvent(
          superToken,
          sender,
          receiver,
          startDate,
          cliffDate,
          flowRate,
          cliffAmount,
          endDate
        );

        const deletedEvent = createNewDeleteVestingScheduleEvent(
          superToken,
          sender,
          receiver
        );

        handleVestingScheduleCreated(createdEvent);

        const cursor = getOrCreateTokenSenderReceiverCursor(
          Bytes.fromHexString(superToken),
          Bytes.fromHexString(sender),
          Bytes.fromHexString(receiver)
        );

        let cliffAndFlowTask = Task.load(cursor.currentCliffAndFlowTask!)!;
        let endTask = Task.load(cursor.currentEndVestingTask!)!;

        handleVestingScheduleDeleted(deletedEvent);

        cliffAndFlowTask = Task.load(cliffAndFlowTask.id)!;
        endTask = Task.load(cursor.currentEndVestingTask!)!;

        assert.bigIntEquals(
          cliffAndFlowTask.cancelledAt!,
          deletedEvent.block.timestamp
        );
        assert.bigIntEquals(endTask.cancelledAt!, deletedEvent.block.timestamp);

        assert.fieldEquals(
          "TokenSenderReceiverCursor",
          cursor.id,
          "currentCliffAndFlowTask",
          "null"
        );

        assert.fieldEquals(
          "TokenSenderReceiverCursor",
          cursor.id,
          "currentEndVestingTask",
          "null"
        );
      });

      test("should update end-task endDate when the VestingSchedule is updated", () => {
        const createdEvent = createNewCreateVestingScheduleEvent(
          superToken,
          sender,
          receiver,
          startDate,
          cliffDate,
          flowRate,
          cliffAmount,
          endDate
        );

        const updatedEvent = createNewVestingScheduleUpdatedEvent(
          superToken,
          sender,
          receiver,
          oldEndDate,
          endDate
        );

        handleVestingScheduleCreated(createdEvent);

        const cursor = getOrCreateTokenSenderReceiverCursor(
          Bytes.fromHexString(superToken),
          Bytes.fromHexString(sender),
          Bytes.fromHexString(receiver)
        );

        handleVestingScheduleUpdated(updatedEvent);

        const endTask = Task.load(cursor.currentEndVestingTask!)!;

        assert.bigIntEquals(
          endTask.executionAt!,
          updatedEvent.params.endDate.minus(BigInt.fromI32(1338))
        );

        assert.assertNotNull(cursor.currentEndVestingTask);
      });

      test("should delete tasks when the VestingSchedule is ended", () => {
        const createdEvent = createNewCreateVestingScheduleEvent(
          superToken,
          sender,
          receiver,
          startDate,
          cliffDate,
          flowRate,
          cliffAmount,
          endDate
        );

        const endedEvent = createNewVestingEndExecutedEvent(
          superToken,
          sender,
          receiver,
          endDate,
          earlyEndCompensation,
          false
        );

        handleVestingScheduleCreated(createdEvent);

        const cursor = getOrCreateTokenSenderReceiverCursor(
          Bytes.fromHexString(superToken),
          Bytes.fromHexString(sender),
          Bytes.fromHexString(receiver)
        );

        let endTask = Task.load(cursor.currentEndVestingTask!)!;

        handleVestingEndExecuted(endedEvent);

        endTask = Task.load(endTask.id)!;

        assert.fieldEquals(
          "TokenSenderReceiverCursor",
          cursor.id,
          "currentEndVestingTask",
          "null"
        );
      });

      test("should set failedAt in endTask when a VestingSchedule fails", () => {
        const createdEvent = createNewCreateVestingScheduleEvent(
          superToken,
          sender,
          receiver,
          startDate,
          cliffDate,
          flowRate,
          cliffAmount,
          endDate
        );

        const failedEvent = createNewVestingEndFailedEvent(
          superToken,
          sender,
          receiver,
          endDate
        );

        handleVestingScheduleCreated(createdEvent);

        const cursor = getOrCreateTokenSenderReceiverCursor(
          Bytes.fromHexString(superToken),
          Bytes.fromHexString(sender),
          Bytes.fromHexString(receiver)
        );

        let endTask = Task.load(cursor.currentEndVestingTask!)!;

        handleVestingEndFailed(failedEvent);

        endTask = Task.load(endTask.id)!;

        assert.bigIntEquals(endTask.failedAt!, failedEvent.block.timestamp);

        assert.fieldEquals(
          "TokenSenderReceiverCursor",
          cursor.id,
          "currentEndVestingTask",
          "null"
        );
      });
    });
  });
});
