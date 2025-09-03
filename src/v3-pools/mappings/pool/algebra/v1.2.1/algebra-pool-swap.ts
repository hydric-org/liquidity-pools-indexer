import { AlgebraPool_1_2_1 } from "generated";
import { IndexerNetwork } from "../../../../../common/enums/indexer-network";
import { PoolSetters } from "../../../../../common/pool-setters";
import { handleV3PoolSwap } from "../../v3-pool-swap";
import { getPoolUpdatedWithAlgebraFees } from "../common/algebra-pool-common";

AlgebraPool_1_2_1.Swap.handler(async ({ event, context }) => {
  const poolId = IndexerNetwork.getEntityIdFromAddress(event.chainId, event.srcAddress);
  let poolEntity = await context.Pool.getOrThrow(poolId);

  const algebraPoolData = await context.AlgebraPoolData.getOrThrow(poolId);
  const token0Entity = await context.Token.getOrThrow(poolEntity.token0_id);
  const token1Entity = await context.Token.getOrThrow(poolEntity.token1_id);
  const overrideSwapFee =
    event.params.overrideFee != 0n ? Number.parseInt(event.params.overrideFee.toString()) : undefined;
  const pluginFee = Number.parseInt(event.params.pluginFee.toString());
  const swapFee = overrideSwapFee ?? poolEntity.currentFeeTier;

  let communityFeeAmount0 = event.params.amount0 * (BigInt(swapFee * algebraPoolData.communityFee) / 1000000000n);
  let communityFeeAmount1 = event.params.amount1 * (BigInt(swapFee * algebraPoolData.communityFee) / 1000000000n);

  communityFeeAmount0 = communityFeeAmount0 * 1n;
  communityFeeAmount1 = communityFeeAmount1 * 1n;

  let amount0: bigint = 0n;
  let amount1: bigint = 0n;

  if (event.params.amount0 > 0n) {
    amount0 = event.params.amount0 - communityFeeAmount0;
    amount1 = event.params.amount1;
  }

  if (event.params.amount1 > 0n) {
    amount1 = event.params.amount1 - communityFeeAmount1;
    amount0 = event.params.amount0;
  }

  poolEntity = getPoolUpdatedWithAlgebraFees({
    amount0SwapAmount: event.params.amount0,
    amount1SwapAmount: event.params.amount1,
    communityFee: algebraPoolData.communityFee,
    currentPoolEntity: poolEntity,
    pluginFee: pluginFee,
    token0: token0Entity,
    token1: token1Entity,
    overrideSwapFee: overrideSwapFee,
  });

  await handleV3PoolSwap({
    context,
    poolEntity,
    token0Entity,
    token1Entity,
    swapAmount0: amount0,
    swapAmount1: amount1,
    sqrtPriceX96: event.params.price,
    tick: BigInt(event.params.tick),
    eventTimestamp: BigInt(event.block.timestamp),
    v3PoolSetters: new PoolSetters(context, event.chainId),
    overrideSingleSwapFee: overrideSwapFee,
  });
});
