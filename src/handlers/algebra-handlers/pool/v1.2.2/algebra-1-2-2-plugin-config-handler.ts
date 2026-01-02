import { AlgebraPool_1_2_2 } from "generated";
import { processAlgebraPluginConfig } from "../../../../processors/algebra-processors/algebra-plugin-config-processor";

AlgebraPool_1_2_2.PluginConfig.handler(async ({ event, context }) => {
  await processAlgebraPluginConfig({
    context,
    network: event.chainId,
    newPluginConfig: Number(event.params.newPluginConfig),
    poolAddress: event.srcAddress,
  });
});
