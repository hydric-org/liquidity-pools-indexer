import { VelodromeSlipstreamFactory } from "generated";
import { SupportedProtocol } from "../../../../common/enums/supported-protocol";
import { TokenService } from "../../../../common/services/token-service";
import { handleV3PoolCreated } from "../v3-factory";

VelodromeSlipstreamFactory.PoolCreated.contractRegister(async ({ event, context }) => {
  context.addSlipstreamPool(event.params.pool);
});

VelodromeSlipstreamFactory.PoolCreated.handler(async ({ event, context }) => {
  await handleV3PoolCreated({
    context,
    poolAddress: event.params.pool,
    token0Address: event.params.token0,
    token1Address: event.params.token1,
    feeTier: 0,
    tickSpacing: Number.parseInt(event.params.tickSpacing.toString()),
    eventTimestamp: BigInt(event.block.timestamp),
    chainId: event.chainId,
    protocol: SupportedProtocol.VELODROME_V3,
    tokenService: TokenService.shared,
    isDynamicFee: true,
  });
});
