import {
    BigInt
} from "@graphprotocol/graph-ts";

// Note: This will work for V3 only on creation.
export function calculateTotalVestedAmount_v1_v2(
    cliffAndFlowDate: BigInt,
    endDate: BigInt,
    flowRate: BigInt,
    cliffAmount: BigInt,
    remainderAmount: BigInt
): BigInt {
    const vestingDuration = endDate.minus(cliffAndFlowDate);
    const vestedAfterCliff = vestingDuration.times(flowRate);

    return cliffAmount.plus(remainderAmount).plus(vestedAfterCliff);
}