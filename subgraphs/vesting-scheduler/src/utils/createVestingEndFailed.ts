import { log } from "@graphprotocol/graph-ts";
import { VestingEndFailedEvent } from "../types/schema";
import { VestingEndFailed } from "../types/VestingScheduler/VestingScheduler";
import { createEventID, setBaseProperties } from "./general";

export function createVestingEndFailedEventEntity(
  event: VestingEndFailed,
  contractVersion: string
): VestingEndFailedEvent {
  let ev = new VestingEndFailedEvent(
    createEventID("VestingEndFailed", event, contractVersion)
  );

  ev = setBaseProperties("VestingEndFailedEvent", event, ev, [
    event.params.sender,
    event.params.receiver,
  ]) as VestingEndFailedEvent;

  ev.superToken = event.params.superToken;
  ev.sender = event.params.sender;
  ev.receiver = event.params.receiver;
  ev.endDate = event.params.endDate;

  const receipt = event.receipt;
  if (receipt) {
    ev.gasUsed = receipt.gasUsed;
  } else {
      log.critical("receipt MUST NOT be null, set `receipt: true` under `eventHandlers` in the manifest file", []);
  }

  return ev;
}
