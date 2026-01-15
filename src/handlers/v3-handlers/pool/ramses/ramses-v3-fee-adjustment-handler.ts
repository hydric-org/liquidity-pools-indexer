import { RamsesV3Pool } from "generated";
import { EntityId } from "../../../../core/entity";
import { FeeMath } from "../../../../lib/math/fee-math";

RamsesV3Pool.FeeAdjustment.handler(async ({ event, context }) => {
  const poolId = EntityId.fromAddress(event.chainId, event.srcAddress);
  const poolEntity = await context.Pool.getOrThrow(poolId);
  const newRawFeeTier = Number(event.params.newFee);

  context.Pool.set({
    ...poolEntity,
    rawCurrentFeeTier: newRawFeeTier,
    currentFeeTierPercentage: FeeMath.convertRawSwapFeeToPercentage(newRawFeeTier),
  });
});
