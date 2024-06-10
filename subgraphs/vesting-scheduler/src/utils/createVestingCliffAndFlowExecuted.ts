import { log } from "@graphprotocol/graph-ts";
import { VestingCliffAndFlowExecutedEvent } from "../types/schema";
import { VestingCliffAndFlowExecuted } from "../types/VestingScheduler/VestingScheduler";
import { createEventID, setBaseProperties } from "./general";

export function createVestingCliffAndFlowExecutedEntity(
  event: VestingCliffAndFlowExecuted,
  contractVersion: string
): VestingCliffAndFlowExecutedEvent {
  let ev = new VestingCliffAndFlowExecutedEvent(
    createEventID("VestingCliffAndFlowExecuted", event, contractVersion)
  );

  ev = setBaseProperties("VestingCliffAndFlowExecutedEvent", event, ev, [
    event.params.sender,
    event.params.receiver,
  ]) as VestingCliffAndFlowExecutedEvent;

  ev.superToken = event.params.superToken;
  ev.sender = event.params.sender;
  ev.receiver = event.params.receiver;
  ev.cliffAndFlowDate = event.params.cliffAndFlowDate;
  ev.flowRate = event.params.flowRate;
  ev.cliffAmount = event.params.cliffAmount;
  ev.flowDelayCompensation = event.params.flowDelayCompensation;

  const receipt = event.receipt;
  if (receipt) {
    ev.gasUsed = receipt.gasUsed;
  } else {
      log.critical("receipt MUST NOT be null, set `receipt: true` under `eventHandlers` in the manifest file", []);
  }

  return ev;
}
