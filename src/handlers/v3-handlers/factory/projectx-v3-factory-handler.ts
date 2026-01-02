import { ProjectXV3Factory } from "generated";
import { SupportedProtocol } from "../../../core/protocol";
import { processV3PoolCreated } from "../../../processors/v3-processors/v3-pool-created-processor";

ProjectXV3Factory.PoolCreated.contractRegister(({ event, context }) => {
  context.addUniswapV3Pool(event.params.pool);
});

ProjectXV3Factory.PoolCreated.handler(async ({ event, context }) => {
  await processV3PoolCreated({
    context,
    poolAddress: event.params.pool,
    token0Address: event.params.token0,
    token1Address: event.params.token1,
    feeTier: Number.parseInt(event.params.fee.toString()),
    tickSpacing: Number.parseInt(event.params.tickSpacing.toString()),
    eventTimestamp: BigInt(event.block.timestamp),
    chainId: event.chainId,
    protocol: SupportedProtocol.PROJECT_X_V3,
  });
});
