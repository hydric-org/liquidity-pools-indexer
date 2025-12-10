import { AlgebraPool_1_2_0 } from "generated";
import { IndexerNetwork } from "../../../../../common/enums/indexer-network";
import { handleAlgebraCommunityFee } from "../../algebra-pool-community-fee";

AlgebraPool_1_2_0.CommunityFee.handler(async ({ event, context }) => {
  const poolId = IndexerNetwork.getEntityIdFromAddress(event.chainId, event.srcAddress);
  const algebraPoolData = await context.AlgebraPoolData.getOrThrow(poolId);

  await handleAlgebraCommunityFee(context, algebraPoolData, Number(event.params.communityFeeNew));
});
