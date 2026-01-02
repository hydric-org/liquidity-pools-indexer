import { handlerContext } from "generated";
import { EntityId } from "../../core/entity";
import { SupportedProtocol } from "../../core/protocol";
import { ConcentratedSqrtPriceMath } from "../../lib/math";
import { processNewPool } from "../new-pool-processor";
import { processPoolPricesUpdate } from "../pool-prices-update-processor";
import { V4Permit2Address } from "./utils/addresses/v4-permit2-address";
import { V4StateViewAddress } from "./utils/addresses/v4-state-view-address";
import { V4PoolConstants } from "./utils/constants";

export async function processV4Initialize(params: {
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
}): Promise<void> {
  const poolId = EntityId.fromAddress(params.chainId, params.poolAddress);

  params.context.V4PoolData.set({
    id: poolId,
    poolManager: params.poolManagerAddress,
    hooks: params.hooks,
    sqrtPriceX96: params.sqrtPriceX96,
    tickSpacing: params.tickSpacing,
    tick: params.tick,
    permit2: V4Permit2Address.forProtocol({
      network: params.chainId,
      protocol: params.protocol,
    }),
    stateView: V4StateViewAddress.forProtocol({
      network: params.chainId,
      protocol: params.protocol,
    }),
  });

  const { token0Entity, token1Entity } = await processNewPool({
    poolAddress: params.poolAddress,
    context: params.context,
    eventTimestamp: params.eventTimestamp,
    feeTier: params.feeTier,
    isDynamicFee: params.feeTier === V4PoolConstants.V4_DYNAMIC_FEE_FLAG,
    network: params.chainId,
    poolType: "V4",
    protocol: params.protocol,
    token0Address: params.token0Address,
    token1Address: params.token1Address,
  });

  await processPoolPricesUpdate({
    context: params.context,
    network: params.chainId,
    poolAddress: params.poolAddress,
    poolPrices: ConcentratedSqrtPriceMath.convertSqrtPriceX96ToPoolPrices({
      poolToken0: token0Entity,
      poolToken1: token1Entity,
      sqrtPriceX96: params.sqrtPriceX96,
    }),
  });
}
