import { AlgebraPool_1_2_2 } from "generated";
import { processAlgebraFee } from "../../../../processors/algebra-processors/algebra-fee-processor";

AlgebraPool_1_2_2.Fee.handler(async ({ event, context }) => {
  await processAlgebraFee({
    context: context,
    network: event.chainId,
    newFeeTier: Number(event.params.fee),
    poolAddress: event.srcAddress,
  });
});
