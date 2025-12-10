import { RamsesV3Pool } from "generated";
import { IndexerNetwork } from "../../../../../common/enums/indexer-network";

RamsesV3Pool.FeeAdjustment.handler(async ({ event, context }) => {
  const poolId = IndexerNetwork.getEntityIdFromAddress(event.chainId, event.srcAddress);
  const poolEntity = await context.Pool.getOrThrow(poolId);

  context.Pool.set({
    ...poolEntity,
    currentFeeTier: Number(event.params.newFee),
  });
});
