import {
  BigDecimal,
  handlerContext,
  PoolDailyData,
  Pool as PoolEntity,
  PoolHourlyData,
  Token as TokenEntity,
} from "generated";
import {
  OUTLIER_POOL_TVL_PERCENT_THRESHOLD,
  OUTLIER_TOKEN_PRICE_PERCENT_THRESHOLD,
  ZERO_ADDRESS,
  ZERO_BIG_DECIMAL,
} from "./constants";
import {
  isSecondsTimestampMoreThanDaysAgo,
  isSecondsTimestampMoreThanHoursAgo,
  subtractDaysFromSecondsTimestamp,
} from "./date-commons";
import { defaultPoolDailyData, defaultPoolHourlyData } from "./default-entities";
import { IndexerNetwork } from "./enums/indexer-network";
import { isPercentageDifferenceWithinThreshold } from "./math";
import {
  calculateDayYearlyYield,
  calculateHourYearlyYield,
  calculateYearlyYieldFromAccumulated,
  findNativeToken,
  findStableToken,
  findWrappedNative,
  getLiquidityInflowAndOutflowFromRawAmounts,
  getPoolDailyDataAgo,
  getPoolDailyDataId,
  getPoolHourlyDataAgo,
  getPoolHourlyDataId,
  getSwapFeesFromRawAmounts,
  getSwapVolumeFromAmounts,
  isNativePool,
  isStablePool,
  isVariableWithStablePool,
  isWrappedNativePool,
} from "./pool-commons";
import { formatFromTokenAmount, pickMostLiquidPoolForToken } from "./token-commons";
import { PoolPrices } from "./types";

export class PoolSetters {
  constructor(readonly context: handlerContext, readonly network: IndexerNetwork) {}

  async setIntervalDataTVL(eventTimestamp: bigint, poolEntity: PoolEntity): Promise<void> {
    let [poolDailyDataEntity, poolHourlyDataEntity]: [PoolDailyData, PoolHourlyData] = await Promise.all([
      this.context.PoolDailyData.getOrCreate(
        defaultPoolDailyData({
          eventTimestamp: eventTimestamp,
          poolEntity: poolEntity,
        })
      ),

      this.context.PoolHourlyData.getOrCreate(
        defaultPoolHourlyData({
          eventTimestamp: eventTimestamp,
          poolEntity: poolEntity,
        })
      ),
    ]);

    poolDailyDataEntity = {
      ...poolDailyDataEntity,
      totalValueLockedToken0: poolEntity.totalValueLockedToken0,
      totalValueLockedToken1: poolEntity.totalValueLockedToken1,
      totalValueLockedUSD: poolEntity.totalValueLockedUSD,
    };

    poolHourlyDataEntity = {
      ...poolHourlyDataEntity,
      totalValueLockedToken0: poolEntity.totalValueLockedToken0,
      totalValueLockedToken1: poolEntity.totalValueLockedToken1,
      totalValueLockedUSD: poolEntity.totalValueLockedUSD,
    };

    this.context.PoolHourlyData.set(poolHourlyDataEntity);
    this.context.PoolDailyData.set(poolDailyDataEntity);
  }

  async updateTokenPricesFromPoolPrices(
    poolToken0Entity: TokenEntity,
    poolToken1Entity: TokenEntity,
    pool: PoolEntity,
    poolPrices: PoolPrices
  ): Promise<[token0: TokenEntity, token1: TokenEntity]> {
    const tokenPrices = this._deriveTokenPricesFromPoolPrices(poolToken0Entity, poolToken1Entity, poolPrices);

    const isNewPoolTvlUsdBalancedWithinThreshold = isPercentageDifferenceWithinThreshold(
      pool.totalValueLockedToken0.times(tokenPrices.token0UpdatedPrice),
      pool.totalValueLockedToken1.times(tokenPrices.token1UpdatedPrice),
      OUTLIER_POOL_TVL_PERCENT_THRESHOLD
    );

    return await Promise.all([
      await this._maybeUpdateTokenPrice(
        poolToken0Entity,
        tokenPrices.token0UpdatedPrice,
        pool,
        isNewPoolTvlUsdBalancedWithinThreshold
      ),

      await this._maybeUpdateTokenPrice(
        poolToken1Entity,
        tokenPrices.token1UpdatedPrice,
        pool,
        isNewPoolTvlUsdBalancedWithinThreshold
      ),
    ]);
  }

