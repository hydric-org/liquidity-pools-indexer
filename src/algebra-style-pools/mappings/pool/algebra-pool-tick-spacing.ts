import { AlgebraPoolData as AlgebraPoolDataEntity } from "generated";
import { HandlerContext } from "generated/src/Types";

export async function handleAlgebraPoolTickSpacing(
  context: HandlerContext,
  algebraPoolData: AlgebraPoolDataEntity,
  newTickSpacing: number
): Promise<void> {
  algebraPoolData = {
    ...algebraPoolData,
    tickSpacing: Number(newTickSpacing),
  };

  context.AlgebraPoolData.set(algebraPoolData);
}
