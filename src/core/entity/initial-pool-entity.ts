import { BigDecimal, Pool as PoolEntity } from "generated";
import { PoolType_t } from "generated/src/db/Enums.gen";
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
  ) {}

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
  readonly chainId: number = this.params.chainId;
  readonly createdAtTimestamp: bigint = this.params.createdAtTimestamp;
  readonly feesToken0: BigDecimal = ZERO_BIG_DECIMAL;
  readonly feesToken1: BigDecimal = ZERO_BIG_DECIMAL;
  readonly feesUsd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly initialFeeTier: number = this.params.initialFeeTier;
  readonly currentFeeTier: number = this.initialFeeTier;
  readonly isDynamicFee: boolean = this.params.isDynamicFee;
  readonly liquidityNetInflowUsd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly liquidityVolumeToken0: BigDecimal = ZERO_BIG_DECIMAL;
  readonly liquidityVolumeToken1: BigDecimal = ZERO_BIG_DECIMAL;
  readonly liquidityVolumeUsd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly poolAddress: string = this.params.poolAddress;
  readonly poolType: PoolType_t = this.params.poolType;
  readonly positionManager: string = this.params.positionManager;
  readonly protocol_id: string = this.params.protocol_id;
  readonly swapVolumeToken0: BigDecimal = ZERO_BIG_DECIMAL;
  readonly swapVolumeToken1: BigDecimal = ZERO_BIG_DECIMAL;
  readonly swapVolumeUsd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly token0_id: string = this.params.token0_id;
  readonly token1_id: string = this.params.token1_id;
  readonly totalValueLockedToken0: BigDecimal = ZERO_BIG_DECIMAL;
  readonly totalValueLockedToken0Usd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly totalValueLockedToken1: BigDecimal = ZERO_BIG_DECIMAL;
  readonly totalValueLockedToken1Usd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly totalValueLockedUsd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly totalStats24h_id: string = EntityId.build24hStatsId(this.params.chainId, this.params.poolAddress);
  readonly totalStats7d_id: string = EntityId.build7dStatsId(this.params.chainId, this.params.poolAddress);
  readonly totalStats30d_id: string = EntityId.build30dStatsId(this.params.chainId, this.params.poolAddress);
  readonly totalStats90d_id: string = EntityId.build90dStatsId(this.params.chainId, this.params.poolAddress);
  readonly id: string = EntityId.fromAddress(this.chainId, this.poolAddress);
  readonly v3PoolData_id: string = this.id;
  readonly v4PoolData_id: string = this.id;
  readonly slipstreamPoolData_id: string = this.id;
  readonly algebraPoolData_id: string = this.id;
}
