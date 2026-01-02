import { SlipstreamPool } from "generated";
import { processSlipstreamLiquidityChange } from "../../../processors/slipstream-processors/slipstream-liquidity-change-processor";

SlipstreamPool.Collect.handler(async ({ event, context }) => {
  await processSlipstreamLiquidityChange({
    amount0AddedOrRemoved: -event.params.amount0,
    amount1AddedOrRemoved: -event.params.amount1,
    context: context,
    eventTimestamp: BigInt(event.block.timestamp),
    network: event.chainId,
    poolAddress: event.srcAddress,
    updateMetrics: false,
  });
});
