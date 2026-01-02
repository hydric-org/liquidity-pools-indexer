import { AethonSwapAlgebraFactory } from "generated";
import { AlgebraVersion } from "../../../core/algebra/algebra-version";
import { ZERO_ADDRESS } from "../../../core/constants";
import { SupportedProtocol } from "../../../core/protocol";
import { processAlgebraPoolCreated } from "../../../processors/algebra-processors/algebra-pool-created-processor";

AethonSwapAlgebraFactory.Pool.contractRegister(({ event, context }) => {
  context.addAlgebraPool_1_2_0(event.params.pool);
});

AethonSwapAlgebraFactory.CustomPool.contractRegister(({ event, context }) => {
  context.addAlgebraPool_1_2_0(event.params.pool);
});

AethonSwapAlgebraFactory.Pool.handler(async ({ event, context }) => {
  await processAlgebraPoolCreated({
    context,
    poolAddress: event.params.pool,
    token0Address: event.params.token0,
    token1Address: event.params.token1,
    eventTimestamp: BigInt(event.block.timestamp),
    chainId: event.chainId,
    protocol: SupportedProtocol.AETHONSWAP_ALGEBRA,
    deployer: ZERO_ADDRESS,
    version: AlgebraVersion.V1_2_0,
  });
});

AethonSwapAlgebraFactory.CustomPool.handler(async ({ event, context }) => {
  await processAlgebraPoolCreated({
    context,
    poolAddress: event.params.pool,
    token0Address: event.params.token0,
    token1Address: event.params.token1,
    eventTimestamp: BigInt(event.block.timestamp),
    chainId: event.chainId,
    protocol: SupportedProtocol.AETHONSWAP_ALGEBRA,
    deployer: event.params.deployer,
    version: AlgebraVersion.V1_2_0,
  });
});
