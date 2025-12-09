import { AlgebraPool_1_2_0 } from "generated";
import { IndexerNetwork } from "../../../../../common/enums/indexer-network";
import { handleAlgebraPoolInitialize } from "../../algebra-pool-initialize";

AlgebraPool_1_2_0.Initialize.handler(async ({ event, context }) => {
  const poolId = IndexerNetwork.getEntityIdFromAddress(event.chainId, event.srcAddress);
  const algebraPoolData = await context.AlgebraPoolData.getOrThrow(poolId);

  await handleAlgebraPoolInitialize({
    context,
    algebraPoolData,
    sqrtPriceX96: event.params.price,
    tick: event.params.tick,
  });
});
