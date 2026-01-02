import { AlgebraPool_1_2_2 } from "generated";
import { processAlgebraLiquidityChange } from "../../../../processors/algebra-processors/algebra-liquidity-change-processor";

AlgebraPool_1_2_2.Collect.handler(async ({ event, context }) => {
  await processAlgebraLiquidityChange({
    amount0AddedOrRemoved: -event.params.amount0,
    amount1AddedOrRemoved: -event.params.amount1,
    context: context,
    eventTimestamp: BigInt(event.block.timestamp),
    network: event.chainId,
    poolAddress: event.srcAddress,
    updateMetrics: false,
  });
});
