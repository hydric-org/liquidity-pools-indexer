import { AerodromeSlipstreamFactory } from "generated";
import { SupportedProtocol } from "../../../core/protocol";
import { processSlipstreamPoolCreated } from "../../../processors/slipstream-processors/slipstream-pool-created-processor";

AerodromeSlipstreamFactory.PoolCreated.contractRegister(({ event, context }) => {
  context.addSlipstreamPool(event.params.pool);
});

AerodromeSlipstreamFactory.PoolCreated.handler(async ({ event, context }) => {
  await processSlipstreamPoolCreated({
    context,
    poolAddress: event.params.pool,
    token0Address: event.params.token0,
    token1Address: event.params.token1,
    tickSpacing: Number.parseInt(event.params.tickSpacing.toString()),
    eventTimestamp: BigInt(event.block.timestamp),
    chainId: event.chainId,
    protocol: SupportedProtocol.AERODROME_V3,
  });
});
