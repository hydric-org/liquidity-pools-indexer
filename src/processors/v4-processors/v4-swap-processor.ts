import type {
  handlerContext,
  Pool as PoolEntity,
  Token as TokenEntity,
  V4PoolData as V4PoolDataEntity,
} from "generated";
import { EntityId } from "../../core/entity";
import { IndexerNetwork } from "../../core/network";
import { ConcentratedSqrtPriceMath } from "../../lib/math";
import { processSwap } from "../swap-processor";

export async function processV4Swap(params: {
  context: handlerContext;
  poolAddress: string;
  network: IndexerNetwork;
  amount0: bigint;
  amount1: bigint;
  sqrtPriceX96: bigint;
  tick: bigint;
  swapFee: number;
  eventTimestamp: bigint;
}): Promise<void> {
  const poolId = EntityId.fromAddress(params.network, params.poolAddress);

  const [poolEntity, v4PoolDataEntity]: [PoolEntity, V4PoolDataEntity] = await Promise.all([
    params.context.Pool.getOrThrow(poolId),
    params.context.V4PoolData.getOrThrow(poolId),
  ]);

  const [token0Entity, token1Entity]: [TokenEntity, TokenEntity] = await Promise.all([
    params.context.Token.getOrThrow(poolEntity.token0_id),
    params.context.Token.getOrThrow(poolEntity.token1_id),
  ]);

  // Unlike V3, a negative amount represents that amount is being sent to the pool and vice versa, so invert the sign
  const amount0SignInverted = params.amount0 * -1n;
  const amount1SignInverted = params.amount1 * -1n;

  params.context.Pool.set({
    ...poolEntity,
    currentFeeTier: params.swapFee,
  });

  params.context.V4PoolData.set({
    ...v4PoolDataEntity,
    sqrtPriceX96: params.sqrtPriceX96,
    tick: params.tick,
  });

  await processSwap({
    amount0: amount0SignInverted,
    amount1: amount1SignInverted,
    context: params.context,
    eventTimestamp: params.eventTimestamp,
    network: params.network,
    poolAddress: params.poolAddress,
    swapFee: params.swapFee,
    newPoolPrices: ConcentratedSqrtPriceMath.convertSqrtPriceX96ToPoolPrices({
      poolToken0: token0Entity,
      poolToken1: token1Entity,
      sqrtPriceX96: params.sqrtPriceX96,
    }),
  });
}
