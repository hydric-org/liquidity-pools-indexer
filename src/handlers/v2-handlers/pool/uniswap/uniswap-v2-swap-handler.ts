import { UniswapV2Pool } from "generated";
import { processV2Swap } from "../../../../processors/v2-processors/v2-swap-processor";

UniswapV2Pool.Swap.handler(async ({ event, context }) => {
  await processV2Swap({
    amount0In: event.params.amount0In,
    amount0Out: event.params.amount0Out,
    amount1In: event.params.amount1In,
    amount1Out: event.params.amount1Out,
    context,
    eventBlock: event.block,
    network: event.chainId,
    poolAddress: event.srcAddress,
  });
});
