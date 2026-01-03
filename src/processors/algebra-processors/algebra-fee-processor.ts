import type { HandlerContext } from "generated";
import { EntityId } from "../../core/entity";
import { IndexerNetwork } from "../../core/network";

export async function processAlgebraFee(params: {
  context: HandlerContext;
  poolAddress: string;
  network: IndexerNetwork;
  newFeeTier: number;
}): Promise<void> {
  const poolEntity = await params.context.Pool.getOrThrow(EntityId.fromAddress(params.network, params.poolAddress));

  params.context.Pool.set({
    ...poolEntity,
    currentFeeTier: params.newFeeTier,
  });
}
