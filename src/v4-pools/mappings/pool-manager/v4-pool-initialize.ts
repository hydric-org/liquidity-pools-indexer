import {
  DeFiPoolData as DeFiPoolDataEntity,
  handlerContext,
  Pool as PoolEntity,
  Token as TokenEntity,
  V4PoolData as V4PoolEntity,
} from "generated";
import { ZERO_BIG_DECIMAL } from "../../../common/constants";
import { defaultDeFiPoolData } from "../../../common/default-entities";
import { IndexerNetwork } from "../../../common/enums/indexer-network";
import { SupportedProtocol } from "../../../common/enums/supported-protocol";
import { TokenService } from "../../../common/services/token-service";
import { V4_DYNAMIC_FEE_FLAG } from "../../common/constants";

export async function handleV4PoolInitialize(params: {
  context: handlerContext;
  poolAddress: string;
  token0Address: string;
  token1Address: string;
  feeTier: number;
  tickSpacing: number;
  tick: bigint;
  sqrtPriceX96: bigint;
  protocol: SupportedProtocol;
  hooks: string;
  eventTimestamp: bigint;
  chainId: number;
  poolManagerAddress: string;
  tokenService: TokenService;
}): Promise<void> {
  let [token0Entity, token1Entity, defiPoolDataEntity]: [TokenEntity, TokenEntity, DeFiPoolDataEntity] =
    await Promise.all([
      params.tokenService.getOrCreateTokenEntity(params.context, params.chainId, params.token0Address),
      params.tokenService.getOrCreateTokenEntity(params.context, params.chainId, params.token1Address),
      params.context.DeFiPoolData.getOrCreate(defaultDeFiPoolData(params.eventTimestamp)),
    ]);

  const poolId = IndexerNetwork.getEntityIdFromAddress(params.chainId, params.poolAddress);

  const v4PoolEntity: V4PoolEntity = {
    id: poolId,
    permit2: SupportedProtocol.getPermit2Address(params.protocol, params.chainId),
    poolManager: params.poolManagerAddress,
    stateView: SupportedProtocol.getV4StateView(params.protocol, params.chainId),
    hooks: params.hooks,
    sqrtPriceX96: params.sqrtPriceX96,
    tickSpacing: params.tickSpacing,
    tick: params.tick,
  };

  const poolEntity: PoolEntity = {
    id: poolId,
    positionManager: SupportedProtocol.getV4PositionManager(params.protocol, params.chainId),
    poolAddress: params.poolAddress,
    createdAtTimestamp: params.eventTimestamp,
    currentFeeTier: params.feeTier,
    initialFeeTier: params.feeTier,
    poolType: "V4",
    protocol_id: params.protocol,
    token0_id: token0Entity.id,
    token1_id: token1Entity.id,
    algebraPoolData_id: undefined,
    totalValueLockedToken0: ZERO_BIG_DECIMAL,
    totalValueLockedToken1: ZERO_BIG_DECIMAL,
    totalValueLockedUSD: ZERO_BIG_DECIMAL,
    liquidityVolumeToken0: ZERO_BIG_DECIMAL,
    liquidityVolumeToken1: ZERO_BIG_DECIMAL,
    liquidityVolumeUSD: ZERO_BIG_DECIMAL,
    swapVolumeToken0: ZERO_BIG_DECIMAL,
    swapVolumeToken1: ZERO_BIG_DECIMAL,
    swapVolumeUSD: ZERO_BIG_DECIMAL,
    accumulatedYield24h: ZERO_BIG_DECIMAL,
    accumulatedYield7d: ZERO_BIG_DECIMAL,
    accumulatedYield30d: ZERO_BIG_DECIMAL,
    accumulatedYield90d: ZERO_BIG_DECIMAL,
    totalAccumulatedYield: ZERO_BIG_DECIMAL,
    v3PoolData_id: undefined,
    v4PoolData_id: v4PoolEntity.id,
    chainId: params.chainId,
    lastAdjustTimestamp24h: undefined,
    lastAdjustTimestamp7d: undefined,
    lastAdjustTimestamp30d: undefined,
    lastAdjustTimestamp90d: undefined,
    totalAccumulatedYield24hAgo: ZERO_BIG_DECIMAL,
    totalAccumulatedYield30dAgo: ZERO_BIG_DECIMAL,
    totalAccumulatedYield7dAgo: ZERO_BIG_DECIMAL,
    totalAccumulatedYield90dAgo: ZERO_BIG_DECIMAL,
    yearlyYield24h: ZERO_BIG_DECIMAL,
    yearlyYield30d: ZERO_BIG_DECIMAL,
    yearlyYield7d: ZERO_BIG_DECIMAL,
    yearlyYield90d: ZERO_BIG_DECIMAL,
    dataPointTimestamp24hAgo: params.eventTimestamp,
    dataPointTimestamp7dAgo: params.eventTimestamp,
    dataPointTimestamp30dAgo: params.eventTimestamp,
    dataPointTimestamp90dAgo: params.eventTimestamp,
    isDynamicFee: params.feeTier === V4_DYNAMIC_FEE_FLAG,
  };

  defiPoolDataEntity = {
    ...defiPoolDataEntity,
    poolsCount: defiPoolDataEntity.poolsCount + 1,
  };

  params.context.Token.set(token0Entity);
  params.context.Token.set(token1Entity);
  params.context.Pool.set(poolEntity);
  params.context.V4PoolData.set(v4PoolEntity);
  params.context.DeFiPoolData.set(defiPoolDataEntity);
  params.context.Protocol.set({
    id: params.protocol,
    name: SupportedProtocol.getName(params.protocol),
    logo: SupportedProtocol.getLogoUrl(params.protocol),
    url: SupportedProtocol.getUrl(params.protocol),
  });
}
