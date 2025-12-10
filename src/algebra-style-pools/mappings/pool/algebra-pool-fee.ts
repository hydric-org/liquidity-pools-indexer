import { Pool as PoolEntity } from "generated";
import { HandlerContext } from "generated/src/Types";

export async function handleAlgebraPoolFee(
  context: HandlerContext,
  poolEntity: PoolEntity,
  newFeeTier: number
): Promise<void> {
  poolEntity = {
    ...poolEntity,
    currentFeeTier: newFeeTier,
  };

  context.Pool.set(poolEntity);
}
