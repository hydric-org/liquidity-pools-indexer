import { AlgebraPool_1_2_2 } from "generated";
import { processAlgebraInitialize } from "../../../../processors/algebra-processors/algebra-initialize-processor";

AlgebraPool_1_2_2.Initialize.handler(async ({ event, context }) => {
  await processAlgebraInitialize({
    context,
    network: event.chainId,
    poolAddress: event.srcAddress,
    sqrtPriceX96: event.params.price,
    tick: event.params.tick,
  });
});
