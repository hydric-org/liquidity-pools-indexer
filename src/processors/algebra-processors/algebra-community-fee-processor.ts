import { HandlerContext } from "generated/src/Types";
import { EntityId } from "../../core/entity";
import { IndexerNetwork } from "../../core/network";

export async function processAlgebraCommunityFee(params: {
  context: HandlerContext;
  poolAddress: string;
  network: IndexerNetwork;
  newCommunityFee: number;
}): Promise<void> {
  const algebraPoolData = await params.context.AlgebraPoolData.getOrThrow(
    EntityId.fromAddress(params.network, params.poolAddress)
  );

  params.context.AlgebraPoolData.set({
    ...algebraPoolData,
    communityFee: params.newCommunityFee,
  });
}
