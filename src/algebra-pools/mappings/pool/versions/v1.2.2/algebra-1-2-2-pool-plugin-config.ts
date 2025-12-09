import { AlgebraPool_1_2_2 } from "generated";
import { IndexerNetwork } from "../../../../../common/enums/indexer-network";
import { handleAlgebraPoolPluginConfig } from "../../algebra-pool-plugin-config";

AlgebraPool_1_2_2.PluginConfig.handler(async ({ event, context }) => {
  const poolId = IndexerNetwork.getEntityIdFromAddress(event.chainId, event.srcAddress);

  const [algebraPoolData, poolEntity] = await Promise.all([
    context.AlgebraPoolData.getOrThrow(poolId),
    context.Pool.getOrThrow(poolId),
  ]);

  await handleAlgebraPoolPluginConfig(context, algebraPoolData, poolEntity, Number(event.params.newPluginConfig));
});
