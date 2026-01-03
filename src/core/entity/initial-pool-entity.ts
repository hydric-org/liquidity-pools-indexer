import type { BigDecimal, Pool as PoolEntity } from "generated";
import type { PoolType_t } from "generated/src/db/Enums.gen";
import { ZERO_BIG_DECIMAL } from "../constants";
import { EntityId } from "./entity-id";

export class InitialPoolEntity implements PoolEntity {
  constructor(
    readonly params: Pick<
      InitialPoolEntity,
      | "chainId"
      | "poolAddress"
      | "createdAtTimestamp"
      | "initialFeeTier"
      | "isDynamicFee"
      | "poolType"
      | "positionManager"
      | "protocol_id"
      | "token0_id"
      | "token1_id"
    >
  ) {
    this.chainId = params.chainId;
    this.poolAddress = params.poolAddress;
    this.createdAtTimestamp = params.createdAtTimestamp;
    this.initialFeeTier = params.initialFeeTier;
    this.isDynamicFee = params.isDynamicFee;
    this.poolType = params.poolType;
    this.positionManager = params.positionManager;
    this.protocol_id = params.protocol_id;
    this.token0_id = params.token0_id;
    this.token1_id = params.token1_id;

    this.currentFeeTier = this.initialFeeTier;

    this.id = EntityId.fromAddress(this.chainId, this.poolAddress);
    this.totalStats24h_id = EntityId.build24hStatsId(this.chainId, this.poolAddress);
    this.totalStats7d_id = EntityId.build7dStatsId(this.chainId, this.poolAddress);
    this.totalStats30d_id = EntityId.build30dStatsId(this.chainId, this.poolAddress);
    this.totalStats90d_id = EntityId.build90dStatsId(this.chainId, this.poolAddress);

    this.v3PoolData_id = this.id;
    this.v4PoolData_id = this.id;
    this.slipstreamPoolData_id = this.id;
    this.algebraPoolData_id = this.id;
  }

  readonly chainId: number;
  readonly poolAddress: string;
  readonly createdAtTimestamp: bigint;
  readonly initialFeeTier: number;
  readonly isDynamicFee: boolean;
  readonly poolType: PoolType_t;
  readonly positionManager: string;
  readonly protocol_id: string;
  readonly token0_id: string;
  readonly token1_id: string;

  readonly currentFeeTier: number;
  readonly id: string;
  readonly totalStats24h_id: string;
  readonly totalStats7d_id: string;
  readonly totalStats30d_id: string;
  readonly totalStats90d_id: string;
  readonly v3PoolData_id: string;
  readonly v4PoolData_id: string;
  readonly slipstreamPoolData_id: string;
  readonly algebraPoolData_id: string;

  readonly tokens0PerToken1: BigDecimal = ZERO_BIG_DECIMAL;
  readonly tokens1PerToken0: BigDecimal = ZERO_BIG_DECIMAL;
  readonly swapsCount: number = 0;
  readonly token0SwapOutCapacity: BigDecimal = ZERO_BIG_DECIMAL;
  readonly token0SwapOutCapacityUsd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly token1SwapOutCapacity: BigDecimal = ZERO_BIG_DECIMAL;
  readonly token1SwapOutCapacityUsd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly liquidityVolumeToken0Usd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly liquidityVolumeToken1Usd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly swapVolumeToken0Usd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly swapVolumeToken1Usd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly accumulatedYield: BigDecimal = ZERO_BIG_DECIMAL;
  readonly feesToken0: BigDecimal = ZERO_BIG_DECIMAL;
  readonly feesToken1: BigDecimal = ZERO_BIG_DECIMAL;
  readonly feesUsd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly liquidityNetInflowUsd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly liquidityVolumeToken0: BigDecimal = ZERO_BIG_DECIMAL;
  readonly liquidityVolumeToken1: BigDecimal = ZERO_BIG_DECIMAL;
  readonly liquidityVolumeUsd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly swapVolumeToken0: BigDecimal = ZERO_BIG_DECIMAL;
  readonly swapVolumeToken1: BigDecimal = ZERO_BIG_DECIMAL;
  readonly swapVolumeUsd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly totalValueLockedToken0: BigDecimal = ZERO_BIG_DECIMAL;
  readonly totalValueLockedToken0Usd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly totalValueLockedToken1: BigDecimal = ZERO_BIG_DECIMAL;
  readonly totalValueLockedToken1Usd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly totalValueLockedUsd: BigDecimal = ZERO_BIG_DECIMAL;
}
