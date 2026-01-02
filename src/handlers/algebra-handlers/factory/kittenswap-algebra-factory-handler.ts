import { KittenSwapAlgebraFactory } from "generated";
import { AlgebraVersion } from "../../../core/algebra/algebra-version";
import { ZERO_ADDRESS } from "../../../core/constants";
import { SupportedProtocol } from "../../../core/protocol";
import { processAlgebraPoolCreated } from "../../../processors/algebra-processors/algebra-pool-created-processor";

KittenSwapAlgebraFactory.Pool.contractRegister(({ event, context }) => {
  context.addAlgebraPool_1_2_2(event.params.pool);
});

KittenSwapAlgebraFactory.CustomPool.contractRegister(({ event, context }) => {
  context.addAlgebraPool_1_2_2(event.params.pool);
});

KittenSwapAlgebraFactory.Pool.handler(async ({ event, context }) => {
  await processAlgebraPoolCreated({
    context,
    poolAddress: event.params.pool,
    token0Address: event.params.token0,
    token1Address: event.params.token1,
    eventTimestamp: BigInt(event.block.timestamp),
    chainId: event.chainId,
    protocol: SupportedProtocol.KITTENSWAP_ALGEBRA,
    deployer: ZERO_ADDRESS,
    version: AlgebraVersion.V1_2_2,
  });
});

KittenSwapAlgebraFactory.CustomPool.handler(async ({ event, context }) => {
  await processAlgebraPoolCreated({
    context,
    poolAddress: event.params.pool,
    token0Address: event.params.token0,
    token1Address: event.params.token1,
    eventTimestamp: BigInt(event.block.timestamp),
    chainId: event.chainId,
    protocol: SupportedProtocol.KITTENSWAP_ALGEBRA,
    deployer: event.params.deployer,
    version: AlgebraVersion.V1_2_2,
  });
});
