"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateTokenSenderReceiverCursor = getOrCreateTokenSenderReceiverCursor;
exports.createTokenSenderReceiverCursor = createTokenSenderReceiverCursor;
const schema_1 = require("../types/schema");
const general_1 = require("./general");
function getOrCreateTokenSenderReceiverCursor(superToken, sender, receiver, contractVersion) {
    const id = `${superToken.toHexString()}-${sender.toHexString()}-${receiver.toHexString()}${(0, general_1.getContractVersionSuffix)(contractVersion)}`;
    let tokenSenderReceiverCursor = schema_1.TokenSenderReceiverCursor.load(id);
    if (!tokenSenderReceiverCursor) {
        return createTokenSenderReceiverCursor(superToken, sender, receiver, contractVersion);
    }
    return tokenSenderReceiverCursor;
}
function createTokenSenderReceiverCursor(superToken, sender, receiver, contractVersion) {
    const id = `${superToken.toHexString()}-${sender.toHexString()}-${receiver.toHexString()}${(0, general_1.getContractVersionSuffix)(contractVersion)}`;
    let tokenSenderReceiverCursor = new schema_1.TokenSenderReceiverCursor(id);
    return tokenSenderReceiverCursor;
}
