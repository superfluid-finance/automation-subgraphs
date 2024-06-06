import {
  BigInt,
  Bytes,
  Entity,
  ethereum,
  Value,
} from "@graphprotocol/graph-ts";

export const ORDER_MULTIPLIER = BigInt.fromI32(10000);

export function setBaseProperties(
  name: string,
  event: ethereum.Event,
  entity: Entity,
  addresses: Bytes[]
): Entity {
  entity.set("blockNumber", Value.fromBigInt(event.block.number));
  entity.set("logIndex", Value.fromBigInt(event.logIndex));
  entity.set(
    "order",
    Value.fromBigInt(getOrder(event.block.number, event.logIndex))
  );
  entity.set("name", Value.fromString(name));
  entity.set("addresses", Value.fromBytesArray(addresses));
  entity.set("timestamp", Value.fromBigInt(event.block.timestamp));
  entity.set("transactionHash", Value.fromBytes(event.transaction.hash));
  entity.set("gasPrice", Value.fromBigInt(event.transaction.gasPrice));
  return entity;
}

export function createEventID(
  eventName: string,
  event: ethereum.Event,
  contractVersion: string
): string {
  return `${eventName}-${event.transaction.hash.toHexString()}-${event.logIndex.toString()}${getContractVersionSuffix(contractVersion)}`;
}
/**
 * getOrder calculate order based on {blockNumber.times(10000).plus(logIndex)}.
 * @param blockNumber
 * @param logIndex
 */
export function getOrder(blockNumber: BigInt, logIndex: BigInt): BigInt {
  return blockNumber.times(ORDER_MULTIPLIER).plus(logIndex);
}

export function getContractVersionSuffix(contractVersion: string): string {
  return contractVersion === "v1" ? "" : `-${contractVersion}`;
}

export const MINUTE = 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;
