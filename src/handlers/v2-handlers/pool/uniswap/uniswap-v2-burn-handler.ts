import { UniswapV2Pool } from "generated";
import { processLiquidityChange } from "../../../../processors/liquidity-change-processor";

UniswapV2Pool.Burn.handler(async ({ event, context }) => {
  await processLiquidityChange({
    amount0AddedOrRemoved: -event.params.amount0,
    amount1AddedOrRemoved: -event.params.amount1,
    context: context,
    eventTimestamp: BigInt(event.block.timestamp),
    network: event.chainId,
    poolAddress: event.srcAddress,
    updateMetrics: true,
  });
});
