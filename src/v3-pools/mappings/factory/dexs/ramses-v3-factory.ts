import { RamsesV3Factory } from "generated";
import { SupportedProtocol } from "../../../../common/enums/supported-protocol";
import { TokenService } from "../../../../common/services/token-service";
import { handleV3PoolCreated } from "../v3-factory";

RamsesV3Factory.PoolCreated.contractRegister(({ event, context }) => {
  context.addRamsesV3Pool(event.params.pool);
});

RamsesV3Factory.PoolCreated.handler(async ({ event, context }) => {
  await handleV3PoolCreated({
    context,
    poolAddress: event.params.pool,
    token0Address: event.params.token0,
    token1Address: event.params.token1,
    feeTier: Number(event.params.fee),
    tickSpacing: Number(event.params.tickSpacing),
    eventTimestamp: BigInt(event.block.timestamp),
    chainId: event.chainId,
    protocol: SupportedProtocol.RAMSES_V3,
    tokenService: TokenService.shared,
  });
});
