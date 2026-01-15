import type { Block_t, HandlerContext, Pool as PoolEntity, SlipstreamPoolData, Token as TokenEntity } from "generated";
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
  eventBlock: Block_t;
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

  let rawSwapFee = poolEntity.rawCurrentFeeTier;

  const shouldAdjustSwapFee =
    daysBetweenSecondsTimestamps(BigInt(params.eventBlock.timestamp), slipstreamPoolData.lastFeeAdjustmentTimestamp) >
    1;

  /// We do this now because it's too expensive to do on every swap, but should be get in every swap to maximize accuracy
  if (shouldAdjustSwapFee) {
    rawSwapFee = await params.context.effect(SlipsteamEffects.swapFeeEffect, {
      chainId: params.network,
      poolAddress: params.poolAddress,
    });

    slipstreamPoolData = {
      ...slipstreamPoolData,
      lastFeeAdjustmentTimestamp: BigInt(params.eventBlock.timestamp),
    };

    params.context.Pool.set({
      ...poolEntity,
      rawCurrentFeeTier: rawSwapFee,
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
    eventBlock: params.eventBlock,
    rawSwapFee: rawSwapFee,
    newPoolPrices: ConcentratedSqrtPriceMath.convertSqrtPriceX96ToPoolPrices({
      poolToken0: token0Entity,
      poolToken1: token1Entity,
      sqrtPriceX96: params.sqrtPriceX96,
    }),
  });
}
