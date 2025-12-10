import { AlgebraPoolData as AlgebraPoolDataEntity } from "generated";
import { HandlerContext } from "generated/src/Types";

export async function handleAlgebraPoolPlugin(
  context: HandlerContext,
  algebraPoolData: AlgebraPoolDataEntity,
  newPluginAddress: string
): Promise<void> {
  algebraPoolData = {
    ...algebraPoolData,
    plugin: newPluginAddress,
  };

  context.AlgebraPoolData.set(algebraPoolData);
}