  async setLiquidityIntervalData(params: {
    eventTimestamp: bigint;
    amount0AddedOrRemoved: bigint;
    amount1AddedOrRemoved: bigint;
    poolEntity: PoolEntity;
    token0: TokenEntity;
    token1: TokenEntity;
  }): Promise<void> {
    let [poolDailyData, poolHourlyData]: [PoolDailyData, PoolHourlyData] = await Promise.all([
      this.context.PoolDailyData.getOrCreate(
        defaultPoolDailyData({
          eventTimestamp: params.eventTimestamp,
          poolEntity: params.poolEntity,
        })
      ),

      this.context.PoolHourlyData.getOrCreate(
        defaultPoolHourlyData({
          eventTimestamp: params.eventTimestamp,
          poolEntity: params.poolEntity,
        })
      ),
    ]);

    const amountInflowsAndOuflows = getLiquidityInflowAndOutflowFromRawAmounts(
      params.amount0AddedOrRemoved,
      params.amount1AddedOrRemoved,
      params.token0,
      params.token1
    );

    const amount0Volume = formatFromTokenAmount(params.amount0AddedOrRemoved, params.token0).abs();
    const amount1Volume = formatFromTokenAmount(params.amount1AddedOrRemoved, params.token1).abs();
    const liquidityVolumeUSD = amount0Volume
      .times(params.token0.usdPrice)
      .plus(amount1Volume.times(params.token1.usdPrice));

    poolDailyData = {
      ...poolDailyData,
      liquidityVolumeToken0: poolDailyData.liquidityVolumeToken0.plus(amount0Volume),
      liquidityVolumeToken1: poolDailyData.liquidityVolumeToken1.plus(amount1Volume),
      liquidityVolumeUSD: poolDailyData.liquidityVolumeUSD.plus(liquidityVolumeUSD),
      liquidityNetInflowToken0: poolDailyData.liquidityNetInflowToken0.plus(amountInflowsAndOuflows.netInflowToken0),
      liquidityNetInflowToken1: poolDailyData.liquidityNetInflowToken1.plus(amountInflowsAndOuflows.netInflowToken1),
      liquidityNetInflowUSD: poolDailyData.liquidityNetInflowUSD.plus(amountInflowsAndOuflows.netInflowUSD),
      liquidityInflowToken0: poolDailyData.liquidityInflowToken0.plus(amountInflowsAndOuflows.inflowToken0),
      liquidityInflowToken1: poolDailyData.liquidityInflowToken1.plus(amountInflowsAndOuflows.inflowToken1),
      liquidityOutflowToken0: poolDailyData.liquidityOutflowToken0.plus(amountInflowsAndOuflows.outflowToken0),
      liquidityOutflowToken1: poolDailyData.liquidityOutflowToken1.plus(amountInflowsAndOuflows.outflowToken1),
      liquidityInflowUSD: poolDailyData.liquidityInflowUSD.plus(amountInflowsAndOuflows.inflowUSD),
      liquidityOutflowUSD: poolDailyData.liquidityOutflowUSD.plus(amountInflowsAndOuflows.outflowUSD),
    };

    poolHourlyData = {
      ...poolHourlyData,
      liquidityVolumeToken0: poolHourlyData.liquidityVolumeToken0.plus(amount0Volume),
      liquidityVolumeToken1: poolHourlyData.liquidityVolumeToken1.plus(amount1Volume),
      liquidityVolumeUSD: poolHourlyData.liquidityVolumeUSD.plus(liquidityVolumeUSD),
      liquidityNetInflowToken0: poolHourlyData.liquidityNetInflowToken0.plus(amountInflowsAndOuflows.netInflowToken0),
      liquidityNetInflowToken1: poolHourlyData.liquidityNetInflowToken1.plus(amountInflowsAndOuflows.netInflowToken1),
      liquidityNetInflowUSD: poolHourlyData.liquidityNetInflowUSD.plus(amountInflowsAndOuflows.netInflowUSD),
      liquidityInflowToken0: poolHourlyData.liquidityInflowToken0.plus(amountInflowsAndOuflows.inflowToken0),
      liquidityInflowToken1: poolHourlyData.liquidityInflowToken1.plus(amountInflowsAndOuflows.inflowToken1),
      liquidityOutflowToken0: poolHourlyData.liquidityOutflowToken0.plus(amountInflowsAndOuflows.outflowToken0),
      liquidityOutflowToken1: poolHourlyData.liquidityOutflowToken1.plus(amountInflowsAndOuflows.outflowToken1),
      liquidityInflowUSD: poolHourlyData.liquidityInflowUSD.plus(amountInflowsAndOuflows.inflowUSD),
      liquidityOutflowUSD: poolHourlyData.liquidityOutflowUSD.plus(amountInflowsAndOuflows.outflowUSD),
    };

    this.context.PoolDailyData.set(poolDailyData);
    this.context.PoolHourlyData.set(poolHourlyData);
  }

