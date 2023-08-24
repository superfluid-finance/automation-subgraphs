import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  UserTokenLiquidityToken,
  WrapSchedule,
  WrapScheduleCreatedEvent,
} from "../types/schema";
import { WrapManager } from "../types/WrapScheduler/WrapManager";


const getWrapScheduleId = (transactionHash: Bytes, logIndex: BigInt): string => `${transactionHash.toHexString()}-${logIndex.toString()}`;

export function createWrapSchedule(
  ev: WrapScheduleCreatedEvent,
  account: Address
): WrapSchedule {
  const wrapScheduler = WrapManager.bind(account);

  const id = getWrapScheduleId(ev.transactionHash, ev.logIndex);

  let wrapSchedule = new WrapSchedule(id);
  wrapSchedule.createdAt = ev.timestamp;
  wrapSchedule.createdBlockNumber = ev.blockNumber;
  wrapSchedule.updatedAt = ev.timestamp;
  wrapSchedule.updatedBlockNumber  = ev.blockNumber;
  wrapSchedule.isActive = true;
  wrapSchedule.deletedAt = null;
  wrapSchedule.lastExecutedAt = null;
  wrapSchedule.liquidityToken = ev.liquidityToken;
  wrapSchedule.strategy = ev.strategy;
  wrapSchedule.manager = account;
  wrapSchedule.superToken = ev.superToken;
  wrapSchedule.account = ev.account;
  wrapSchedule.expiredAt = ev.expiry != BigInt.zero() ? ev.expiry : null;
  wrapSchedule.lowerLimit = ev.lowerLimit ? ev.lowerLimit : wrapScheduler.minLower();
  wrapSchedule.upperLimit = ev.upperLimit ? ev.upperLimit : wrapScheduler.minUpper();
  wrapSchedule.amount = BigInt.zero();
  wrapSchedule.events = [ev.id];
  wrapSchedule.wrapScheduleId = ev.wrapScheduleId;
  return wrapSchedule;
}

export function getWrapSchedule(
  cursor: UserTokenLiquidityToken | null
): WrapSchedule | null {

  if (!cursor || !cursor.currentWrapSchedule) {
    return null;
  }

  let wrapSchedule = WrapSchedule.load(cursor.currentWrapSchedule!);
  return wrapSchedule;
}
