"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEEK = exports.DAY = exports.HOUR = exports.MINUTE = exports.ORDER_MULTIPLIER = void 0;
exports.setBaseProperties = setBaseProperties;
exports.createEventID = createEventID;
exports.getOrder = getOrder;
exports.getContractVersionSuffix = getContractVersionSuffix;
const graph_ts_1 = require("@graphprotocol/graph-ts");
exports.ORDER_MULTIPLIER = graph_ts_1.BigInt.fromI32(10000);
function setBaseProperties(name, event, entity, addresses) {
    entity.set("blockNumber", graph_ts_1.Value.fromBigInt(event.block.number));
    entity.set("logIndex", graph_ts_1.Value.fromBigInt(event.logIndex));
    entity.set("order", graph_ts_1.Value.fromBigInt(getOrder(event.block.number, event.logIndex)));
    entity.set("name", graph_ts_1.Value.fromString(name));
    entity.set("addresses", graph_ts_1.Value.fromBytesArray(addresses));
    entity.set("timestamp", graph_ts_1.Value.fromBigInt(event.block.timestamp));
    entity.set("transactionHash", graph_ts_1.Value.fromBytes(event.transaction.hash));
    entity.set("gasPrice", graph_ts_1.Value.fromBigInt(event.transaction.gasPrice));
    return entity;
}
function createEventID(eventName, event, contractVersion) {
    return `${eventName}-${event.transaction.hash.toHexString()}-${event.logIndex.toString()}${getContractVersionSuffix(contractVersion)}`;
}
/**
 * getOrder calculate order based on {blockNumber.times(10000).plus(logIndex)}.
 * @param blockNumber
 * @param logIndex
 */
function getOrder(blockNumber, logIndex) {
    return blockNumber.times(exports.ORDER_MULTIPLIER).plus(logIndex);
}
function getContractVersionSuffix(contractVersion) {
    return contractVersion === "v1" ? "" : `-${contractVersion}`;
}
exports.MINUTE = 60;
exports.HOUR = exports.MINUTE * 60;
exports.DAY = exports.HOUR * 24;
exports.WEEK = exports.DAY * 7;