  async setIntervalSwapData(
    eventTimestamp: bigint,
    context: handlerContext,
    pool: PoolEntity,
    token0: TokenEntity,
    token1: TokenEntity,
    amount0: bigint,
    amount1: bigint,
    swapFee: number = pool.currentFeeTier
  ): Promise<void> {
    await this.setIntervalDataTVL(eventTimestamp, pool);

    let [poolDailyDataEntity, poolHourlyDataEntity]: [PoolDailyData, PoolHourlyData] = await Promise.all([
      context.PoolDailyData.getOrThrow(getPoolDailyDataId(eventTimestamp, pool)),
      context.PoolHourlyData.getOrThrow(getPoolHourlyDataId(eventTimestamp, pool)),
    ]);

    const swapVolume = getSwapVolumeFromAmounts(
      formatFromTokenAmount(amount0, token0),
      formatFromTokenAmount(amount1, token1),
      token0,
      token1
    );

    const swapFees = getSwapFeesFromRawAmounts(amount0, amount1, swapFee, token0, token1);
    const totalDayFeesUSD = poolDailyDataEntity.feesUSD.plus(swapFees.feesUSD);
    const totalHourFeesUSD = poolHourlyDataEntity.feesUSD.plus(swapFees.feesUSD);

    const dayYearlyYield = calculateDayYearlyYield(poolDailyDataEntity.totalValueLockedUSD, totalDayFeesUSD);
    const hourYearlyYield = calculateHourYearlyYield(poolHourlyDataEntity.totalValueLockedUSD, totalHourFeesUSD);

    poolDailyDataEntity = {
      ...poolDailyDataEntity,
      swapVolumeToken0: poolDailyDataEntity.swapVolumeToken0.plus(swapVolume.volumeToken0),
      swapVolumeToken1: poolDailyDataEntity.swapVolumeToken1.plus(swapVolume.volumeToken1),
      swapVolumeUSD: poolDailyDataEntity.swapVolumeUSD.plus(swapVolume.volumeUSD),
      feesToken0: poolDailyDataEntity.feesToken0.plus(swapFees.feeToken0),
      feesToken1: poolDailyDataEntity.feesToken1.plus(swapFees.feeToken1),
      feesUSD: totalDayFeesUSD,
      yearlyYield: dayYearlyYield,
      totalAccumulatedYield: pool.totalAccumulatedYield,
    };

    poolHourlyDataEntity = {
      ...poolHourlyDataEntity,
      swapVolumeToken0: poolHourlyDataEntity.swapVolumeToken0.plus(swapVolume.volumeToken0),
      swapVolumeToken1: poolHourlyDataEntity.swapVolumeToken1.plus(swapVolume.volumeToken1),
      swapVolumeUSD: poolHourlyDataEntity.swapVolumeUSD.plus(swapVolume.volumeUSD),
      feesToken0: poolHourlyDataEntity.feesToken0.plus(swapFees.feeToken0),
      feesToken1: poolHourlyDataEntity.feesToken1.plus(swapFees.feeToken1),
      feesUSD: totalHourFeesUSD,
      yearlyYield: hourYearlyYield,
      totalAccumulatedYield: pool.totalAccumulatedYield,
    };

    context.PoolDailyData.set(poolDailyDataEntity);
    context.PoolHourlyData.set(poolHourlyDataEntity);
  }

