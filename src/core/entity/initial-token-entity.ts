import { BigDecimal, Token as TokenEntity } from "generated";
import { ZERO_ADDRESS, ZERO_BIG_DECIMAL } from "../constants";
import { IndexerNetwork } from "../network";
import { EntityId } from "./entity-id";

export class InitialTokenEntity implements TokenEntity {
  constructor(
    readonly params: { tokenAddress: string; network: IndexerNetwork; decimals: number; symbol: string; name: string }
  ) {}

  readonly id: string = EntityId.fromAddress(this.params.network, this.params.tokenAddress);
  readonly liquidityQualityBackedScore: BigDecimal = ZERO_BIG_DECIMAL;
  readonly liquidityQualitySeedScore: BigDecimal = ZERO_BIG_DECIMAL;
  readonly feesUsd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly tokenFees: BigDecimal = ZERO_BIG_DECIMAL;
  readonly mostLiquidPool_id: string = ZERO_ADDRESS;
  readonly liquidityQualityScore: BigDecimal = ZERO_BIG_DECIMAL;
  readonly chainId: number = this.params.network;
  readonly decimals: number = this.params.decimals;
  readonly liquidityVolumeUsd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly name: string = this.params.name;
  readonly swapVolumeUsd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly symbol: string = this.params.symbol;
  readonly tokenAddress: string = this.params.tokenAddress;
  readonly tokenLiquidityVolume: BigDecimal = ZERO_BIG_DECIMAL;
  readonly tokenSwapVolume: BigDecimal = ZERO_BIG_DECIMAL;
  readonly totalValuePooledUsd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly usdPrice: BigDecimal = ZERO_BIG_DECIMAL;
  readonly poolsCount: number = 0;
  readonly relevanceScore: BigDecimal = ZERO_BIG_DECIMAL;
  readonly swapOutCapacityUsd: BigDecimal = ZERO_BIG_DECIMAL;
  readonly tokenSwapOutCapacity: BigDecimal = ZERO_BIG_DECIMAL;
  readonly tokenTotalValuePooled: BigDecimal = ZERO_BIG_DECIMAL;
  readonly swapsCount: number = 0;
  readonly swapsInCount: number = 0;
  readonly swapsOutCount: number = 0;
}
