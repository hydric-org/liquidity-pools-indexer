import type { Block_t, HandlerContext } from "generated";
import { IndexerNetwork } from "../../core/network";
import { processLiquidityChange } from "../liquidity-change-processor";

export async function processV3LiquidityChange(params: {
  context: HandlerContext;
  poolAddress: string;
  network: IndexerNetwork;
  amount0AddedOrRemoved: bigint;
  amount1AddedOrRemoved: bigint;
  eventBlock: Block_t;
  updateMetrics: boolean;
}): Promise<void> {
  await processLiquidityChange({
    updateMetrics: params.updateMetrics,
    amount0AddedOrRemoved: params.amount0AddedOrRemoved,
    amount1AddedOrRemoved: params.amount1AddedOrRemoved,
    context: params.context,
    eventBlock: params.eventBlock,
    network: params.network,
    poolAddress: params.poolAddress,
  });
}
