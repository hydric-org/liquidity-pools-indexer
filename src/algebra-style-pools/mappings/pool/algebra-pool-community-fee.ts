import { AlgebraPoolData as AlgebraPoolDataEntity } from "generated";
import { HandlerContext } from "generated/src/Types";

export async function handleAlgebraCommunityFee(
  context: HandlerContext,
  algebraPoolData: AlgebraPoolDataEntity,
  newCommunityFee: number
): Promise<void> {
  algebraPoolData = {
    ...algebraPoolData,
    communityFee: newCommunityFee,
  };

  context.AlgebraPoolData.set(algebraPoolData);
}
