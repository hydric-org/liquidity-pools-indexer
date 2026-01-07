import { AlgebraPool_1_2_0 } from "generated";
import { processLiquidityMetrics } from "../../../../processors/liquidity-metrics-processor";

AlgebraPool_1_2_0.Burn.handler(async ({ event, context }) => {
  await processLiquidityMetrics({
    amount0AddedOrRemoved: -event.params.amount0,
    amount1AddedOrRemoved: -event.params.amount1,
    context: context,
    eventBlock: event.block,
    network: event.chainId,
    poolAddress: event.srcAddress,
  });
});
