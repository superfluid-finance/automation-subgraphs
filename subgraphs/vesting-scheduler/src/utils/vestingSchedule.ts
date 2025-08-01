import { Address, BigInt } from "@graphprotocol/graph-ts";
import { VestingScheduler } from "../types/VestingScheduler/VestingScheduler";
import {
  TokenSenderReceiverCursor,
  VestingSchedule,
  VestingScheduleCreatedEvent,
} from "./../types/schema";
import { getContractVersionSuffix } from "./general";
import { calculateTotalVestedAmount_v1_v2 } from "./calculateTotalVestedAmount";

export function createVestingSchedule(
  ev: VestingScheduleCreatedEvent,
  scheduler: Address,
  contractVersion: string
): VestingSchedule {
  const vestingScheduler = VestingScheduler.bind(scheduler);
  const endValidBeforeSeconds = vestingScheduler.END_DATE_VALID_BEFORE();
  const startValidAfterSeconds = vestingScheduler.START_DATE_VALID_AFTER();

  const id = `${ev.transactionHash.toHexString()}-${ev.logIndex}${getContractVersionSuffix(contractVersion)}`;
  let vestingSchedule = new VestingSchedule(id);

  vestingSchedule.contractVersion = contractVersion;
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

  vestingSchedule.claimValidityDate = ev.claimValidityDate;
  vestingSchedule.remainderAmount = ev.remainderAmount;

  vestingSchedule.totalAmount = calculateTotalVestedAmount_v1_v2(
    vestingSchedule.cliffAndFlowDate,
    vestingSchedule.endDate,
    vestingSchedule.flowRate,
    vestingSchedule.cliffAmount,
    vestingSchedule.remainderAmount
  );

  vestingSchedule.settledAmount = BigInt.zero();
  vestingSchedule.settledAt = BigInt.zero();

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
