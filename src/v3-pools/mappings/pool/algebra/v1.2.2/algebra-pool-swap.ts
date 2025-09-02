import { AlgebraPool_1_2_2 } from "generated";
import { IndexerNetwork } from "../../../../../common/enums/indexer-network";
import { getRawFeeFromTokenAmount } from "../../../../../common/pool-commons";
import { PoolSetters } from "../../../../../common/pool-setters";
import { formatFromTokenAmount } from "../../../../../common/token-commons";
import { handleV3PoolSwap } from "../../v3-pool-swap";

let overrideSwapFee: number | undefined = undefined;
let pluginFee: number = 0;

AlgebraPool_1_2_2.SwapFee.handler(async ({ event }) => {
  overrideSwapFee = event.params.overrideFee != 0n ? Number.parseInt(event.params.overrideFee.toString()) : undefined;
  pluginFee = Number.parseInt(event.params.pluginFee.toString());
});

AlgebraPool_1_2_2.Swap.handler(async ({ event, context }) => {
  const poolId = IndexerNetwork.getEntityIdFromAddress(event.chainId, event.srcAddress);
  let poolEntity = await context.Pool.getOrThrow(poolId);

  const token0Entity = await context.Token.getOrThrow(poolEntity.token0_id);
  const token1Entity = await context.Token.getOrThrow(poolEntity.token1_id);

  // deduct algebra fees for the plugin, which is removed from the pool
  if (event.params.amount0 > 0n) {
    const pluginFeeForAmount0 = getRawFeeFromTokenAmount(event.params.amount0, pluginFee);

    poolEntity = {
      ...poolEntity,
      totalValueLockedToken0: poolEntity.totalValueLockedToken0.minus(
        formatFromTokenAmount(pluginFeeForAmount0, token0Entity)
      ),
    };
  } else {
    const pluginFeeForAmount1 = getRawFeeFromTokenAmount(event.params.amount1, pluginFee);

    poolEntity = {
      ...poolEntity,
      totalValueLockedToken1: poolEntity.totalValueLockedToken1.minus(
        formatFromTokenAmount(pluginFeeForAmount1, token1Entity)
      ),
    };
  }

  await handleV3PoolSwap({
    context,
    poolEntity,
    token0Entity,
    token1Entity,
    swapAmount0: event.params.amount0,
    swapAmount1: event.params.amount1,
    sqrtPriceX96: event.params.price,
    tick: BigInt(event.params.tick),
    eventTimestamp: BigInt(event.block.timestamp),
    v3PoolSetters: new PoolSetters(context, event.chainId),
    overrideSingleSwapFee: overrideSwapFee,
  });
});
