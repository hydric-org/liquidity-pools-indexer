import { RamsesV3Pool } from "generated";
import { EntityId } from "../../../../core/entity";

RamsesV3Pool.FeeAdjustment.handler(async ({ event, context }) => {
  const poolId = EntityId.fromAddress(event.chainId, event.srcAddress);
  const poolEntity = await context.Pool.getOrThrow(poolId);

  context.Pool.set({
    ...poolEntity,
    currentFeeTier: Number(event.params.newFee),
  });
});
