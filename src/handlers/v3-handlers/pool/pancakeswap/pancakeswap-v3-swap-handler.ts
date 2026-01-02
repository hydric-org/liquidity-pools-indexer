import { PancakeSwapV3Pool } from "generated";
import { processV3Swap } from "../../../../processors/v3-processors/v3-swap-processor";

PancakeSwapV3Pool.Swap.handler(async ({ event, context }) => {
  await processV3Swap({
    context,
    eventTimestamp: BigInt(event.block.timestamp),
    network: event.chainId,
    poolAddress: event.srcAddress,
    amount0: event.params.amount0,
    amount1: event.params.amount1,
    sqrtPriceX96: event.params.sqrtPriceX96,
    tick: BigInt(event.params.tick),
  });
});
