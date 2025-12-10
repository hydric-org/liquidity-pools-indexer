import { AlgebraPool_1_2_0 } from "generated";
import { IndexerNetwork } from "../../../../../common/enums/indexer-network";
import { handleAlgebraPoolFee } from "../../algebra-pool-fee";

AlgebraPool_1_2_0.Fee.handler(async ({ event, context }) => {
  const poolId = IndexerNetwork.getEntityIdFromAddress(event.chainId, event.srcAddress);
  const poolEntity = await context.Pool.getOrThrow(poolId);

  await handleAlgebraPoolFee(context, poolEntity, Number(event.params.fee));
});
