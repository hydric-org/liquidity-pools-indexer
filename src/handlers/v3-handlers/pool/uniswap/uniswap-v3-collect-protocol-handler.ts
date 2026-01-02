import { UniswapV3Pool } from "generated";
import { processV3LiquidityChange } from "../../../../processors/v3-processors/v3-liquidity-change-processor";

UniswapV3Pool.CollectProtocol.handler(async ({ event, context }) => {
  await processV3LiquidityChange({
    amount0AddedOrRemoved: -event.params.amount0,
    amount1AddedOrRemoved: -event.params.amount1,
    context: context,
    eventTimestamp: BigInt(event.block.timestamp),
    network: event.chainId,
    poolAddress: event.srcAddress,
    updateMetrics: false,
  });
});
