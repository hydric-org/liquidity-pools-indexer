import { AtlantisAlgebraFactory } from "generated";
import { ZERO_ADDRESS } from "../../../../common/constants";
import { SupportedProtocol } from "../../../../common/enums/supported-protocol";
import { TokenService } from "../../../../common/services/token-service";
import { AlgebraVersion } from "../../../common/enums/algebra-version";
import { handleAlgebraPoolCreated } from "../algebra-factory";

AtlantisAlgebraFactory.Pool.contractRegister(({ event, context }) => {
  context.addAlgebraPool_1_2_2(event.params.pool);
});

AtlantisAlgebraFactory.CustomPool.contractRegister(({ event, context }) => {
  context.addAlgebraPool_1_2_2(event.params.pool);
});

AtlantisAlgebraFactory.Pool.handler(async ({ event, context }) => {
  await handleAlgebraPoolCreated({
    context,
    poolAddress: event.params.pool,
    token0Address: event.params.token0,
    token1Address: event.params.token1,
    eventTimestamp: BigInt(event.block.timestamp),
    chainId: event.chainId,
    protocol: SupportedProtocol.ATLANTIS_ALGEBRA,
    tokenService: TokenService.shared,
    deployer: ZERO_ADDRESS,
    version: AlgebraVersion.V1_2_2,
  });
});

AtlantisAlgebraFactory.CustomPool.handler(async ({ event, context }) => {
  await handleAlgebraPoolCreated({
    context,
    poolAddress: event.params.pool,
    token0Address: event.params.token0,
    token1Address: event.params.token1,
    eventTimestamp: BigInt(event.block.timestamp),
    chainId: event.chainId,
    protocol: SupportedProtocol.ATLANTIS_ALGEBRA,
    tokenService: TokenService.shared,
    deployer: event.params.deployer,
    version: AlgebraVersion.V1_2_2,
  });
});
