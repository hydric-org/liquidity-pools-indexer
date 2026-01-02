import { UniswapV4PoolManager } from "generated";
import { SupportedProtocol } from "../../../core/protocol";
import { processV4Initialize } from "../../../processors/v4-processors/v4-initialize-processor";

UniswapV4PoolManager.Initialize.handler(async ({ event, context }) => {
  await processV4Initialize({
    context,
    poolAddress: event.params.id,
    token0Address: event.params.currency0,
    token1Address: event.params.currency1,
    feeTier: Number.parseInt(event.params.fee.toString()),
    tickSpacing: Number.parseInt(event.params.tickSpacing.toString()),
    tick: BigInt(event.params.tick),
    sqrtPriceX96: event.params.sqrtPriceX96,
    protocol: SupportedProtocol.UNISWAP_V4,
    hooks: event.params.hooks,
    eventTimestamp: BigInt(event.block.timestamp),
    chainId: event.chainId,
    poolManagerAddress: event.srcAddress,
  });
});
