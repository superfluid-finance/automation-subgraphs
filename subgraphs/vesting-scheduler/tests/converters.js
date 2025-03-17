"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keccak256String = keccak256String;
exports.stringToBytes = stringToBytes;
exports.getStringEventParam = getStringEventParam;
exports.getAddressEventParam = getAddressEventParam;
exports.getBytesEventParam = getBytesEventParam;
exports.getBigIntEventParam = getBigIntEventParam;
exports.getI32EventParam = getI32EventParam;
exports.getBooleanEventParam = getBooleanEventParam;
const graph_ts_1 = require("@graphprotocol/graph-ts");
/**
 * Takes a string and returns the keccak256 hash of it as Bytes type.
 * @param value string parameter value
 * @returns Bytes
 */
function keccak256String(value) {
    const byteArrayString = graph_ts_1.ByteArray.fromUTF8(value);
    return graph_ts_1.Bytes.fromByteArray(graph_ts_1.crypto.keccak256(byteArrayString));
}
/**
 * Takes a string and returns it as Bytes type.
 * @param value string parameter value
 * @returns Bytes
 */
function stringToBytes(value) {
    const byteArrayString = graph_ts_1.ByteArray.fromUTF8(value);
    return graph_ts_1.Bytes.fromByteArray(byteArrayString);
}
/**
 * Takes a string param and returns a string ethereum.EventParam object
 * @param name the name of the parameter (must match actual value from contracts)
 * @param value string parameter value
 * @returns ethereum.EventParam
 */
function getStringEventParam(name, value) {
    return new graph_ts_1.ethereum.EventParam(name, graph_ts_1.ethereum.Value.fromString(value));
}
/**
 * Takes a string address and returns an Address ethereum.EventParam object
 * @param name the name of the parameter (must match actual value from contracts)
 * @param value string parameter value
 * @returns ethereum.EventParam
 */
function getAddressEventParam(name, value) {
    return new graph_ts_1.ethereum.EventParam(name, graph_ts_1.ethereum.Value.fromAddress(graph_ts_1.Address.fromString(value)));
}
/**
 * Takes a bytes value and returns a Bytes ethereum.EventParam object
 * @param name the name of the parameter (must match actual value from contracts)
 * @param value Bytes parameter value
 * @returns ethereum.EventParam
 */
function getBytesEventParam(name, value) {
    return new graph_ts_1.ethereum.EventParam(name, graph_ts_1.ethereum.Value.fromBytes(value));
}
/**
 * Takes a BigInt value and returns a BigInt ethereum.EventParam object
 * @param name the name of the parameter (must match actual value from contracts)
 * @param value BigInt parameter value
 * @returns ethereum.EventParam
 */
function getBigIntEventParam(name, value) {
    return new graph_ts_1.ethereum.EventParam(name, graph_ts_1.ethereum.Value.fromUnsignedBigInt(value));
}
/**
 * Takes an i32 value and returns an i32 ethereum.EventParam object
 * @param name the name of the parameter (must match actual value from contracts)
 * @param value i32 parameter value
 * @returns ethereum.EventParam
 */
function getI32EventParam(name, value) {
    return new graph_ts_1.ethereum.EventParam(name, graph_ts_1.ethereum.Value.fromI32(value));
}
/**
 * Takes a boolean value and returns a boolean ethereum.EventParam object
 * @param name the name of the parameter (must match actual value from contracts)
 * @param value boolean parameter value
 * @returns ethereum.EventParam
 */
function getBooleanEventParam(name, value) {
    return new graph_ts_1.ethereum.EventParam(name, graph_ts_1.ethereum.Value.fromBoolean(value));
}