  async updatePoolTimeframedAccumulatedYield(eventTimestamp: bigint, poolEntity: PoolEntity): Promise<PoolEntity> {
    // Do not update it while indexer is still far catching up because it doesn't make sense as it's not the latest data.
    // use 100 days to start to update beucase the max timeframe is 90d ago
    if (isSecondsTimestampMoreThanDaysAgo(eventTimestamp, 100)) return poolEntity;

    // This cannot be done in parallel, because each one needs to update the most recent pool
    poolEntity = await this._getUpdated24hTimeframeData(eventTimestamp, poolEntity);
    poolEntity = await this._getUpdatedDaysTimeframeData(eventTimestamp, poolEntity, 7);
    poolEntity = await this._getUpdatedDaysTimeframeData(eventTimestamp, poolEntity, 30);
    poolEntity = await this._getUpdatedDaysTimeframeData(eventTimestamp, poolEntity, 90);

    return poolEntity;
  }

  private async _getUpdated24hTimeframeData(eventTimestamp: bigint, poolEntity: PoolEntity): Promise<PoolEntity> {
    const shouldRefresh = isSecondsTimestampMoreThanHoursAgo(poolEntity.lastAdjustTimestamp24h ?? 0n, 1);

    if (shouldRefresh) {
      const data24hAgo = await getPoolHourlyDataAgo(24, eventTimestamp, this.context, poolEntity);

      if (data24hAgo) {
        const accumulatedYield24h = poolEntity.totalAccumulatedYield.minus(data24hAgo.totalAccumulatedYield);

        return {
          ...poolEntity,
          accumulatedYield24h: accumulatedYield24h,
          lastAdjustTimestamp24h: eventTimestamp,
          totalAccumulatedYield24hAgo: data24hAgo.totalAccumulatedYield,
          yearlyYield24h: calculateYearlyYieldFromAccumulated(1, accumulatedYield24h),
          dataPointTimestamp24hAgo: data24hAgo.hourStartTimestamp,
        };
      }
    }

    return this._getYieldFromSavedData({ eventTimestamp, poolEntity, days: 1 });
  }

  private async _getUpdatedDaysTimeframeData(
    eventTimestamp: bigint,
    poolEntity: PoolEntity,
    days: 7 | 30 | 90
  ): Promise<PoolEntity> {
    const shouldRefresh = isSecondsTimestampMoreThanDaysAgo(poolEntity[`lastAdjustTimestamp${days}d`] ?? 0n, 1);

    if (shouldRefresh) {
      const dataDaysAgo = await getPoolDailyDataAgo(days, eventTimestamp, this.context, poolEntity);

      if (dataDaysAgo) {
        const accumulatedYield = poolEntity.totalAccumulatedYield.minus(dataDaysAgo.totalAccumulatedYield);

        switch (days) {
          case 7:
            return {
              ...poolEntity,
              accumulatedYield7d: accumulatedYield,
              lastAdjustTimestamp7d: eventTimestamp,
              totalAccumulatedYield7dAgo: dataDaysAgo.totalAccumulatedYield,
              yearlyYield7d: calculateYearlyYieldFromAccumulated(7, accumulatedYield),
              dataPointTimestamp7dAgo: dataDaysAgo.dayStartTimestamp,
            };

          case 30:
            return {
              ...poolEntity,
              accumulatedYield30d: accumulatedYield,
              lastAdjustTimestamp30d: eventTimestamp,
              totalAccumulatedYield30dAgo: dataDaysAgo.totalAccumulatedYield,
              yearlyYield30d: calculateYearlyYieldFromAccumulated(30, accumulatedYield),
              dataPointTimestamp30dAgo: dataDaysAgo.dayStartTimestamp,
            };

          case 90:
            return {
              ...poolEntity,
              accumulatedYield90d: accumulatedYield,
              lastAdjustTimestamp90d: eventTimestamp,
              totalAccumulatedYield90dAgo: dataDaysAgo.totalAccumulatedYield,
              yearlyYield90d: calculateYearlyYieldFromAccumulated(90, accumulatedYield),
              dataPointTimestamp90dAgo: dataDaysAgo.dayStartTimestamp,
            };
        }
      }
    }

    return this._getYieldFromSavedData({ eventTimestamp, poolEntity, days });
  }

