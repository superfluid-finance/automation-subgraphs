"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graph_ts_1 = require("@graphprotocol/graph-ts");
const matchstick_as_1 = require("matchstick-as");
const vestingScheduler_1 = require("../src/mappings/vestingScheduler");
const schema_1 = require("../src/types/schema");
const tokenSenderReceiverCursor_1 = require("../src/utils/tokenSenderReceiverCursor");
const vestingSchedule_1 = require("../src/utils/vestingSchedule");
const assertionHelper_1 = require("./assertionHelper");
const constants_1 = require("./constants");
const vestingScheduler_helper_1 = require("./vestingScheduler.helper");
let contractAddress = graph_ts_1.Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2A");
let contractVersion = "v1";
(0, matchstick_as_1.mockFunction)(contractAddress, "START_DATE_VALID_AFTER", "START_DATE_VALID_AFTER():(uint32)", [], 
//@ts-ignore
[graph_ts_1.ethereum.Value.fromI32(1337)], false);
(0, matchstick_as_1.mockFunction)(contractAddress, "END_DATE_VALID_BEFORE", "END_DATE_VALID_BEFORE():(uint32)", [], 
//@ts-ignore
[graph_ts_1.ethereum.Value.fromI32(1338)], false);
const sender = constants_1.alice;
const receiver = constants_1.bob;
const superToken = constants_1.maticx;
const startDate = graph_ts_1.BigInt.fromI32(100);
const cliffDate = graph_ts_1.BigInt.fromI32(101);
const cliffAndFlowDate = graph_ts_1.BigInt.fromI32(102);
const oldEndDate = graph_ts_1.BigInt.fromI32(103);
const earlyEndCompensation = graph_ts_1.BigInt.fromI32(104);
const flowDelayCompensation = graph_ts_1.BigInt.fromI32(105);
const cliffAmount = graph_ts_1.BigInt.fromI32(1000);
const flowRate = graph_ts_1.BigInt.fromI32(100);
const endDate = graph_ts_1.BigInt.fromI32(150);
(0, matchstick_as_1.describe)("Host Mapper Unit Tests", () => {
    (0, matchstick_as_1.describe)("Event Entity Mapping Tests", () => {
        (0, matchstick_as_1.beforeEach)(() => {
            (0, matchstick_as_1.clearStore)();
        });
        (0, matchstick_as_1.describe)("handlers", () => {
            (0, matchstick_as_1.test)("handleVestingScheduleCreated() - Should create a new VestingScheduleCreatedEvent entity", () => {
                const event = (0, vestingScheduler_helper_1.createNewCreateVestingScheduleEvent)(superToken, sender, receiver, startDate, cliffDate, flowRate, cliffAmount, endDate);
                (0, vestingScheduler_1.handleVestingScheduleCreated_v1)(event);
                const id = (0, assertionHelper_1.assertEventBaseProperties)(event, "VestingScheduleCreated", contractVersion);
                matchstick_as_1.assert.fieldEquals("VestingScheduleCreatedEvent", id, "superToken", superToken);
                matchstick_as_1.assert.fieldEquals("VestingScheduleCreatedEvent", id, "sender", sender);
                matchstick_as_1.assert.fieldEquals("VestingScheduleCreatedEvent", id, "receiver", receiver);
                matchstick_as_1.assert.fieldEquals("VestingScheduleCreatedEvent", id, "startDate", startDate.toString());
                matchstick_as_1.assert.fieldEquals("VestingScheduleCreatedEvent", id, "cliffDate", cliffDate.toString());
                matchstick_as_1.assert.fieldEquals("VestingScheduleCreatedEvent", id, "flowRate", flowRate.toString());
                matchstick_as_1.assert.fieldEquals("VestingScheduleCreatedEvent", id, "cliffAmount", cliffAmount.toString());
                matchstick_as_1.assert.fieldEquals("VestingScheduleCreatedEvent", id, "endDate", endDate.toString());
            });
            (0, matchstick_as_1.test)("handleVestingScheduleDeleted() - Should create a new VestingScheduleDeletedEvent entity", () => {
                const event = (0, vestingScheduler_helper_1.createNewDeleteVestingScheduleEvent)(superToken, sender, receiver);
                (0, vestingScheduler_1.handleVestingScheduleDeleted_v1)(event);
                const id = (0, assertionHelper_1.assertEventBaseProperties)(event, "VestingScheduleDeleted", contractVersion);
                matchstick_as_1.assert.fieldEquals("VestingScheduleDeletedEvent", id, "superToken", superToken);
                matchstick_as_1.assert.fieldEquals("VestingScheduleDeletedEvent", id, "sender", sender);
                matchstick_as_1.assert.fieldEquals("VestingScheduleDeletedEvent", id, "receiver", receiver);
            });
            (0, matchstick_as_1.test)("handleVestingEndExecuted() - Should create a new VestingEndExecutedEvent entity", () => {
                const event = (0, vestingScheduler_helper_1.createNewVestingEndExecutedEvent)(superToken, sender, receiver, endDate, earlyEndCompensation, false);
                (0, vestingScheduler_1.handleVestingEndExecuted_v1)(event);
                const id = (0, assertionHelper_1.assertEventBaseProperties)(event, "VestingEndExecuted", contractVersion);
                matchstick_as_1.assert.fieldEquals("VestingEndExecutedEvent", id, "superToken", superToken);
                matchstick_as_1.assert.fieldEquals("VestingEndExecutedEvent", id, "sender", sender);
                matchstick_as_1.assert.fieldEquals("VestingEndExecutedEvent", id, "receiver", receiver);
                matchstick_as_1.assert.fieldEquals("VestingEndExecutedEvent", id, "endDate", endDate.toString());
                matchstick_as_1.assert.fieldEquals("VestingEndExecutedEvent", id, "earlyEndCompensation", earlyEndCompensation.toString());
                matchstick_as_1.assert.fieldEquals("VestingEndExecutedEvent", id, "didCompensationFail", constants_1.FALSE);
            });
            (0, matchstick_as_1.test)("handleVestingEndFailed() - Should create a new VestingEndFailedEvent entity", () => {
                const event = (0, vestingScheduler_helper_1.createNewVestingEndFailedEvent)(superToken, sender, receiver, endDate);
                (0, vestingScheduler_1.handleVestingEndFailed_v1)(event);
                const id = (0, assertionHelper_1.assertEventBaseProperties)(event, "VestingEndFailed", contractVersion);
                matchstick_as_1.assert.fieldEquals("VestingEndFailedEvent", id, "superToken", superToken);
                matchstick_as_1.assert.fieldEquals("VestingEndFailedEvent", id, "sender", sender);
                matchstick_as_1.assert.fieldEquals("VestingEndFailedEvent", id, "receiver", receiver);
                matchstick_as_1.assert.fieldEquals("VestingEndFailedEvent", id, "endDate", endDate.toString());
            });
            (0, matchstick_as_1.test)("handleVestingCliffAndFlowExecuted() - Should create a new VestingCliffAndFlowExecutedEvent entity", () => {
                const event = (0, vestingScheduler_helper_1.createNewVestingCliffAndFlowExecutedEvent)(superToken, sender, receiver, cliffAndFlowDate, flowRate, cliffAmount, flowDelayCompensation);
                (0, vestingScheduler_1.handleVestingCliffAndFlowExecuted_v1)(event);
                const id = (0, assertionHelper_1.assertEventBaseProperties)(event, "VestingCliffAndFlowExecuted", contractVersion);
                matchstick_as_1.assert.fieldEquals("VestingCliffAndFlowExecutedEvent", id, "superToken", superToken);
                matchstick_as_1.assert.fieldEquals("VestingCliffAndFlowExecutedEvent", id, "sender", sender);
                matchstick_as_1.assert.fieldEquals("VestingCliffAndFlowExecutedEvent", id, "receiver", receiver);
                matchstick_as_1.assert.fieldEquals("VestingCliffAndFlowExecutedEvent", id, "cliffAndFlowDate", cliffAndFlowDate.toString());
                matchstick_as_1.assert.fieldEquals("VestingCliffAndFlowExecutedEvent", id, "flowRate", flowRate.toString());
                matchstick_as_1.assert.fieldEquals("VestingCliffAndFlowExecutedEvent", id, "cliffAmount", cliffAmount.toString());
                matchstick_as_1.assert.fieldEquals("VestingCliffAndFlowExecutedEvent", id, "flowDelayCompensation", flowDelayCompensation.toString());
            });
            (0, matchstick_as_1.test)("handleVestingScheduleUpdated() - Should create a new VestingScheduleUpdatedEvent entity", () => {
                const event = (0, vestingScheduler_helper_1.createNewVestingScheduleUpdatedEvent)(superToken, sender, receiver, oldEndDate, endDate);
                (0, vestingScheduler_1.handleVestingScheduleUpdated_v1)(event);
                const id = (0, assertionHelper_1.assertEventBaseProperties)(event, "VestingScheduleUpdated", contractVersion);
                matchstick_as_1.assert.fieldEquals("VestingScheduleUpdatedEvent", id, "superToken", superToken);
                matchstick_as_1.assert.fieldEquals("VestingScheduleUpdatedEvent", id, "sender", sender);
                matchstick_as_1.assert.fieldEquals("VestingScheduleUpdatedEvent", id, "receiver", receiver);
                matchstick_as_1.assert.fieldEquals("VestingScheduleUpdatedEvent", id, "oldEndDate", oldEndDate.toString());
                matchstick_as_1.assert.fieldEquals("VestingScheduleUpdatedEvent", id, "endDate", endDate.toString());
            });
        });
        (0, matchstick_as_1.describe)("VestingSchedule", () => {
            (0, matchstick_as_1.test)("VestingScheduleCreated", () => {
                const event = (0, vestingScheduler_helper_1.createNewCreateVestingScheduleEvent)(superToken, sender, receiver, startDate, cliffDate, flowRate, cliffAmount, endDate);
                (0, vestingScheduler_1.handleVestingScheduleCreated_v1)(event);
                const cursor = (0, tokenSenderReceiverCursor_1.getOrCreateTokenSenderReceiverCursor)(graph_ts_1.Bytes.fromHexString(superToken), graph_ts_1.Bytes.fromHexString(sender), graph_ts_1.Bytes.fromHexString(receiver), contractVersion);
                const vestingSchedule = (0, vestingSchedule_1.getVestingSchedule)(cursor);
                matchstick_as_1.assert.stringEquals(vestingSchedule.id, `${event.transaction.hash.toHexString()}-${event.logIndex}`);
                matchstick_as_1.assert.bytesEquals(graph_ts_1.Bytes.fromHexString(constants_1.maticx), vestingSchedule.superToken);
                matchstick_as_1.assert.bytesEquals(graph_ts_1.Bytes.fromHexString(constants_1.alice), vestingSchedule.sender);
                matchstick_as_1.assert.bytesEquals(graph_ts_1.Bytes.fromHexString(constants_1.bob), vestingSchedule.receiver);
                matchstick_as_1.assert.bigIntEquals(startDate, vestingSchedule.startDate);
                matchstick_as_1.assert.bigIntEquals(endDate, vestingSchedule.endDate);
                matchstick_as_1.assert.bigIntEquals(cliffDate, vestingSchedule.cliffDate);
                matchstick_as_1.assert.bigIntEquals(cliffAmount, vestingSchedule.cliffAmount);
                matchstick_as_1.assert.bigIntEquals(flowRate, vestingSchedule.flowRate);
            });
            (0, matchstick_as_1.test)("CliffAndFlowExecuted", () => {
                const createEvent = (0, vestingScheduler_helper_1.createNewCreateVestingScheduleEvent)(superToken, sender, receiver, startDate, cliffDate, flowRate, cliffAmount, endDate);
                const cliffAndFlowEvent = (0, vestingScheduler_helper_1.createNewVestingCliffAndFlowExecutedEvent)(superToken, sender, receiver, cliffAndFlowDate, flowRate, cliffAmount, flowDelayCompensation);
                (0, vestingScheduler_1.handleVestingScheduleCreated_v1)(createEvent);
                (0, vestingScheduler_1.handleVestingCliffAndFlowExecuted_v1)(cliffAndFlowEvent);
                const cursor = (0, tokenSenderReceiverCursor_1.getOrCreateTokenSenderReceiverCursor)(graph_ts_1.Bytes.fromHexString(superToken), graph_ts_1.Bytes.fromHexString(sender), graph_ts_1.Bytes.fromHexString(receiver), contractVersion);
                const vestingSchedule = (0, vestingSchedule_1.getVestingSchedule)(cursor);
                matchstick_as_1.assert.bigIntEquals(vestingSchedule.cliffAndFlowExecutedAt, cliffAndFlowEvent.block.timestamp);
            });
            (0, matchstick_as_1.test)("VestingScheduleUpdated", () => {
                const createEvent = (0, vestingScheduler_helper_1.createNewCreateVestingScheduleEvent)(superToken, sender, receiver, startDate, cliffDate, flowRate, cliffAmount, oldEndDate);
                const updateEvent = (0, vestingScheduler_helper_1.createNewVestingScheduleUpdatedEvent)(superToken, sender, receiver, oldEndDate, endDate);
                (0, vestingScheduler_1.handleVestingScheduleCreated_v1)(createEvent);
                (0, vestingScheduler_1.handleVestingScheduleUpdated_v1)(updateEvent);
                const cursor = (0, tokenSenderReceiverCursor_1.getOrCreateTokenSenderReceiverCursor)(graph_ts_1.Bytes.fromHexString(superToken), graph_ts_1.Bytes.fromHexString(sender), graph_ts_1.Bytes.fromHexString(receiver), contractVersion);
                const vestingSchedule = (0, vestingSchedule_1.getVestingSchedule)(cursor);
                matchstick_as_1.assert.bigIntEquals(vestingSchedule.endDate, endDate);
            });
            (0, matchstick_as_1.test)("VestingScheduleDeleted", () => {
                const createEvent = (0, vestingScheduler_helper_1.createNewCreateVestingScheduleEvent)(superToken, sender, receiver, startDate, cliffDate, flowRate, cliffAmount, endDate);
                const deletedEvent = (0, vestingScheduler_helper_1.createNewDeleteVestingScheduleEvent)(superToken, sender, receiver);
                (0, vestingScheduler_1.handleVestingScheduleCreated_v1)(createEvent);
                (0, vestingScheduler_1.handleVestingScheduleDeleted_v1)(deletedEvent);
                const cursor = (0, tokenSenderReceiverCursor_1.getOrCreateTokenSenderReceiverCursor)(graph_ts_1.Bytes.fromHexString(superToken), graph_ts_1.Bytes.fromHexString(sender), graph_ts_1.Bytes.fromHexString(receiver), contractVersion);
                matchstick_as_1.assert.fieldEquals("TokenSenderReceiverCursor", cursor.id, "currentVestingSchedule", "null");
            });
            (0, matchstick_as_1.test)("VestingEndExecuted", () => {
                const createEvent = (0, vestingScheduler_helper_1.createNewCreateVestingScheduleEvent)(superToken, sender, receiver, startDate, cliffDate, flowRate, cliffAmount, endDate);
                const executedEvent = (0, vestingScheduler_helper_1.createNewVestingEndExecutedEvent)(superToken, sender, receiver, endDate, earlyEndCompensation, false);
                (0, vestingScheduler_1.handleVestingScheduleCreated_v1)(createEvent);
                (0, vestingScheduler_1.handleVestingEndExecuted_v1)(executedEvent);
                const cursor = (0, tokenSenderReceiverCursor_1.getOrCreateTokenSenderReceiverCursor)(graph_ts_1.Bytes.fromHexString(superToken), graph_ts_1.Bytes.fromHexString(sender), graph_ts_1.Bytes.fromHexString(receiver), contractVersion);
                const vestingSchedule = (0, vestingSchedule_1.getVestingSchedule)(cursor);
                matchstick_as_1.assert.bigIntEquals(vestingSchedule.endExecutedAt, executedEvent.block.timestamp);
            });
            (0, matchstick_as_1.test)("VestingEndFailed", () => {
                const createEvent = (0, vestingScheduler_helper_1.createNewCreateVestingScheduleEvent)(superToken, sender, receiver, startDate, cliffDate, flowRate, cliffAmount, endDate);
                const failedEvent = (0, vestingScheduler_helper_1.createNewVestingEndFailedEvent)(superToken, sender, receiver, endDate);
                (0, vestingScheduler_1.handleVestingScheduleCreated_v1)(createEvent);
                (0, vestingScheduler_1.handleVestingEndFailed_v1)(failedEvent);
                const cursor = (0, tokenSenderReceiverCursor_1.getOrCreateTokenSenderReceiverCursor)(graph_ts_1.Bytes.fromHexString(superToken), graph_ts_1.Bytes.fromHexString(sender), graph_ts_1.Bytes.fromHexString(receiver), contractVersion);
                const vestingSchedule = (0, vestingSchedule_1.getVestingSchedule)(cursor);
                matchstick_as_1.assert.fieldEquals("VestingSchedule", vestingSchedule.id, "endExecutedAt", "null");
                matchstick_as_1.assert.bigIntEquals(vestingSchedule.failedAt, createEvent.block.timestamp);
            });
            // TODO: add test for claiming
            // test("VestingClaimed", () => {
            //   const createdEvent = createNewCreateVestingScheduleEvent(
            //     superToken,
            //     sender,
            //     receiver,
            //     startDate,
            //     cliffDate,
            //     flowRate,
            //     cliffAmount,
            //     endDate
            //   );
            //   const claimer = charlie;
            //   const claimedEvent = createNewVestingClaimedEvent(
            //     superToken,
            //     sender,
            //     receiver,
            //     claimer
            //   );
            //   handleVestingScheduleCreated_v2(createdEvent);
            //   handleVestingClaimed_v2(claimedEvent);
            //   const cursor = getOrCreateTokenSenderReceiverCursor(
            //     Bytes.fromHexString(superToken),
            //     Bytes.fromHexString(sender),
            //     Bytes.fromHexString(receiver),
            //     contractVersion
            //   );
            //   const vestingSchedule = getVestingSchedule(cursor)!;
            //   assert.bigIntEquals(
            //     vestingSchedule.claimedAt!,
            //     claimedEvent.block.timestamp
            //   );
            // });
        });
        (0, matchstick_as_1.describe)("Tasks", () => {
            (0, matchstick_as_1.test)("CreateVesting should create tasks for cliffAndFlow/endVesting", () => {
                const event = (0, vestingScheduler_helper_1.createNewCreateVestingScheduleEvent)(superToken, sender, receiver, startDate, cliffDate, flowRate, cliffAmount, endDate);
                (0, vestingScheduler_1.handleVestingScheduleCreated_v1)(event);
                const cursor = (0, tokenSenderReceiverCursor_1.getOrCreateTokenSenderReceiverCursor)(graph_ts_1.Bytes.fromHexString(superToken), graph_ts_1.Bytes.fromHexString(sender), graph_ts_1.Bytes.fromHexString(receiver), contractVersion);
                matchstick_as_1.assert.assertNotNull(cursor.currentCliffAndFlowTask);
                matchstick_as_1.assert.assertNotNull(cursor.currentEndVestingTask);
                const cliffAndFlowTask = schema_1.Task.load(cursor.currentCliffAndFlowTask);
                const endVestingTask = schema_1.Task.load(cursor.currentEndVestingTask);
                matchstick_as_1.assert.bigIntEquals(cliffAndFlowTask.executionAt, cliffDate);
                matchstick_as_1.assert.fieldEquals("Task", cliffAndFlowTask.id, "cancelledAt", "null");
                matchstick_as_1.assert.fieldEquals("Task", cliffAndFlowTask.id, "failedAt", "null");
            });
            (0, matchstick_as_1.test)("should update cliffAndFlow-task when cliffAndFlow happens", () => {
                const createdEvent = (0, vestingScheduler_helper_1.createNewCreateVestingScheduleEvent)(superToken, sender, receiver, startDate, cliffDate, flowRate, cliffAmount, endDate);
                const cliffAndFlowEvent = (0, vestingScheduler_helper_1.createNewVestingCliffAndFlowExecutedEvent)(superToken, sender, receiver, cliffAndFlowDate, flowRate, cliffAmount, flowDelayCompensation);
                (0, vestingScheduler_1.handleVestingScheduleCreated_v1)(createdEvent);
                const cursor = (0, tokenSenderReceiverCursor_1.getOrCreateTokenSenderReceiverCursor)(graph_ts_1.Bytes.fromHexString(superToken), graph_ts_1.Bytes.fromHexString(sender), graph_ts_1.Bytes.fromHexString(receiver), contractVersion);
                let cliffAndFlowTask = schema_1.Task.load(cursor.currentCliffAndFlowTask);
                (0, vestingScheduler_1.handleVestingCliffAndFlowExecuted_v1)(cliffAndFlowEvent);
                cliffAndFlowTask = schema_1.Task.load(cliffAndFlowTask.id);
                matchstick_as_1.assert.bigIntEquals(cliffAndFlowTask.executionAt, cliffDate);
                matchstick_as_1.assert.fieldEquals("TokenSenderReceiverCursor", cursor.id, "currentCliffAndFlowTask", "null");
            });
            (0, matchstick_as_1.test)("should delete tasks when the VestingSchedule is deleted", () => {
                const createdEvent = (0, vestingScheduler_helper_1.createNewCreateVestingScheduleEvent)(superToken, sender, receiver, startDate, cliffDate, flowRate, cliffAmount, endDate);
                const deletedEvent = (0, vestingScheduler_helper_1.createNewDeleteVestingScheduleEvent)(superToken, sender, receiver);
                (0, vestingScheduler_1.handleVestingScheduleCreated_v1)(createdEvent);
                const cursor = (0, tokenSenderReceiverCursor_1.getOrCreateTokenSenderReceiverCursor)(graph_ts_1.Bytes.fromHexString(superToken), graph_ts_1.Bytes.fromHexString(sender), graph_ts_1.Bytes.fromHexString(receiver), contractVersion);
                let cliffAndFlowTask = schema_1.Task.load(cursor.currentCliffAndFlowTask);
                let endTask = schema_1.Task.load(cursor.currentEndVestingTask);
                (0, vestingScheduler_1.handleVestingScheduleDeleted_v1)(deletedEvent);
                cliffAndFlowTask = schema_1.Task.load(cliffAndFlowTask.id);
                endTask = schema_1.Task.load(cursor.currentEndVestingTask);
                matchstick_as_1.assert.bigIntEquals(cliffAndFlowTask.cancelledAt, deletedEvent.block.timestamp);
                matchstick_as_1.assert.bigIntEquals(endTask.cancelledAt, deletedEvent.block.timestamp);
                matchstick_as_1.assert.fieldEquals("TokenSenderReceiverCursor", cursor.id, "currentCliffAndFlowTask", "null");
                matchstick_as_1.assert.fieldEquals("TokenSenderReceiverCursor", cursor.id, "currentEndVestingTask", "null");
            });
            (0, matchstick_as_1.test)("should update end-task endDate when the VestingSchedule is updated", () => {
                const createdEvent = (0, vestingScheduler_helper_1.createNewCreateVestingScheduleEvent)(superToken, sender, receiver, startDate, cliffDate, flowRate, cliffAmount, endDate);
                const updatedEvent = (0, vestingScheduler_helper_1.createNewVestingScheduleUpdatedEvent)(superToken, sender, receiver, oldEndDate, endDate);
                (0, vestingScheduler_1.handleVestingScheduleCreated_v1)(createdEvent);
                const cursor = (0, tokenSenderReceiverCursor_1.getOrCreateTokenSenderReceiverCursor)(graph_ts_1.Bytes.fromHexString(superToken), graph_ts_1.Bytes.fromHexString(sender), graph_ts_1.Bytes.fromHexString(receiver), contractVersion);
                (0, vestingScheduler_1.handleVestingScheduleUpdated_v1)(updatedEvent);
                const endTask = schema_1.Task.load(cursor.currentEndVestingTask);
                matchstick_as_1.assert.bigIntEquals(endTask.executionAt, updatedEvent.params.endDate.minus(graph_ts_1.BigInt.fromI32(1338)));
                matchstick_as_1.assert.assertNotNull(cursor.currentEndVestingTask);
            });
            (0, matchstick_as_1.test)("should delete tasks when the VestingSchedule is ended", () => {
                const createdEvent = (0, vestingScheduler_helper_1.createNewCreateVestingScheduleEvent)(superToken, sender, receiver, startDate, cliffDate, flowRate, cliffAmount, endDate);
                const endedEvent = (0, vestingScheduler_helper_1.createNewVestingEndExecutedEvent)(superToken, sender, receiver, endDate, earlyEndCompensation, false);
                (0, vestingScheduler_1.handleVestingScheduleCreated_v1)(createdEvent);
                const cursor = (0, tokenSenderReceiverCursor_1.getOrCreateTokenSenderReceiverCursor)(graph_ts_1.Bytes.fromHexString(superToken), graph_ts_1.Bytes.fromHexString(sender), graph_ts_1.Bytes.fromHexString(receiver), contractVersion);
                let endTask = schema_1.Task.load(cursor.currentEndVestingTask);
                (0, vestingScheduler_1.handleVestingEndExecuted_v1)(endedEvent);
                endTask = schema_1.Task.load(endTask.id);
                matchstick_as_1.assert.fieldEquals("TokenSenderReceiverCursor", cursor.id, "currentEndVestingTask", "null");
            });
            (0, matchstick_as_1.test)("should set failedAt in endTask when a VestingSchedule fails", () => {
                const createdEvent = (0, vestingScheduler_helper_1.createNewCreateVestingScheduleEvent)(superToken, sender, receiver, startDate, cliffDate, flowRate, cliffAmount, endDate);
                const failedEvent = (0, vestingScheduler_helper_1.createNewVestingEndFailedEvent)(superToken, sender, receiver, endDate);
                (0, vestingScheduler_1.handleVestingScheduleCreated_v1)(createdEvent);
                const cursor = (0, tokenSenderReceiverCursor_1.getOrCreateTokenSenderReceiverCursor)(graph_ts_1.Bytes.fromHexString(superToken), graph_ts_1.Bytes.fromHexString(sender), graph_ts_1.Bytes.fromHexString(receiver), contractVersion);
                let endTask = schema_1.Task.load(cursor.currentEndVestingTask);
                (0, vestingScheduler_1.handleVestingEndFailed_v1)(failedEvent);
                endTask = schema_1.Task.load(endTask.id);
                matchstick_as_1.assert.bigIntEquals(endTask.failedAt, failedEvent.block.timestamp);
                matchstick_as_1.assert.fieldEquals("TokenSenderReceiverCursor", cursor.id, "currentEndVestingTask", "null");
            });
        });
    });
});
