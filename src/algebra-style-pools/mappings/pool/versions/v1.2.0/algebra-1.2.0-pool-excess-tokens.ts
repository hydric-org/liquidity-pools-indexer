import { AlgebraPool_1_2_0, Token as TokenEntity } from "generated";
import { IndexerNetwork } from "../../../../../common/enums/indexer-network";
import { handleAlgebraPoolExcessTokens } from "../../algebra-pool-excess-tokens";

AlgebraPool_1_2_0.ExcessTokens.handler(async ({ event, context }) => {
  const poolId = IndexerNetwork.getEntityIdFromAddress(event.chainId, event.srcAddress);
  const poolEntity = await context.Pool.getOrThrow(poolId);

  const [token0Entity, token1Entity]: [TokenEntity, TokenEntity] = await Promise.all([
    context.Token.getOrThrow(poolEntity.token0_id),
    context.Token.getOrThrow(poolEntity.token1_id),
  ]);

  await handleAlgebraPoolExcessTokens({
    context,
    poolEntity,
    token0Entity: token0Entity,
    token1Entity: token1Entity,
    amount0: event.params.amount0,
    amount1: event.params.amount1,
  });
});
