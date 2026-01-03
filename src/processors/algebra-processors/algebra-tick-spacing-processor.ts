import type { HandlerContext } from "generated";
import { EntityId } from "../../core/entity";
import { IndexerNetwork } from "../../core/network";

export async function processAlgebraTickSpacing(params: {
  context: HandlerContext;
  poolAddress: string;
  network: IndexerNetwork;
  newTickSpacing: number;
}): Promise<void> {
  const algebraPoolData = await params.context.AlgebraPoolData.getOrThrow(
    EntityId.fromAddress(params.network, params.poolAddress)
  );

  params.context.AlgebraPoolData.set({
    ...algebraPoolData,
    tickSpacing: params.newTickSpacing,
  });
}
