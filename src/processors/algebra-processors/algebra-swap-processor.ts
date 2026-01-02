import {
  AlgebraPoolData as AlgebraPoolDataEntity,
  handlerContext,
  Pool as PoolEntity,
  Token as TokenEntity,
} from "generated";
import { EntityId } from "../../core/entity";
import { IndexerNetwork } from "../../core/network";
import { ConcentratedSqrtPriceMath } from "../../lib/math/concentrated-liquidity/concentrated-sqrt-price-math";
import { processSwap } from "../swap-processor";
import { AlgebraMath } from "./utils/algebra-math";

export async function processAlgebraSwap(params: {
  context: handlerContext;
  poolAddress: string;
  network: IndexerNetwork;
  eventTimestamp: bigint;
  swapAmount0: bigint;
  swapAmount1: bigint;
  sqrtPriceX96: bigint;
  overrideSwapFee: number | undefined;
  pluginFee: number;
  tick: bigint;
}): Promise<void> {
  if (params.overrideSwapFee === 0) params.overrideSwapFee = undefined;
  const poolId = EntityId.fromAddress(params.network, params.poolAddress);

  const [poolEntity, algebraPoolData]: [PoolEntity, AlgebraPoolDataEntity] = await Promise.all([
    params.context.Pool.getOrThrow(poolId),
    params.context.AlgebraPoolData.getOrThrow(poolId),
  ]);

  const [token0Entity, token1Entity]: [TokenEntity, TokenEntity] = await Promise.all([
    params.context.Token.getOrThrow(poolEntity.token0_id),
    params.context.Token.getOrThrow(poolEntity.token1_id),
  ]);

  const nonLPFeesTokenAmount = AlgebraMath.calculateAlgebraNonLPFeesAmount({
    swapAmount0: params.swapAmount0,
    swapAmount1: params.swapAmount1,
    communityFee: algebraPoolData.communityFee,
    poolEntity: poolEntity,
    pluginFee: params.pluginFee,
    token0: token0Entity,
    token1: token1Entity,
    swapFee: params.overrideSwapFee ?? poolEntity.currentFeeTier,
  });

  params.context.Pool.set({
    ...poolEntity,
    totalValueLockedToken0: poolEntity.totalValueLockedToken0.minus(nonLPFeesTokenAmount.token0FeeAmount),
    totalValueLockedToken1: poolEntity.totalValueLockedToken1.minus(nonLPFeesTokenAmount.token1FeeAmount),
    currentFeeTier: poolEntity.isDynamicFee
      ? params.overrideSwapFee ?? poolEntity.currentFeeTier
      : poolEntity.currentFeeTier,
  });

  params.context.Token.set({
    ...token0Entity,
    tokenTotalValuePooled: token0Entity.tokenTotalValuePooled.minus(nonLPFeesTokenAmount.token0FeeAmount),
  });

  params.context.Token.set({
    ...token1Entity,
    tokenTotalValuePooled: token1Entity.tokenTotalValuePooled.minus(nonLPFeesTokenAmount.token1FeeAmount),
  });

  params.context.AlgebraPoolData.set({
    ...algebraPoolData,
    sqrtPriceX96: params.sqrtPriceX96,
    tick: params.tick,
  });

  await processSwap({
    context: params.context,
    poolAddress: params.poolAddress,
    network: params.network,
    eventTimestamp: params.eventTimestamp,
    amount0: params.swapAmount0,
    amount1: params.swapAmount1,
    swapFee: params.overrideSwapFee ?? poolEntity.currentFeeTier,
    newPoolPrices: ConcentratedSqrtPriceMath.convertSqrtPriceX96ToPoolPrices({
      poolToken0: token0Entity,
      poolToken1: token1Entity,
      sqrtPriceX96: params.sqrtPriceX96,
    }),
  });
}
