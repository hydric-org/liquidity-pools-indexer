import { AlgebraPool_1_2_2 } from "generated";
import { processAlgebraSwap } from "../../../../processors/algebra-processors/algebra-swap-processor";

let _overrideSwapFee: number = 0;
let _pluginFee: number = 0;

AlgebraPool_1_2_2.SwapFee.handler(async ({ event }) => {
  _overrideSwapFee = Number(event.params.overrideFee);
  _pluginFee = Number(event.params.pluginFee);
});

AlgebraPool_1_2_2.Swap.handler(async ({ event, context }) => {
  await processAlgebraSwap({
    context,
    eventBlock: event.block,
    network: event.chainId,
    poolAddress: event.srcAddress,
    swapAmount0: event.params.amount0,
    swapAmount1: event.params.amount1,
    sqrtPriceX96: event.params.price,
    tick: BigInt(event.params.tick),
    overrideSwapFee: _overrideSwapFee,
    pluginFee: _pluginFee,
  });
});
