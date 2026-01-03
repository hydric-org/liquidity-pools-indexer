import type { handlerContext, Token as TokenEntity } from "generated";

import { EntityId } from "../../core/entity";
import { IndexerNetwork } from "../../core/network";
import { TokenDecimalMath } from "../../lib/math/token/token-decimal-math";
import { processLiquidityChange } from "../liquidity-change-processor";

export async function processV2Sync(params: {
  poolAddress: string;
  network: IndexerNetwork;
  eventTimestamp: bigint;
  context: handlerContext;
  reserve0: bigint;
  reserve1: bigint;
}): Promise<void> {
  let poolEntity = await params.context.Pool.getOrThrow(EntityId.fromAddress(params.network, params.poolAddress));

  let [token0Entity, token1Entity]: [TokenEntity, TokenEntity] = await Promise.all([
    params.context.Token.getOrThrow(poolEntity.token0_id),
    params.context.Token.getOrThrow(poolEntity.token1_id),
  ]);

  const rawOldToken0LockedValue = TokenDecimalMath.decimalToRaw(poolEntity.totalValueLockedToken0, token0Entity);
  const rawOldToken1LockedValue = TokenDecimalMath.decimalToRaw(poolEntity.totalValueLockedToken1, token1Entity);

  const rawReserve0Difference = params.reserve0 - rawOldToken0LockedValue;
  const rawReserve1Difference = params.reserve1 - rawOldToken1LockedValue;

  await processLiquidityChange({
    amount0AddedOrRemoved: rawReserve0Difference,
    amount1AddedOrRemoved: rawReserve1Difference,
    context: params.context,
    eventTimestamp: params.eventTimestamp,
    network: params.network,
    poolAddress: params.poolAddress,
    updateMetrics: false,
  });
}
