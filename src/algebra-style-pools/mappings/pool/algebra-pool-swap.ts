import {
  AlgebraPoolData as AlgebraPoolDataEntity,
  handlerContext,
  Pool as PoolEntity,
  Token as TokenEntity,
} from "generated";
import { sqrtPriceX96toPrice } from "../../../common/cl-pool-converters";
import { safeDiv } from "../../../common/math";
import { getSwapFeesFromRawAmounts, getSwapVolumeFromAmounts } from "../../../common/pool-commons";
import { PoolSetters } from "../../../common/pool-setters";
import { formatFromTokenAmount } from "../../../common/token-commons";
import { calculateAlgebraNonLPFeesAmount } from "../../common/algebra-pool-common";

export async function handleAlgebraPoolSwap(params: {
  context: handlerContext;
  poolEntity: PoolEntity;
  algebraPoolEntity: AlgebraPoolDataEntity;
  token0Entity: TokenEntity;
  token1Entity: TokenEntity;
  swapAmount0: bigint;
  swapAmount1: bigint;
  sqrtPriceX96: bigint;
  overrideSwapFee: number | undefined;
  pluginFee: number;
  tick: bigint;
  eventTimestamp: bigint;
  algebraPoolSetters: PoolSetters;
}): Promise<void> {
  if (params.overrideSwapFee === 0) params.overrideSwapFee = undefined;

  const tokenAmount0Formatted = formatFromTokenAmount(params.swapAmount0, params.token0Entity);
  const tokenAmount1Formatted = formatFromTokenAmount(params.swapAmount1, params.token1Entity);

  const nonLPFeesTokenAmount = calculateAlgebraNonLPFeesAmount({
    swapAmount0: params.swapAmount0,
    swapAmount1: params.swapAmount1,
    communityFee: params.algebraPoolEntity.communityFee,
    poolEntity: params.poolEntity,
    pluginFee: params.pluginFee,
    token0: params.token0Entity,
    token1: params.token1Entity,
    swapFee: params.overrideSwapFee ?? params.poolEntity.currentFeeTier,
  });

  params.poolEntity = {
    ...params.poolEntity,
    totalValueLockedToken0: params.poolEntity.totalValueLockedToken0
      .minus(nonLPFeesTokenAmount.token0FeeAmount)
      .plus(tokenAmount0Formatted),

    totalValueLockedToken1: params.poolEntity.totalValueLockedToken1
      .minus(nonLPFeesTokenAmount.token1FeeAmount)
      .plus(tokenAmount1Formatted),
  };

  [params.token0Entity, params.token1Entity] = await params.algebraPoolSetters.updateTokenPricesFromPoolPrices(
    params.token0Entity,
    params.token1Entity,
    params.poolEntity,
    sqrtPriceX96toPrice(params.sqrtPriceX96, params.token0Entity, params.token1Entity)
  );

  const swapVolumeWithNewPrices = getSwapVolumeFromAmounts(
    tokenAmount0Formatted,
    tokenAmount1Formatted,
    params.token0Entity,
    params.token1Entity
  );

  const updatedPoolTotalValueLockedUSD = params.poolEntity.totalValueLockedToken0
    .times(params.token0Entity.usdPrice)
    .plus(params.poolEntity.totalValueLockedToken1.times(params.token1Entity.usdPrice));

  const updatedToken0TotalTokenPooledAmount = params.token0Entity.totalTokenPooledAmount
    .minus(nonLPFeesTokenAmount.token0FeeAmount)
    .plus(tokenAmount0Formatted);

  const updatedToken1TotalTokenPooledAmount = params.token1Entity.totalTokenPooledAmount
    .minus(nonLPFeesTokenAmount.token1FeeAmount)
    .plus(tokenAmount1Formatted);

  const updatedToken0TotalValuePooledUsd = updatedToken0TotalTokenPooledAmount.times(params.token0Entity.usdPrice);
  const updatedToken1TotalValuePooledUsd = updatedToken1TotalTokenPooledAmount.times(params.token1Entity.usdPrice);

  const swapFees = getSwapFeesFromRawAmounts(
    params.swapAmount0,
    params.swapAmount1,
    params.overrideSwapFee ?? params.poolEntity.currentFeeTier,
    params.token0Entity,
    params.token1Entity
  );

  const swapYield = safeDiv(swapFees.feesUSD, updatedPoolTotalValueLockedUSD).times(100);

  params.algebraPoolEntity = {
    ...params.algebraPoolEntity,
    sqrtPriceX96: params.sqrtPriceX96,
    tick: params.tick,
  };

  params.poolEntity = {
    ...params.poolEntity,
    totalValueLockedUSD: updatedPoolTotalValueLockedUSD,
    currentFeeTier: params.poolEntity.isDynamicFee
      ? params.overrideSwapFee ?? params.poolEntity.currentFeeTier
      : params.poolEntity.currentFeeTier,
    swapVolumeToken0: params.poolEntity.swapVolumeToken0.plus(swapVolumeWithNewPrices.volumeToken0),
    swapVolumeToken1: params.poolEntity.swapVolumeToken1.plus(swapVolumeWithNewPrices.volumeToken1),
    swapVolumeUSD: params.poolEntity.swapVolumeUSD.plus(swapVolumeWithNewPrices.volumeUSD),
    totalAccumulatedYield: params.poolEntity.totalAccumulatedYield.plus(swapYield),
  };

  params.token0Entity = {
    ...params.token0Entity,
    totalTokenPooledAmount: updatedToken0TotalTokenPooledAmount,
    totalValuePooledUsd: updatedToken0TotalValuePooledUsd,
    tokenSwapVolume: params.token0Entity.tokenSwapVolume.plus(swapVolumeWithNewPrices.volumeToken0),
    swapVolumeUSD: params.token0Entity.swapVolumeUSD.plus(swapVolumeWithNewPrices.volumeToken0USD),
  };

  params.token1Entity = {
    ...params.token1Entity,
    totalTokenPooledAmount: updatedToken1TotalTokenPooledAmount,
    totalValuePooledUsd: updatedToken1TotalValuePooledUsd,
    tokenSwapVolume: params.token1Entity.tokenSwapVolume.plus(swapVolumeWithNewPrices.volumeToken1),
    swapVolumeUSD: params.token1Entity.swapVolumeUSD.plus(swapVolumeWithNewPrices.volumeToken1USD),
  };

  await params.algebraPoolSetters.setIntervalSwapData(
    params.eventTimestamp,
    params.context,
    params.poolEntity,
    params.token0Entity,
    params.token1Entity,
    params.swapAmount0,
    params.swapAmount1,
    params.overrideSwapFee
  );

  params.poolEntity = await params.algebraPoolSetters.updatePoolTimeframedAccumulatedYield(
    params.eventTimestamp,
    params.poolEntity
  );

  params.context.Pool.set(params.poolEntity);
  params.context.Token.set(params.token0Entity);
  params.context.Token.set(params.token1Entity);
  params.context.AlgebraPoolData.set(params.algebraPoolEntity);
}
