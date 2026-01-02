import { AlgebraPool_1_2_0 } from "generated";
import { processAlgebraTickSpacing } from "../../../../processors/algebra-processors/algebra-tick-spacing-processor";

AlgebraPool_1_2_0.TickSpacing.handler(async ({ event, context }) => {
  await processAlgebraTickSpacing({
    context,
    network: event.chainId,
    newTickSpacing: Number(event.params.newTickSpacing),
    poolAddress: event.srcAddress,
  });
});
