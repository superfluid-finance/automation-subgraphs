import { Address, BigInt } from "@graphprotocol/graph-ts";
import { VestingScheduler } from "../types/VestingScheduler/VestingScheduler";
import {
  TokenSenderReceiverCursor,
  VestingSchedule,
  VestingScheduleCreatedEvent,
} from "./../types/schema";

export function createVestingSchedule(
  ev: VestingScheduleCreatedEvent,
  scheduler: Address
): VestingSchedule {
  const vestingScheduler = VestingScheduler.bind(scheduler);
  const startValidAfterSeconds = vestingScheduler.START_DATE_VALID_AFTER();
  const endValidBeforeSeconds = vestingScheduler.END_DATE_VALID_BEFORE();

  const id = `${ev.transactionHash.toHexString()}-${ev.logIndex}`;
  let vestingSchedule = new VestingSchedule(id);

  vestingSchedule.createdAt = ev.timestamp;
  vestingSchedule.superToken = ev.superToken;
  vestingSchedule.sender = ev.sender;
  vestingSchedule.receiver = ev.receiver;
  vestingSchedule.startDate = ev.startDate;
  vestingSchedule.endDate = ev.endDate;
  vestingSchedule.cliffDate =
    ev.cliffDate != BigInt.zero() ? ev.cliffDate : null;
  vestingSchedule.cliffAndFlowDate =
    ev.cliffDate != BigInt.zero() ? ev.cliffDate : ev.startDate;
  vestingSchedule.cliffAmount = ev.cliffAmount;
  vestingSchedule.flowRate = ev.flowRate;
  vestingSchedule.cliffAndFlowExpirationAt =
    vestingSchedule.cliffAndFlowDate.plus(startValidAfterSeconds);
  vestingSchedule.endDateValidAt = ev.endDate.minus(endValidBeforeSeconds);
  vestingSchedule.events = [ev.id];

  return vestingSchedule;
}

export function getVestingSchedule(
  cursor: TokenSenderReceiverCursor | null
): VestingSchedule | null {
  if (cursor && cursor.currentVestingSchedule) {
    let vestingSchedule = VestingSchedule.load(cursor.currentVestingSchedule!);
    return vestingSchedule;
  }

  return null;
}
