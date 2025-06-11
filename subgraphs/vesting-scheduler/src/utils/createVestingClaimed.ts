import { VestingClaimedEvent, } from "../types/schema";
import { createEventID, setBaseProperties } from "./general";
import { VestingClaimed } from "../types/VestingScheduler_v2/VestingScheduler";

export function createVestingClaimedEventEntity(
  event: VestingClaimed,
  contractVersion: string
): VestingClaimedEvent {
  let ev = new VestingClaimedEvent(
    createEventID("VestingClaimed", event, contractVersion)
  );

  ev = setBaseProperties("VestingClaimedEvent", event, ev, [
    event.params.sender,
    event.params.receiver,
    event.params.superToken,
  ]) as VestingClaimedEvent;

  ev.superToken = event.params.superToken;
  ev.sender = event.params.sender;
  ev.receiver = event.params.receiver;
  ev.claimer = event.params.claimer;

  return ev;
}
