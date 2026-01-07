import { UniswapV2Pool } from "generated";
import { processV2Sync } from "../../../../processors/v2-processors/v2-sync-processor";

UniswapV2Pool.Sync.handler(async ({ event, context }) => {
  await processV2Sync({
    context: context,
    eventBlock: event.block,
    network: event.chainId,
    poolAddress: event.srcAddress,
    reserve0: event.params.reserve0,
    reserve1: event.params.reserve1,
  });
});
