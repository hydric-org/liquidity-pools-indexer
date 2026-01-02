import { PancakeSwapV3Factory } from "generated";
import { SupportedProtocol } from "../../../core/protocol";
import { processV3PoolCreated } from "../../../processors/v3-processors/v3-pool-created-processor";

PancakeSwapV3Factory.PoolCreated.contractRegister(({ event, context }) => {
  context.addPancakeSwapV3Pool(event.params.pool);
});

PancakeSwapV3Factory.PoolCreated.handler(async ({ event, context }) => {
  await processV3PoolCreated({
    context,
    poolAddress: event.params.pool,
    token0Address: event.params.token0,
    token1Address: event.params.token1,
    feeTier: Number.parseInt(event.params.fee.toString()),
    tickSpacing: Number.parseInt(event.params.tickSpacing.toString()),
    eventTimestamp: BigInt(event.block.timestamp),
    chainId: event.chainId,
    protocol: SupportedProtocol.PANCAKE_SWAP_V3,
  });
});
