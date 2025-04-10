import { BigInt } from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as";
import {
  VestingCliffAndFlowExecuted,
  VestingEndExecuted,
  VestingEndFailed,
  VestingScheduleCreated,
  VestingScheduleDeleted,
  VestingScheduleUpdated,
} from "../src/types/VestingScheduler/VestingScheduler";
import {
  VestingClaimed
} from "../src/types/VestingScheduler_v2/VestingScheduler";
import {
  getAddressEventParam,
  getBigIntEventParam,
  getBooleanEventParam,
} from "./converters";

export function createNewCreateVestingScheduleEvent(
  superToken: string,
  sender: string,
  receiver: string,
  startDate: BigInt,
  cliffDate: BigInt,
  flowRate: BigInt,
  endDate: BigInt,
  cliffAmount: BigInt,
  // claimValidityDate: BigInt = BigInt.fromI32(0),
  // remainderAmount: BigInt = BigInt.fromI32(0)
): VestingScheduleCreated {
  const event = changetype<VestingScheduleCreated>(newMockEvent());
  event.parameters = new Array();
  event.parameters.push(getAddressEventParam("superToken", superToken));
  event.parameters.push(getAddressEventParam("sender", sender));
  event.parameters.push(getAddressEventParam("receiver", receiver));
  event.parameters.push(getBigIntEventParam("startDate", startDate));
  event.parameters.push(getBigIntEventParam("cliffDate", cliffDate));
  event.parameters.push(getBigIntEventParam("flowRate", flowRate));
  event.parameters.push(getBigIntEventParam("cliffAmount", cliffAmount));
  event.parameters.push(getBigIntEventParam("endDate", endDate));
  // event.parameters.push(getBigIntEventParam("claimValidityDate", claimValidityDate));
  // event.parameters.push(getBigIntEventParam("remainderAmount", remainderAmount));

  return event;
}

export function createNewDeleteVestingScheduleEvent(
  superToken: string,
  sender: string,
  receiver: string
): VestingScheduleDeleted {
  const event = changetype<VestingScheduleDeleted>(newMockEvent());
  event.parameters = new Array();
  event.parameters.push(getAddressEventParam("superToken", superToken));
  event.parameters.push(getAddressEventParam("sender", sender));
  event.parameters.push(getAddressEventParam("receiver", receiver));

  return event;
}

export function createNewVestingEndExecutedEvent(
  superToken: string,
  sender: string,
  receiver: string,
  endDate: BigInt,
  earlyEndCompensation: BigInt,
  didCompensationFail: boolean
): VestingEndExecuted {
  const event = changetype<VestingEndExecuted>(newMockEvent());
  event.parameters = new Array();
  event.parameters.push(getAddressEventParam("superToken", superToken));
  event.parameters.push(getAddressEventParam("sender", sender));
  event.parameters.push(getAddressEventParam("receiver", receiver));
  event.parameters.push(getBigIntEventParam("endDate", endDate));
  event.parameters.push(
    getBigIntEventParam("earlyEndCompensation", earlyEndCompensation)
  );
  event.parameters.push(
    getBooleanEventParam("didCompensationFail", didCompensationFail)
  );

  return event;
}

export function createNewVestingEndFailedEvent(
  superToken: string,
  sender: string,
  receiver: string,
  endDate: BigInt
): VestingEndFailed {
  const event = changetype<VestingEndFailed>(newMockEvent());
  event.parameters = new Array();
  event.parameters.push(getAddressEventParam("superToken", superToken));
  event.parameters.push(getAddressEventParam("sender", sender));
  event.parameters.push(getAddressEventParam("receiver", receiver));
  event.parameters.push(getBigIntEventParam("endDate", endDate));

  return event;
}

export function createNewVestingCliffAndFlowExecutedEvent(
  superToken: string,
  sender: string,
  receiver: string,
  cliffAndFlowDate: BigInt,
  flowRate: BigInt,
  cliffAmount: BigInt,
  flowDelayCompensation: BigInt
): VestingCliffAndFlowExecuted {
  const event = changetype<VestingCliffAndFlowExecuted>(newMockEvent());
  event.parameters = new Array();
  event.parameters.push(getAddressEventParam("superToken", superToken));
  event.parameters.push(getAddressEventParam("sender", sender));
  event.parameters.push(getAddressEventParam("receiver", receiver));
  event.parameters.push(
    getBigIntEventParam("cliffAndFlowDate", cliffAndFlowDate)
  );
  event.parameters.push(getBigIntEventParam("flowRate", flowRate));
  event.parameters.push(getBigIntEventParam("cliffAmount", cliffAmount));
  event.parameters.push(
    getBigIntEventParam("flowDelayCompensation", flowDelayCompensation)
  );

  return event;
}

export function createNewVestingScheduleUpdatedEvent(
  superToken: string,
  sender: string,
  receiver: string,
  oldEndDate: BigInt,
  endDate: BigInt,
  // remainderAmount: BigInt
): VestingScheduleUpdated {
  const event = changetype<VestingScheduleUpdated>(newMockEvent());
  event.parameters = new Array();
  event.parameters.push(getAddressEventParam("superToken", superToken));
  event.parameters.push(getAddressEventParam("sender", sender));
  event.parameters.push(getAddressEventParam("receiver", receiver));
  event.parameters.push(getBigIntEventParam("oldEndDate", oldEndDate));
  event.parameters.push(getBigIntEventParam("endDate", endDate));
  // event.parameters.push(getBigIntEventParam("remainderAmount", remainderAmount));

  return event;
}

export function createNewVestingClaimedEvent(
  superToken: string,
  sender: string,
  receiver: string,
  claimer: string
): VestingClaimed {
  const event = changetype<VestingClaimed>(newMockEvent());
  event.parameters = new Array();
  event.parameters.push(getAddressEventParam("superToken", superToken));
  event.parameters.push(getAddressEventParam("sender", sender));
  event.parameters.push(getAddressEventParam("receiver", receiver));
  event.parameters.push(getAddressEventParam("claimer", claimer));

  return event;
}