import { UniswapV2Factory } from "generated";
import { SupportedProtocol } from "../../../core/protocol";
import { processNewPool } from "../../../processors/new-pool-processor";

UniswapV2Factory.PairCreated.contractRegister(({ event, context }) => {
  context.addUniswapV2Pool(event.params.pair);
});

UniswapV2Factory.PairCreated.handler(async ({ event, context }) => {
  await processNewPool({
    context: context,
    eventBlock: event.block,
    rawFeeTier: 3000,
    isDynamicFee: false,
    network: event.chainId,
    poolAddress: event.params.pair,
    poolType: "V2",
    protocol: SupportedProtocol.UNISWAP_V2,
    token0Address: event.params.token0,
    token1Address: event.params.token1,
  });
});
