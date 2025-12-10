import { AlgebraPool_1_2_0 } from "generated";
import { IndexerNetwork } from "../../../../../common/enums/indexer-network";
import { handleAlgebraPoolTickSpacing } from "../../algebra-pool-tick-spacing";

AlgebraPool_1_2_0.TickSpacing.handler(async ({ event, context }) => {
  const poolId = IndexerNetwork.getEntityIdFromAddress(event.chainId, event.srcAddress);
  const algebraPoolData = await context.AlgebraPoolData.getOrThrow(poolId);

  handleAlgebraPoolTickSpacing(context, algebraPoolData, Number(event.params.newTickSpacing));
});
