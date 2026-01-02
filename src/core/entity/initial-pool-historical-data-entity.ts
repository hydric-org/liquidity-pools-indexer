import { BigDecimal, Pool as PoolEntity, PoolHistoricalData as PoolHistoricalDataEntity } from "generated";
import { HistoricalDataInterval_t } from "generated/src/db/Enums.gen";
import { ZERO_BIG_DECIMAL } from "../constants";
import { EntityId } from "./entity-id";

export class InitialPoolHistoricalDataEntity implements PoolHistoricalDataEntity {
  constructor(
    readonly params: {
      poolEntity: PoolEntity;
      interval: HistoricalDataInterval_t;
      eventTimestamp: bigint;
    }
  ) {
    switch (params.interval) {
      case "DAILY":
        this.id = EntityId.buildDailyDataId(
          params.eventTimestamp,
          params.poolEntity.chainId,
          params.poolEntity.poolAddress
        );
        break;

      case "HOURLY":
        this.id = EntityId.buildHourlyDataId(
          params.eventTimestamp,
          params.poolEntity.chainId,
          params.poolEntity.poolAddress
        );
        break;
    }
  }

  readonly id: string;
  readonly pool_id: string = this.params.poolEntity.id;
  readonly timestampAtStart: bigint = this.params.eventTimestamp;
  readonly timestampAtEnd: bigint = this.params.eventTimestamp;
  readonly accumulatedYieldAtStart: BigDecimal = this.params.poolEntity.accumulatedYield;
  readonly accumulatedYieldAtEnd: BigDecimal = this.params.poolEntity.accumulatedYield;
  readonly feesUsdAtStart: BigDecimal = this.params.poolEntity.feesUsd;
  readonly feesUsdAtEnd: BigDecimal = this.params.poolEntity.feesUsd;
  readonly liquidityNetInflowUsdAtStart: BigDecimal = this.params.poolEntity.liquidityNetInflowUsd;
  readonly liquidityNetInflowUsdAtEnd: BigDecimal = this.params.poolEntity.liquidityNetInflowUsd;
  readonly swapVolumeUsdAtStart: BigDecimal = this.params.poolEntity.swapVolumeUsd;
  readonly swapVolumeUsdAtEnd: BigDecimal = this.params.poolEntity.swapVolumeUsd;
  readonly totalValueLockedToken0AtStart: BigDecimal = this.params.poolEntity.totalValueLockedToken0;
  readonly totalValueLockedToken0AtEnd: BigDecimal = this.params.poolEntity.totalValueLockedToken0;
  readonly totalValueLockedToken1AtStart: BigDecimal = this.params.poolEntity.totalValueLockedToken1;
  readonly totalValueLockedToken1AtEnd: BigDecimal = this.params.poolEntity.totalValueLockedToken1;
  readonly totalValueLockedUsdAtStart: BigDecimal = this.params.poolEntity.totalValueLockedUsd;
  readonly totalValueLockedUsdAtEnd: BigDecimal = this.params.poolEntity.totalValueLockedUsd;
  readonly interval: HistoricalDataInterval_t = this.params.interval;
  readonly intervalFeesToken0: BigDecimal = ZERO_BIG_DECIMAL;
  readonly intervalFeesToken1: BigDecimal = ZERO_BIG_DECIMAL;
  readonly intervalFeesUsd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly intervalLiquidityInflowToken0: BigDecimal = ZERO_BIG_DECIMAL;
  readonly intervalLiquidityInflowToken1: BigDecimal = ZERO_BIG_DECIMAL;
  readonly intervalLiquidityInflowUsd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly intervalLiquidityNetInflowToken0: BigDecimal = ZERO_BIG_DECIMAL;
  readonly intervalLiquidityNetInflowToken1: BigDecimal = ZERO_BIG_DECIMAL;
  readonly intervalLiquidityNetInflowUsd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly intervalLiquidityOutflowToken0: BigDecimal = ZERO_BIG_DECIMAL;
  readonly intervalLiquidityOutflowToken1: BigDecimal = ZERO_BIG_DECIMAL;
  readonly intervalLiquidityOutflowUsd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly intervalLiquidityVolumeToken0: BigDecimal = ZERO_BIG_DECIMAL;
  readonly intervalLiquidityVolumeToken1: BigDecimal = ZERO_BIG_DECIMAL;
  readonly intervalLiquidityVolumeUsd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly intervalSwapVolumeToken0: BigDecimal = ZERO_BIG_DECIMAL;
  readonly intervalSwapVolumeToken1: BigDecimal = ZERO_BIG_DECIMAL;
  readonly intervalSwapVolumeUsd: BigDecimal = ZERO_BIG_DECIMAL;
}
