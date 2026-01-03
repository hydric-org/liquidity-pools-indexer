import type { HandlerContext } from "generated";
import { AlgebraVersion } from "../../core/algebra/algebra-version";
import { ZERO_ADDRESS } from "../../core/constants";
import { EntityId } from "../../core/entity";
import { IndexerNetwork } from "../../core/network";

export async function processAlgebraPlugin(params: {
  context: HandlerContext;
  poolAddress: string;
  newPluginAddress: string;
  network: IndexerNetwork;
}): Promise<void> {
  // we use get or created because this handler can be called before the factory
  let algebraPoolData = await params.context.AlgebraPoolData.getOrCreate({
    id: EntityId.fromAddress(params.network, params.poolAddress),
    communityFee: 0,
    deployer: ZERO_ADDRESS,
    plugin: ZERO_ADDRESS,
    pluginConfig: 0,
    sqrtPriceX96: 0n,
    tick: 0n,
    tickSpacing: 0,
    version: AlgebraVersion.UNKNOWN,
  });

  algebraPoolData = {
    ...algebraPoolData,
    plugin: params.newPluginAddress,
  };

  params.context.AlgebraPoolData.set(algebraPoolData);
}
