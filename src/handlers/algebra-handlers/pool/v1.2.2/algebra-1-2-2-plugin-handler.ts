import { AlgebraPool_1_2_2 } from "generated";
import { processAlgebraPlugin } from "../../../../processors/algebra-processors/algebra-plugin-processor";

AlgebraPool_1_2_2.PluginEvent.handler(async ({ event, context }) => {
  await processAlgebraPlugin({
    context,
    network: event.chainId,
    newPluginAddress: event.params.newPluginAddress,
    poolAddress: event.srcAddress,
  });
});
