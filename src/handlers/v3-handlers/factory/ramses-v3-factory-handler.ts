import { RamsesV3Factory } from "generated";

import { SupportedProtocol } from "../../../core/protocol";
import { processV3PoolCreated } from "../../../processors/v3-processors/v3-pool-created-processor";

RamsesV3Factory.PoolCreated.contractRegister(({ event, context }) => {
  context.addRamsesV3Pool(event.params.pool);
});

RamsesV3Factory.PoolCreated.handler(async ({ event, context }) => {
  await processV3PoolCreated({
    context,
    poolAddress: event.params.pool,
    token0Address: event.params.token0,
    token1Address: event.params.token1,
    feeTier: Number(event.params.fee),
    tickSpacing: Number(event.params.tickSpacing),
    eventTimestamp: BigInt(event.block.timestamp),
    chainId: event.chainId,
    protocol: SupportedProtocol.RAMSES_V3,
  });
});
