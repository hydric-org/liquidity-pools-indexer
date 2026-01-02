import { AlgebraPool_1_2_2 } from "generated";
import { processAlgebraCommunityFee } from "../../../../processors/algebra-processors/algebra-community-fee-processor";

AlgebraPool_1_2_2.CommunityFee.handler(async ({ event, context }) => {
  await processAlgebraCommunityFee({
    context: context,
    network: event.chainId,
    newCommunityFee: Number(event.params.communityFeeNew),
    poolAddress: event.srcAddress,
  });
});
