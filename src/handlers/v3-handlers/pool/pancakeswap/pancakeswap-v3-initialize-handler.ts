import { PancakeSwapV3Pool } from "generated";
import { processV3Initialize } from "../../../../processors/v3-processors/v3-initialize-processor";

PancakeSwapV3Pool.Initialize.handler(async ({ event, context }) => {
  await processV3Initialize({
    context: context,
    network: event.chainId,
    poolAddress: event.srcAddress,
    sqrtPriceX96: event.params.sqrtPriceX96,
    tick: BigInt(event.params.tick),
  });
});
