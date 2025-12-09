import { AlgebraPool_1_2_0 } from "generated";
import { IndexerNetwork } from "../../../../../common/enums/indexer-network";
import { handleAlgebraPoolPlugin } from "../../algebra-pool-plugin";

AlgebraPool_1_2_0.PluginEvent.handler(async ({ event, context }) => {
  const poolId = IndexerNetwork.getEntityIdFromAddress(event.chainId, event.srcAddress);
  const algebraPoolData = await context.AlgebraPoolData.getOrThrow(poolId);

  await handleAlgebraPoolPlugin(context, algebraPoolData, event.params.newPluginAddress);
});
