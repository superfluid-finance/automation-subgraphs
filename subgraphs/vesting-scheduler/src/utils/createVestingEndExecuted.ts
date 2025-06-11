import { log } from "@graphprotocol/graph-ts";
import { VestingEndExecutedEvent } from "../types/schema";
import { VestingEndExecuted } from "../types/VestingScheduler/VestingScheduler";
import { createEventID, setBaseProperties } from "./general";

export function createVestingEndExecutedEventEntity(
  event: VestingEndExecuted,
  contractVersion: string
): VestingEndExecutedEvent {
  let ev = new VestingEndExecutedEvent(
    createEventID("VestingEndExecuted", event, contractVersion)
  );

  ev = setBaseProperties("VestingEndExecutedEvent", event, ev, [
    event.params.sender,
    event.params.receiver,
    event.params.superToken,
  ]) as VestingEndExecutedEvent;

  ev.superToken = event.params.superToken;
  ev.sender = event.params.sender;
  ev.receiver = event.params.receiver;
  ev.endDate = event.params.endDate;
  ev.earlyEndCompensation = event.params.earlyEndCompensation;
  ev.didCompensationFail = event.params.didCompensationFail;

  const receipt = event.receipt;
  if (receipt) {
    ev.gasUsed = receipt.gasUsed;
  } else {
      log.critical("receipt MUST NOT be null, set `receipt: true` under `eventHandlers` in the manifest file", []);
  }

  return ev;
}
