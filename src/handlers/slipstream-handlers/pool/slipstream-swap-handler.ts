import { SlipstreamPool } from "generated";
import { processSlipstreamSwap } from "../../../processors/slipstream-processors/sliptream-swap-processor";

SlipstreamPool.Swap.handler(async ({ event, context }) => {
  await processSlipstreamSwap({
    amount0: event.params.amount0,
    amount1: event.params.amount1,
    context: context,
    eventTimestamp: BigInt(event.block.timestamp),
    network: event.chainId,
    poolAddress: event.srcAddress,
    sqrtPriceX96: event.params.sqrtPriceX96,
    tick: BigInt(event.params.tick),
  });
});
