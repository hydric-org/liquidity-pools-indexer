import { PancakeSwapV4CLPoolManager } from "generated";

import { SupportedProtocol } from "../../../core/protocol";
import { processV4Initialize } from "../../../processors/v4-processors/v4-initialize-processor";
import { PancakeSwapV4CLUtils } from "./utils/pancakeswap-v4-cl-utils";

PancakeSwapV4CLPoolManager.Initialize.handler(async ({ event, context }) => {
  await processV4Initialize({
    context,
    poolAddress: event.params.id,
    token0Address: event.params.currency0,
    token1Address: event.params.currency1,
    feeTier: Number.parseInt(event.params.fee.toString()),
    tickSpacing: PancakeSwapV4CLUtils.getPoolTickSpacingFromParameters(event.params.parameters as `0x${string}`),
    tick: BigInt(event.params.tick),
    sqrtPriceX96: event.params.sqrtPriceX96,
    protocol: SupportedProtocol.PANCAKESWAP_INFINITY_CL,
    hooks: event.params.hooks,
    eventTimestamp: BigInt(event.block.timestamp),
    chainId: event.chainId,
    poolManagerAddress: event.srcAddress,
  });
});
