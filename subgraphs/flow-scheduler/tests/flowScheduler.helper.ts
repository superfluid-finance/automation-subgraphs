import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as";
import {
  CreateFlowExecuted,
  DeleteFlowExecuted,
  FlowScheduleCreated,
  FlowScheduleDeleted,
} from "../src/types/FlowScheduler/FlowScheduler";
import {
  getAddressEventParam,
  getBigIntEventParam,
  getBytesEventParam,
} from "./converters";

export function createNewFlowScheduleCreatedEvent(
  superToken: string,
  sender: string,
  receiver: string,
  startDate: BigInt,
  startDateMaxDelay: BigInt,
  flowRate: BigInt,
  endDate: BigInt,
  startAmount: BigInt,
  userData: Bytes
): FlowScheduleCreated {
  const event = changetype<FlowScheduleCreated>(newMockEvent());
  event.parameters = new Array();
  event.parameters.push(getAddressEventParam("superToken", superToken));
  event.parameters.push(getAddressEventParam("sender", sender));
  event.parameters.push(getAddressEventParam("receiver", receiver));
  event.parameters.push(getBigIntEventParam("startDate", startDate));
  event.parameters.push(
    getBigIntEventParam("startDateMaxDelay", startDateMaxDelay)
  );
  event.parameters.push(getBigIntEventParam("flowRate", flowRate));
  event.parameters.push(getBigIntEventParam("endDate", endDate));
  event.parameters.push(getBigIntEventParam("startAmount", startAmount));
  event.parameters.push(getBytesEventParam("userData", userData));

  return event;
}

export function createNewFlowScheduleDeletedEvent(
  superToken: string,
  sender: string,
  receiver: string
): FlowScheduleDeleted {
  const event = changetype<FlowScheduleDeleted>(newMockEvent());
  event.parameters = new Array();
  event.parameters.push(getAddressEventParam("superToken", superToken));
  event.parameters.push(getAddressEventParam("sender", sender));
  event.parameters.push(getAddressEventParam("receiver", receiver));

  return event;
}

export function createNewCreateFlowExecutedEvent(
  superToken: string,
  sender: string,
  receiver: string,
  startDate: BigInt,
  startDateMaxDelay: BigInt,
  flowRate: BigInt,
  startAmount: BigInt,
  userData: Bytes
): CreateFlowExecuted {
  const event = changetype<CreateFlowExecuted>(newMockEvent());
  event.parameters = new Array();
  event.parameters.push(getAddressEventParam("superToken", superToken));
  event.parameters.push(getAddressEventParam("sender", sender));
  event.parameters.push(getAddressEventParam("receiver", receiver));
  event.parameters.push(getBigIntEventParam("startDate", startDate));
  event.parameters.push(
    getBigIntEventParam("startDateMaxDelay", startDateMaxDelay)
  );

  event.parameters.push(getBigIntEventParam("flowRate", flowRate));
  event.parameters.push(getBigIntEventParam("startAmount", startAmount));
  event.parameters.push(getBytesEventParam("userData", userData));

  return event;
}

export function createNewDeleteFlowExecutedEvent(
  superToken: string,
  sender: string,
  receiver: string,
  endDate: BigInt,
  userData: Bytes
): DeleteFlowExecuted {
  const event = changetype<DeleteFlowExecuted>(newMockEvent());
  event.parameters = new Array();
  event.parameters.push(getAddressEventParam("superToken", superToken));
  event.parameters.push(getAddressEventParam("sender", sender));
  event.parameters.push(getAddressEventParam("receiver", receiver));
  event.parameters.push(getBigIntEventParam("endDate", endDate));
  event.parameters.push(getBytesEventParam("userData", userData));

  return event;
}
