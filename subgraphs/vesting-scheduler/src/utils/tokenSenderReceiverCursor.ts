import { Bytes } from "@graphprotocol/graph-ts";
import { TokenSenderReceiverCursor } from "../types/schema";

export function getOrCreateTokenSenderReceiverCursor(
  superToken: Bytes,
  sender: Bytes,
  receiver: Bytes
): TokenSenderReceiverCursor {
  const id = `${superToken.toHexString()}-${sender.toHexString()}-${receiver.toHexString()}`;
  let tokenSenderReceiverCursor = TokenSenderReceiverCursor.load(id);

  if (!tokenSenderReceiverCursor) {
    return createTokenSenderReceiverCursor(superToken, sender, receiver);
  }

  return tokenSenderReceiverCursor;
}

export function createTokenSenderReceiverCursor(
  superToken: Bytes,
  sender: Bytes,
  receiver: Bytes
): TokenSenderReceiverCursor {
  const id = `${superToken.toHexString()}-${sender.toHexString()}-${receiver.toHexString()}`;
  let tokenSenderReceiverCursor = new TokenSenderReceiverCursor(id);

  return tokenSenderReceiverCursor;
}
