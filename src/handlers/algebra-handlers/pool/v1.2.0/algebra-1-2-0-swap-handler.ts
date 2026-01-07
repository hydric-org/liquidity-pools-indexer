import { AlgebraPool_1_2_0 } from "generated";
import { processAlgebraSwap } from "../../../../processors/algebra-processors/algebra-swap-processor";

AlgebraPool_1_2_0.Swap.handler(async ({ event, context }) => {
  await processAlgebraSwap({
    context,
    eventBlock: event.block,
    network: event.chainId,
    poolAddress: event.srcAddress,
    swapAmount0: event.params.amount0,
    swapAmount1: event.params.amount1,
    sqrtPriceX96: event.params.price,
    tick: BigInt(event.params.tick),
    overrideSwapFee: Number(event.params.overrideFee),
    pluginFee: Number(event.params.pluginFee),
  });
});