  private _getYieldFromSavedData(params: {
    eventTimestamp: bigint;
    poolEntity: PoolEntity;
    days: 1 | 7 | 30 | 90;
  }): PoolEntity {
    const timeframeKey: "24h" | "7d" | "30d" | "90d" = params.days == 1 ? "24h" : `${params.days}d`;
    const isPoolOlderThanTimeframe =
      params.poolEntity.createdAtTimestamp < subtractDaysFromSecondsTimestamp(params.eventTimestamp, params.days);

    const totalAccumulatedYieldTimeframeAgo = params.poolEntity[`totalAccumulatedYield${timeframeKey}Ago`];
    if (totalAccumulatedYieldTimeframeAgo.isZero() && isPoolOlderThanTimeframe) return params.poolEntity;

    const accumulatedYieldSinceTimeframe = !isPoolOlderThanTimeframe
      ? params.poolEntity.totalAccumulatedYield
      : params.poolEntity.totalAccumulatedYield.minus(totalAccumulatedYieldTimeframeAgo);

    switch (params.days) {
      case 1:
        return {
          ...params.poolEntity,
          accumulatedYield24h: accumulatedYieldSinceTimeframe,
          yearlyYield24h: calculateYearlyYieldFromAccumulated(1, accumulatedYieldSinceTimeframe),
        };
      case 7:
        return {
          ...params.poolEntity,
          accumulatedYield7d: accumulatedYieldSinceTimeframe,
          yearlyYield7d: calculateYearlyYieldFromAccumulated(7, accumulatedYieldSinceTimeframe),
        };
      case 30:
        return {
          ...params.poolEntity,
          accumulatedYield30d: accumulatedYieldSinceTimeframe,
          yearlyYield30d: calculateYearlyYieldFromAccumulated(30, accumulatedYieldSinceTimeframe),
        };
      case 90:
        return {
          ...params.poolEntity,
          accumulatedYield90d: accumulatedYieldSinceTimeframe,
          yearlyYield90d: calculateYearlyYieldFromAccumulated(90, accumulatedYieldSinceTimeframe),
        };
    }
  }

  private async _maybeUpdateTokenPrice(
    forToken: TokenEntity,
    newPrice: BigDecimal,
    fromPool: PoolEntity,
    isNewPoolTvlBalanced: boolean
  ): Promise<TokenEntity> {
    const isNewPriceWithinThreshold = isPercentageDifferenceWithinThreshold(
      forToken.usdPrice,
      newPrice,
      OUTLIER_TOKEN_PRICE_PERCENT_THRESHOLD
    );

    if (isNewPriceWithinThreshold) {
      return {
        ...forToken,
        usdPrice: newPrice,
      };
    }

    const isMostLiquidPoolUnset = forToken.mostLiquidPool_id.lowercasedEquals(ZERO_ADDRESS);
    const isPriceUpdateFromCurrentMostLiquidPool = forToken.mostLiquidPool_id.lowercasedEquals(fromPool.id);
    const isSettingPriceUp = newPrice.gt(forToken.usdPrice);

    if (!isNewPoolTvlBalanced && isSettingPriceUp) return forToken;

    if (isMostLiquidPoolUnset || isPriceUpdateFromCurrentMostLiquidPool) {
      return {
        ...forToken,
        usdPrice: newPrice,
        mostLiquidPool_id: fromPool.id,
      };
    }

    const mostLiquidPoolEntity = await this.context.Pool.getOrThrow(forToken.mostLiquidPool_id);
    const isPriceFromMoreLiquidPool = pickMostLiquidPoolForToken(
      forToken,
      fromPool,
      mostLiquidPoolEntity
    ).id.lowercasedEquals(fromPool.id);

    if (isPriceFromMoreLiquidPool && isNewPoolTvlBalanced) {
      return (forToken = {
        ...forToken,
        usdPrice: newPrice,
        mostLiquidPool_id: fromPool.id,
      });
    }

    return forToken;
  }

