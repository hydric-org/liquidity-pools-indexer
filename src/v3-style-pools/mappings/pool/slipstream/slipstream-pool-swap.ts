import { Pool as PoolEntity, SlipstreamPool, Token as TokenEntity, V3PoolData as V3PoolDataEntity } from "generated";
import { IndexerNetwork } from "../../../../common/enums/indexer-network";
import { PoolSetters } from "../../../../common/pool-setters";
import { handleV3PoolSwap } from "../v3-pool-swap";
import { SlipsteamEffects } from "./common/slipstream-effects";

SlipstreamPool.Swap.handler(async ({ event, context }) => {
  const poolId = IndexerNetwork.getEntityIdFromAddress(event.chainId, event.srcAddress);

  const [poolEntity, v3PoolEntity]: [PoolEntity, V3PoolDataEntity] = await Promise.all([
    context.Pool.getOrThrow(poolId),
    context.V3PoolData.getOrThrow(poolId),
  ]);

  const [token0Entity, token1Entity]: [TokenEntity, TokenEntity] = await Promise.all([
    context.Token.getOrThrow(poolEntity.token0_id),
    context.Token.getOrThrow(poolEntity.token1_id),
  ]);

  const swapFee = await context.effect(SlipsteamEffects.swapFeeEffect, {
    chainId: event.chainId,
    poolAddress: event.srcAddress,
  });

  await handleV3PoolSwap({
    context,
    poolEntity,
    v3PoolEntity,
    token0Entity,
    token1Entity,
    swapAmount0: event.params.amount0,
    swapAmount1: event.params.amount1,
    sqrtPriceX96: event.params.sqrtPriceX96,
    tick: BigInt(event.params.tick),
    eventTimestamp: BigInt(event.block.timestamp),
    v3PoolSetters: new PoolSetters(context, event.chainId),
    newFeeTier: swapFee,
  });
});
