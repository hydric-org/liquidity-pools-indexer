import { SlipstreamPool } from "generated";
import { processSlipstreamInitialize } from "../../../processors/slipstream-processors/slipstream-initialize-processor";

SlipstreamPool.Initialize.handler(async ({ event, context }) => {
  await processSlipstreamInitialize({
    context: context,
    network: event.chainId,
    poolAddress: event.srcAddress,
    sqrtPriceX96: event.params.sqrtPriceX96,
    tick: event.params.tick,
  });
});
