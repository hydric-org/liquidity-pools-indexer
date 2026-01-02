import { Pool as PoolEntity, SlipstreamPoolData, Token as TokenEntity } from "generated";
import { HandlerContext } from "generated/src/Types";
import { EntityId } from "../../core/entity";
import { IndexerNetwork } from "../../core/network";
import { ConcentratedSqrtPriceMath } from "../../lib/math/concentrated-liquidity/concentrated-sqrt-price-math";
import { daysBetweenSecondsTimestamps } from "../../lib/timestamp";
import { processSwap } from "../swap-processor";
import { SlipsteamEffects } from "./utils/slipstream-effects";

export async function processSlipstreamSwap(params: {
  context: HandlerContext;
  network: IndexerNetwork;
  poolAddress: string;
  eventTimestamp: bigint;
  sqrtPriceX96: bigint;
  tick: bigint;
  amount0: bigint;
  amount1: bigint;
}) {
  const poolId = EntityId.fromAddress(params.network, params.poolAddress);

  let [poolEntity, slipstreamPoolData]: [PoolEntity, SlipstreamPoolData] = await Promise.all([
    params.context.Pool.getOrThrow(poolId),
    params.context.SlipstreamPoolData.getOrThrow(poolId),
  ]);

  const [token0Entity, token1Entity]: [TokenEntity, TokenEntity] = await Promise.all([
    params.context.Token.getOrThrow(poolEntity.token0_id),
    params.context.Token.getOrThrow(poolEntity.token1_id),
  ]);

  let swapFee = poolEntity.currentFeeTier;

  const shouldAdjustSwapFee =
    daysBetweenSecondsTimestamps(params.eventTimestamp, slipstreamPoolData.lastFeeAdjustmentTimestamp) > 1;

  /// We do this now because it's too expensive to do on every swap, but should be get in every swap to maximize accuracy
  if (shouldAdjustSwapFee) {
    swapFee = await params.context.effect(SlipsteamEffects.swapFeeEffect, {
      chainId: params.network,
      poolAddress: params.poolAddress,
    });

    slipstreamPoolData = {
      ...slipstreamPoolData,
      lastFeeAdjustmentTimestamp: params.eventTimestamp,
    };

    params.context.Pool.set({
      ...poolEntity,
      currentFeeTier: swapFee,
    });
  }

  params.context.SlipstreamPoolData.set({
    ...slipstreamPoolData,
    sqrtPriceX96: params.sqrtPriceX96,
    tick: params.tick,
  });

  await processSwap({
    context: params.context,
    poolAddress: params.poolAddress,
    network: params.network,
    amount0: params.amount0,
    amount1: params.amount1,
    eventTimestamp: params.eventTimestamp,
    swapFee: swapFee,
    newPoolPrices: ConcentratedSqrtPriceMath.convertSqrtPriceX96ToPoolPrices({
      poolToken0: token0Entity,
      poolToken1: token1Entity,
      sqrtPriceX96: params.sqrtPriceX96,
    }),
  });
}
