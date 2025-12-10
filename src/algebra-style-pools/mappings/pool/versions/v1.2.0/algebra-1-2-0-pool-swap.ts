import {
  AlgebraPool_1_2_0,
  AlgebraPoolData as AlgebraPoolEntity,
  Pool as PoolEntity,
  Token as TokenEntity,
} from "generated";
import { IndexerNetwork } from "../../../../../common/enums/indexer-network";
import { PoolSetters } from "../../../../../common/pool-setters";
import { handleAlgebraPoolSwap } from "../../algebra-pool-swap";

AlgebraPool_1_2_0.Swap.handler(async ({ event, context }) => {
  const poolId = IndexerNetwork.getEntityIdFromAddress(event.chainId, event.srcAddress);

  const [poolEntity, algebraPoolData]: [PoolEntity, AlgebraPoolEntity] = await Promise.all([
    context.Pool.getOrThrow(poolId),
    context.AlgebraPoolData.getOrThrow(poolId),
  ]);

  const [token0Entity, token1Entity]: [TokenEntity, TokenEntity] = await Promise.all([
    context.Token.getOrThrow(poolEntity.token0_id),
    context.Token.getOrThrow(poolEntity.token1_id),
  ]);

  await handleAlgebraPoolSwap({
    context,
    poolEntity,
    algebraPoolEntity: algebraPoolData,
    token0Entity,
    token1Entity,
    pluginFee: Number(event.params.pluginFee),
    swapAmount0: event.params.amount0,
    swapAmount1: event.params.amount1,
    sqrtPriceX96: event.params.price,
    tick: BigInt(event.params.tick),
    eventTimestamp: BigInt(event.block.timestamp),
    algebraPoolSetters: new PoolSetters(context, event.chainId),
    overrideSwapFee: Number(event.params.overrideFee),
  });
});
