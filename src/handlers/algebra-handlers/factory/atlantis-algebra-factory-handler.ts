import { AtlantisAlgebraFactory } from "generated";
import { AlgebraVersion } from "../../../core/algebra/algebra-version";
import { ZERO_ADDRESS } from "../../../core/constants";
import { SupportedProtocol } from "../../../core/protocol";
import { processAlgebraPoolCreated } from "../../../processors/algebra-processors/algebra-pool-created-processor";

AtlantisAlgebraFactory.Pool.contractRegister(({ event, context }) => {
  context.addAlgebraPool_1_2_2(event.params.pool);
});

AtlantisAlgebraFactory.CustomPool.contractRegister(({ event, context }) => {
  context.addAlgebraPool_1_2_2(event.params.pool);
});

AtlantisAlgebraFactory.Pool.handler(async ({ event, context }) => {
  await processAlgebraPoolCreated({
    context,
    poolAddress: event.params.pool,
    token0Address: event.params.token0,
    token1Address: event.params.token1,
    eventBlock: event.block,
    chainId: event.chainId,
    protocol: SupportedProtocol.ATLANTIS_ALGEBRA,
    deployer: ZERO_ADDRESS,
    version: AlgebraVersion.V1_2_2,
  });
});

AtlantisAlgebraFactory.CustomPool.handler(async ({ event, context }) => {
  await processAlgebraPoolCreated({
    context,
    poolAddress: event.params.pool,
    token0Address: event.params.token0,
    token1Address: event.params.token1,
    eventBlock: event.block,
    chainId: event.chainId,
    protocol: SupportedProtocol.ATLANTIS_ALGEBRA,
    deployer: event.params.deployer,
    version: AlgebraVersion.V1_2_2,
  });
});
