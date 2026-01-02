import { UniswapV3Pool } from "generated";
import { processLiquidityMetrics } from "../../../../processors/liquidity-metrics-processor";

UniswapV3Pool.Burn.handler(async ({ event, context }) => {
  await processLiquidityMetrics({
    amount0AddedOrRemoved: -event.params.amount0,
    amount1AddedOrRemoved: -event.params.amount1,
    context: context,
    eventTimestamp: BigInt(event.block.timestamp),
    network: event.chainId,
    poolAddress: event.srcAddress,
  });
});
