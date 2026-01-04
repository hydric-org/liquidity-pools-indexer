import type { PoolHistoricalData as PoolHistoricalDataEntity, Token as TokenEntity } from "generated";
import type { HandlerContext } from "generated/src/Types";
import { EntityId } from "../core/entity";
import { IndexerNetwork } from "../core/network";
import { calculateNewLockedAmounts } from "../lib/math";
import { DatabaseService } from "../services/database-service";
import { processLiquidityMetrics } from "./liquidity-metrics-processor";
import { processPoolTimeframedStatsUpdate } from "./pool-timeframed-stats-update-processor";

export async function processLiquidityChange(params: {
  context: HandlerContext;
  poolAddress: string;
  network: IndexerNetwork;
  amount0AddedOrRemoved: bigint;
  amount1AddedOrRemoved: bigint;
  eventTimestamp: bigint;
  updateMetrics: boolean;
}) {
  let poolEntity = await params.context.Pool.getOrThrow(EntityId.fromAddress(params.network, params.poolAddress));

  let [token0Entity, token1Entity, poolHistoricalDataEntities]: [TokenEntity, TokenEntity, PoolHistoricalDataEntity[]] =
    await Promise.all([
      params.context.Token.getOrThrow(poolEntity.token0_id),
      params.context.Token.getOrThrow(poolEntity.token1_id),
      DatabaseService.getOrCreateHistoricalPoolDataEntities({
        context: params.context,
        eventTimestamp: params.eventTimestamp,
        pool: poolEntity,
      }),
    ]);

  const newLockedAmounts = calculateNewLockedAmounts({
    amount0AddedOrRemoved: params.amount0AddedOrRemoved,
    amount1AddedOrRemoved: params.amount1AddedOrRemoved,
    poolEntity,
    token0: token0Entity,
    token1: token1Entity,
  });

  poolEntity = {
    ...poolEntity,
    totalValueLockedToken0: newLockedAmounts.newPoolTotalValueLockedToken0,
    totalValueLockedToken0Usd: newLockedAmounts.newPoolTotalValueLockedToken0USD,
    trackedTotalValueLockedToken0Usd: newLockedAmounts.newTrackedPoolTotalValueLockedToken0USD,

    totalValueLockedToken1: newLockedAmounts.newPoolTotalValueLockedToken1,
    totalValueLockedToken1Usd: newLockedAmounts.newPoolTotalValueLockedToken1USD,
    trackedTotalValueLockedToken1Usd: newLockedAmounts.newTrackedPoolTotalValueLockedToken1USD,

    totalValueLockedUsd: newLockedAmounts.newPoolTotalValueLockedUSD,
    trackedTotalValueLockedUsd: newLockedAmounts.newTrackedPoolTotalValueLockedUSD,
  };

  token0Entity = {
    ...token0Entity,
    tokenTotalValuePooled: newLockedAmounts.newToken0TotalPooledAmount,
    totalValuePooledUsd: newLockedAmounts.newToken0TotalPooledAmountUSD,
    trackedTotalValuePooledUsd: newLockedAmounts.newTrackedToken0TotalPooledAmountUSD,
  };

  token1Entity = {
    ...token1Entity,
    tokenTotalValuePooled: newLockedAmounts.newToken1TotalPooledAmount,
    totalValuePooledUsd: newLockedAmounts.newToken1TotalPooledAmountUSD,
    trackedTotalValuePooledUsd: newLockedAmounts.newTrackedToken1TotalPooledAmountUSD,
  };

  poolHistoricalDataEntities = poolHistoricalDataEntities.map((historicalDataEntity) => ({
    ...historicalDataEntity,
    totalValueLockedToken0AtEnd: poolEntity.totalValueLockedToken0,
    totalValueLockedToken1AtEnd: poolEntity.totalValueLockedToken1,

    totalValueLockedUsdAtEnd: poolEntity.totalValueLockedUsd,
    trackedTotalValueLockedUsdAtEnd: poolEntity.trackedTotalValueLockedUsd,

    timestampAtEnd: params.eventTimestamp,
  }));

  params.context.Pool.set(poolEntity);
  params.context.Token.set(token0Entity);
  params.context.Token.set(token1Entity);
  poolHistoricalDataEntities.forEach((entity) => params.context.PoolHistoricalData.set(entity));

  if (params.updateMetrics) {
    await processLiquidityMetrics({
      context: params.context,
      poolAddress: params.poolAddress,
      network: params.network,
      eventTimestamp: params.eventTimestamp,
      amount0AddedOrRemoved: params.amount0AddedOrRemoved,
      amount1AddedOrRemoved: params.amount1AddedOrRemoved,
    });
  }

  await processPoolTimeframedStatsUpdate({
    context: params.context,
    eventTimestamp: params.eventTimestamp,
    poolEntity,
  });
}
