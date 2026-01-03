import type {
  PoolHistoricalData as PoolHistoricalDataEntity,
  PoolTimeframedStats as PoolTimeframedStatsEntity,
  Token as TokenEntity,
} from "generated";
import type { HandlerContext } from "generated/src/Types";
import { STATS_TIMEFRAME_IN_DAYS } from "../core/constants";
import { EntityId } from "../core/entity";
import { IndexerNetwork } from "../core/network";
import type { PoolPrices } from "../core/types";
import {
  calculateNewLockedAmounts,
  calculateSwapFees,
  calculateSwapVolume,
  calculateSwapYield,
  YieldMath,
} from "../lib/math";
import { TokenDecimalMath } from "../lib/math/token/token-decimal-math";
import { PriceDiscover } from "../lib/pricing/token-pricing";
import { DatabaseService } from "../services/database-service";
import { processPoolTimeframedStatsUpdate } from "./pool-timeframed-stats-update-processor";

export async function processSwap(params: {
  context: HandlerContext;
  poolAddress: string;
  network: IndexerNetwork;
  amount0: bigint;
  amount1: bigint;
  eventTimestamp: bigint;
  newPoolPrices: PoolPrices;
  swapFee: number;
}) {
  let poolEntity = await params.context.Pool.getOrThrow(EntityId.fromAddress(params.network, params.poolAddress));

  let [token0Entity, token1Entity, statsEntities, poolHistoricalDataEntities]: [
    TokenEntity,
    TokenEntity,
    PoolTimeframedStatsEntity[],
    PoolHistoricalDataEntity[]
  ] = await Promise.all([
    params.context.Token.getOrThrow(poolEntity.token0_id),
    params.context.Token.getOrThrow(poolEntity.token1_id),
    DatabaseService.getAllPooltimeframedStatsEntities(params.context, poolEntity),
    DatabaseService.getOrCreateHistoricalPoolDataEntities({
      context: params.context,
      eventTimestamp: params.eventTimestamp,
      pool: poolEntity,
    }),
  ]);

  const { token0MarketUsdPrice, token1MarketUsdPrice } = PriceDiscover.discoverTokenUsdMarketPrices({
    network: params.network,
    poolToken0Entity: token0Entity,
    poolToken1Entity: token1Entity,
    newPoolPrices: params.newPoolPrices,
    rawSwapAmount0: params.amount0,
    rawSwapAmount1: params.amount1,
    pool: poolEntity,
  });

  poolEntity = {
    ...poolEntity,
    tokens0PerToken1: params.newPoolPrices.tokens0PerToken1,
    tokens1PerToken0: params.newPoolPrices.tokens1PerToken0,
  };

  token0Entity = {
    ...token0Entity,
    usdPrice: token0MarketUsdPrice,
    swapsInCount: params.amount0 > 0 ? token0Entity.swapsInCount + 1 : token0Entity.swapsInCount,
    swapsOutCount: params.amount0 < 0 ? token0Entity.swapsOutCount + 1 : token0Entity.swapsOutCount,
    swapsCount: token0Entity.swapsCount + 1,
  };

  token1Entity = {
    ...token1Entity,
    usdPrice: token1MarketUsdPrice,
    swapsInCount: params.amount1 > 0 ? token1Entity.swapsInCount + 1 : token1Entity.swapsInCount,
    swapsOutCount: params.amount1 < 0 ? token1Entity.swapsOutCount + 1 : token1Entity.swapsOutCount,
    swapsCount: token1Entity.swapsCount + 1,
  };

  const amount0Formatted = TokenDecimalMath.rawToDecimal(params.amount0, token0Entity);
  const amount1Formatted = TokenDecimalMath.rawToDecimal(params.amount1, token1Entity);

  const newLockedAmounts = calculateNewLockedAmounts({
    amount0AddedOrRemoved: params.amount0,
    amount1AddedOrRemoved: params.amount1,
    poolEntity: poolEntity,
    token0: token0Entity,
    token1: token1Entity,
  });

  const swapVolume = calculateSwapVolume({
    swapAmount0: amount0Formatted,
    swapAmount1: amount1Formatted,
    poolEntity: poolEntity,
    token0: token0Entity,
    token1: token1Entity,
  });

  const swapFees = calculateSwapFees({
    rawSwapAmount0: params.amount0,
    rawSwapAmount1: params.amount1,
    rawSwapFee: params.swapFee,
    token0: token0Entity,
    token1: token1Entity,
    poolEntity: poolEntity,
  });

  const swapYield = calculateSwapYield({
    swapFeesUsd: swapFees.feesUSD,
    poolTotalValueLockedUsd: newLockedAmounts.newPoolTotalValueLockedUSD,
  });

  poolEntity = {
    ...poolEntity,
    swapVolumeToken0: poolEntity.swapVolumeToken0.plus(swapVolume.volumeToken0),
    swapVolumeToken0Usd: poolEntity.swapVolumeToken0Usd.plus(swapVolume.volumeToken0USD),
    swapVolumeToken1: poolEntity.swapVolumeToken1.plus(swapVolume.volumeToken1),
    swapVolumeToken1Usd: poolEntity.swapVolumeToken1Usd.plus(swapVolume.volumeToken1USD),
    swapVolumeUsd: poolEntity.swapVolumeUsd.plus(swapVolume.volumeUSD),
    feesToken0: poolEntity.feesToken0.plus(swapFees.feesToken0),
    feesToken1: poolEntity.feesToken1.plus(swapFees.feesToken1),
    feesUsd: poolEntity.feesUsd.plus(swapFees.feesUSD),
    totalValueLockedToken0: newLockedAmounts.newPoolTotalValueLockedToken0,
    totalValueLockedToken1: newLockedAmounts.newPoolTotalValueLockedToken1,
    totalValueLockedToken0Usd: newLockedAmounts.newPoolTotalValueLockedToken0USD,
    totalValueLockedToken1Usd: newLockedAmounts.newPoolTotalValueLockedToken1USD,
    totalValueLockedUsd: newLockedAmounts.newPoolTotalValueLockedUSD,
    accumulatedYield: poolEntity.accumulatedYield.plus(swapYield),
    swapsCount: poolEntity.swapsCount + 1,
  };

  token0Entity = {
    ...token0Entity,
    swapVolumeUsd: token0Entity.swapVolumeUsd.plus(swapVolume.volumeToken0USD),
    tokenSwapVolume: token0Entity.tokenSwapVolume.plus(swapVolume.volumeToken0),
    tokenTotalValuePooled: newLockedAmounts.newToken0TotalPooledAmount,
    totalValuePooledUsd: newLockedAmounts.newToken0TotalPooledAmountUSD,
    tokenFees: token0Entity.tokenFees.plus(swapFees.feesToken0),
    feesUsd: token0Entity.feesUsd.plus(swapFees.feesToken0USD),
  };

  token1Entity = {
    ...token1Entity,
    swapVolumeUsd: token1Entity.swapVolumeUsd.plus(swapVolume.volumeToken1USD),
    tokenSwapVolume: token1Entity.tokenSwapVolume.plus(swapVolume.volumeToken1),
    tokenTotalValuePooled: newLockedAmounts.newToken1TotalPooledAmount,
    totalValuePooledUsd: newLockedAmounts.newToken1TotalPooledAmountUSD,
    tokenFees: token1Entity.tokenFees.plus(swapFees.feesToken1),
    feesUsd: token1Entity.feesUsd.plus(swapFees.feesToken1USD),
  };

  poolHistoricalDataEntities = poolHistoricalDataEntities.map((historicalDataEntity) => ({
    ...historicalDataEntity,
    swapVolumeUsdAtEnd: poolEntity.swapVolumeUsd,
    intervalSwapVolumeToken0: historicalDataEntity.intervalSwapVolumeToken0.plus(swapVolume.volumeToken0),
    intervalSwapVolumeToken1: historicalDataEntity.intervalSwapVolumeToken1.plus(swapVolume.volumeToken1),
    intervalSwapVolumeUsd: historicalDataEntity.intervalSwapVolumeUsd.plus(swapVolume.volumeUSD),
    intervalFeesToken0: historicalDataEntity.intervalFeesToken0.plus(swapFees.feesToken0),
    intervalFeesToken1: historicalDataEntity.intervalFeesToken1.plus(swapFees.feesToken1),
    intervalFeesUsd: historicalDataEntity.intervalFeesUsd.plus(swapFees.feesUSD),
    totalValueLockedToken0AtEnd: poolEntity.totalValueLockedToken0,
    totalValueLockedToken1AtEnd: poolEntity.totalValueLockedToken1,
    totalValueLockedUsdAtEnd: poolEntity.totalValueLockedUsd,
    accumulatedYieldAtEnd: poolEntity.accumulatedYield,
    feesUsdAtEnd: poolEntity.feesUsd,
    timestampAtEnd: params.eventTimestamp,
  }));

  statsEntities = statsEntities.map((statEntity) => {
    const yearlyYield = YieldMath.yearlyYieldFromAccumulated({
      accumulatedYield: statEntity.accumulatedYield.plus(swapYield),
      daysAccumulated: STATS_TIMEFRAME_IN_DAYS[statEntity.timeframe],
      eventTimestamp: params.eventTimestamp,
      pool: poolEntity,
    });

    return {
      ...statEntity,
      swapVolumeUsd: statEntity.swapVolumeUsd.plus(swapVolume.volumeUSD),
      accumulatedYield: statEntity.accumulatedYield.plus(swapYield),
      feesUsd: statEntity.feesUsd.plus(swapFees.feesUSD),
      yearlyYield: yearlyYield,
    };
  });

  params.context.Pool.set(poolEntity);
  params.context.Token.set(token0Entity);
  params.context.Token.set(token1Entity);
  statsEntities.forEach((entity) => params.context.PoolTimeframedStats.set(entity));
  poolHistoricalDataEntities.forEach((entity) => params.context.PoolHistoricalData.set(entity));

  await processPoolTimeframedStatsUpdate({
    context: params.context,
    eventTimestamp: params.eventTimestamp,
    poolEntity,
  });
}
