import { Bytes } from "@graphprotocol/graph-ts";
import { TokenSenderReceiverCursor } from "../types/schema";
import { getContractVersionSuffix } from "./general";

export function getOrCreateTokenSenderReceiverCursor(
  superToken: Bytes,
  sender: Bytes,
  receiver: Bytes,
  contractVersion: string
): TokenSenderReceiverCursor {
  const id = `${superToken.toHexString()}-${sender.toHexString()}-${receiver.toHexString()}${getContractVersionSuffix(contractVersion)}`;
  let tokenSenderReceiverCursor = TokenSenderReceiverCursor.load(id);

  if (!tokenSenderReceiverCursor) {
    return createTokenSenderReceiverCursor(
      superToken,
      sender,
      receiver,
      contractVersion
    );
  }

  return tokenSenderReceiverCursor;
}

export function createTokenSenderReceiverCursor(
  superToken: Bytes,
  sender: Bytes,
  receiver: Bytes,
  contractVersion: string
): TokenSenderReceiverCursor {
  const id = `${superToken.toHexString()}-${sender.toHexString()}-${receiver.toHexString()}${getContractVersionSuffix(contractVersion)}`;
  let tokenSenderReceiverCursor = new TokenSenderReceiverCursor(id);

  return tokenSenderReceiverCursor;
}