  private _deriveTokenPricesFromPoolPrices(
    poolToken0Entity: TokenEntity,
    poolToken1Entity: TokenEntity,
    poolPrices: PoolPrices
  ): { token0UpdatedPrice: BigDecimal; token1UpdatedPrice: BigDecimal } {
    if (isVariableWithStablePool(poolToken0Entity, poolToken1Entity, this.network)) {
      let stableToken = findStableToken(poolToken0Entity, poolToken1Entity, this.network);

      if (stableToken.id == poolToken0Entity.id) {
        const newToken1Price = poolPrices.token0PerToken1;
        const newToken0Price = poolPrices.token1PerToken0.times(newToken1Price);

        return {
          token0UpdatedPrice: newToken0Price.decimalPlaces(poolToken0Entity.decimals),
          token1UpdatedPrice: newToken1Price.decimalPlaces(poolToken1Entity.decimals),
        };
      }

      const newToken0Price = poolPrices.token1PerToken0;
      const newToken1Price = poolPrices.token0PerToken1.times(newToken0Price);

      return {
        token0UpdatedPrice: newToken0Price.decimalPlaces(poolToken0Entity.decimals),
        token1UpdatedPrice: newToken1Price.decimalPlaces(poolToken1Entity.decimals),
      };
    }

    if (isWrappedNativePool(poolToken0Entity, poolToken1Entity, this.network)) {
      if (findWrappedNative(poolToken0Entity, poolToken1Entity, this.network).id == poolToken0Entity.id) {
        const newToken1Price = poolPrices.token0PerToken1.times(poolToken0Entity.usdPrice);

        return {
          token0UpdatedPrice: poolToken0Entity.usdPrice,
          token1UpdatedPrice: newToken1Price.decimalPlaces(poolToken1Entity.decimals),
        };
      }

      const newToken0Price = poolPrices.token1PerToken0.times(poolToken1Entity.usdPrice);

      return {
        token0UpdatedPrice: newToken0Price.decimalPlaces(poolToken0Entity.decimals),
        token1UpdatedPrice: poolToken1Entity.usdPrice,
      };
    }

    if (isNativePool(poolToken0Entity, poolToken1Entity)) {
      if (findNativeToken(poolToken0Entity, poolToken1Entity).id == poolToken0Entity.id) {
        const newToken1Price = poolPrices.token0PerToken1.times(poolToken0Entity.usdPrice);

        return {
          token0UpdatedPrice: poolToken0Entity.usdPrice,
          token1UpdatedPrice: newToken1Price.decimalPlaces(poolToken1Entity.decimals),
        };
      }

      const newToken0Price = poolPrices.token1PerToken0.times(poolToken1Entity.usdPrice);

      return {
        token0UpdatedPrice: newToken0Price.decimalPlaces(poolToken0Entity.decimals),
        token1UpdatedPrice: poolToken1Entity.usdPrice,
      };
    }

    if (isStablePool(poolToken0Entity, poolToken1Entity, this.network)) {
      const newToken1Price = poolPrices.token0PerToken1;
      const newToken0Price = poolPrices.token1PerToken0;

      return {
        token0UpdatedPrice: newToken0Price.decimalPlaces(poolToken0Entity.decimals),
        token1UpdatedPrice: newToken1Price.decimalPlaces(poolToken1Entity.decimals),
      };
    }

    let token0Price = poolToken0Entity.usdPrice;
    let token1Price = poolToken1Entity.usdPrice;

    if (!poolToken1Entity.usdPrice.eq(ZERO_BIG_DECIMAL)) {
      token0Price = poolPrices.token1PerToken0.times(poolToken1Entity.usdPrice);
    }

    if (!poolToken0Entity.usdPrice.eq(ZERO_BIG_DECIMAL)) {
      token1Price = poolPrices.token0PerToken1.times(poolToken0Entity.usdPrice);
    }

    return {
      token0UpdatedPrice: token0Price.decimalPlaces(poolToken0Entity.decimals),
      token1UpdatedPrice: token1Price.decimalPlaces(poolToken1Entity.decimals),
    };
  }
}
