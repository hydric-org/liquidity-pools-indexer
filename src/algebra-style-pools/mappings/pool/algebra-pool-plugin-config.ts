import { AlgebraPoolData as AlgebraPoolDataEntity, Pool as PoolEntity } from "generated";
import { HandlerContext } from "generated/src/Types";
import { ALGEBRA_POOL_DYNAMIC_FEE_FLAG } from "../../common/constants";

export async function handleAlgebraPoolPluginConfig(
  context: HandlerContext,
  algebraPoolData: AlgebraPoolDataEntity,
  poolEntity: PoolEntity,
  newPluginConfig: number
): Promise<void> {
  const isPluginDynamicFee = (newPluginConfig & ALGEBRA_POOL_DYNAMIC_FEE_FLAG) > 0;

  algebraPoolData = {
    ...algebraPoolData,
    pluginConfig: newPluginConfig,
  };

  context.Pool.set({
    ...poolEntity,
    isDynamicFee: isPluginDynamicFee,
  });

  context.AlgebraPoolData.set(algebraPoolData);
}
