import type { handlerContext } from "generated";
import { AlgebraVersion } from "../../core/algebra/algebra-version";
import { ZERO_ADDRESS } from "../../core/constants";
import { EntityId } from "../../core/entity";
import { SupportedProtocol } from "../../core/protocol";
import { processNewPool } from "../new-pool-processor";

export async function processAlgebraPoolCreated(params: {
  context: handlerContext;
  poolAddress: string;
  token0Address: string;
  token1Address: string;
  eventTimestamp: bigint;
  chainId: number;
  protocol: SupportedProtocol;
  deployer: string;
  version: AlgebraVersion;
}): Promise<void> {
  const poolId = EntityId.fromAddress(params.chainId, params.poolAddress);

  // we use get or create because it can be created before the factory at algebra-plugin-handler
  let algebraPoolData = await params.context.AlgebraPoolData.getOrCreate({
    id: poolId,
    communityFee: 0,
    pluginConfig: 0,
    sqrtPriceX96: 0n,
    tick: 0n,
    tickSpacing: 0,
    plugin: ZERO_ADDRESS,
    deployer: ZERO_ADDRESS,
    version: ZERO_ADDRESS,
  });

  algebraPoolData = {
    ...algebraPoolData,
    version: params.version,
    deployer: params.deployer,
  };

  params.context.AlgebraPoolData.set(algebraPoolData);

  await processNewPool({
    context: params.context,
    eventTimestamp: params.eventTimestamp,
    feeTier: 0,
    isDynamicFee: false,
    network: params.chainId,
    poolAddress: params.poolAddress,
    poolType: "ALGEBRA",
    protocol: params.protocol,
    token0Address: params.token0Address,
    token1Address: params.token1Address,
  });
}
