import { Bytes } from "@graphprotocol/graph-ts";
import { UserTokenLiquidityToken } from "../types/schema";


export function getOrCreateUserTokenLiquidityTokenCursor(
  wrapScheduleId: Bytes
): UserTokenLiquidityToken {
  let tokenStrategyCursor = UserTokenLiquidityToken.load(wrapScheduleId.toHexString());

  if (!tokenStrategyCursor) {
    return createUserTokenLiquidityTokenCursor(wrapScheduleId);
  }

  return tokenStrategyCursor;
}

export function createUserTokenLiquidityTokenCursor(
  wrapScheduleId: Bytes
): UserTokenLiquidityToken {

  return new UserTokenLiquidityToken(wrapScheduleId.toHexString());
}
