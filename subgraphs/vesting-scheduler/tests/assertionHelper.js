"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertEventBaseProperties = assertEventBaseProperties;
exports.assertHigherOrderBaseProperties = assertHigherOrderBaseProperties;
const matchstick_as_1 = require("matchstick-as");
const general_1 = require("../src/utils/general");
/**
 * Asserts that the "base" properties on our Event entity are correct
 * @param event The event we are checking
 * @param eventName The name of the event
 * @returns The id of the event (based on our createEventID function)
 */
function assertEventBaseProperties(event, eventName, contractVersion) {
    const entityType = eventName + "Event";
    const id = (0, general_1.createEventID)(eventName, event, contractVersion);
    const order = (0, general_1.getOrder)(event.block.number, event.logIndex);
    matchstick_as_1.assert.fieldEquals(entityType, id, "id", id);
    matchstick_as_1.assert.fieldEquals(entityType, id, "blockNumber", event.block.number.toString());
    matchstick_as_1.assert.fieldEquals(entityType, id, "logIndex", event.logIndex.toString());
    matchstick_as_1.assert.fieldEquals(entityType, id, "order", order.toString());
    matchstick_as_1.assert.fieldEquals(entityType, id, "timestamp", event.block.timestamp.toString());
    matchstick_as_1.assert.fieldEquals(entityType, id, "transactionHash", event.transaction.hash.toHex());
    matchstick_as_1.assert.fieldEquals(entityType, id, "gasPrice", event.transaction.gasPrice.toString());
    return id;
}
/**
 * Asserts that the "base" properties on our Higher Order entity are correct
 * @param entityName The name of the entity
 * @param id the id of the entity
 * @param createdAtTimestamp timestamp retrieved from the event
 * @param createdAtBlockNumber block number retrieved from the event
 * @param updatedAtTimestamp timestamp retrieved from the event
 * @param updatedAtBlockNumber block number retrieved from the event
 */
function assertHigherOrderBaseProperties(entityName, id, createdAtTimestamp, createdAtBlockNumber, updatedAtTimestamp, updatedAtBlockNumber) {
    matchstick_as_1.assert.fieldEquals(entityName, id, "id", id);
    matchstick_as_1.assert.fieldEquals(entityName, id, "createdAtTimestamp", createdAtTimestamp.toString());
    matchstick_as_1.assert.fieldEquals(entityName, id, "createdAtBlockNumber", createdAtBlockNumber.toString());
    matchstick_as_1.assert.fieldEquals(entityName, id, "updatedAtTimestamp", updatedAtTimestamp.toString());
    matchstick_as_1.assert.fieldEquals(entityName, id, "updatedAtBlockNumber", updatedAtBlockNumber.toString());
}
