import { Pool as PoolEntity, Token as TokenEntity } from "generated";
import { getRawFeeFromTokenAmount } from "../../../../../common/pool-commons";
import { formatFromTokenAmount } from "../../../../../common/token-commons";

export function getPoolUpdatedWithAlgebraFees(params: {
  currentPoolEntity: PoolEntity;
  pluginFee: number;
  communityFee: number;
  amount0SwapAmount: bigint;
  amount1SwapAmount: bigint;
  token0: TokenEntity;
  token1: TokenEntity;
  overrideSwapFee?: number;
}): PoolEntity {
  let newPool = { ...params.currentPoolEntity };
  let swapFee = params.overrideSwapFee ?? params.currentPoolEntity.currentFeeTier;

  if (params.amount0SwapAmount > 0n) {
    // const swapFeeForAmount0 = getRawFeeFromTokenAmount(params.amount0SwapAmount, swapFee);

    // let communityFeeAmount = amount0.times(
    //   BigDecimal.fromString(pool.fee.times(pool.communityFee).toString()).div(BigDecimal.fromString(""))
    // );
    // communityFeeAmount = communityFeeAmount.times(BigDecimal.fromString("1"));

    // const communityFeeAmount = params.amount0SwapAmount * (BigInt(swapFee) / 1000000000n);
    const pluginFeeForAmount0 = getRawFeeFromTokenAmount(params.amount0SwapAmount, params.pluginFee);
    // const communityFeeForAmount0 = (swapFeeForAmount0 * BigInt(params.communityFee)) / BigInt(1000);
    const algebraFeesDeducted = pluginFeeForAmount0;

    newPool = {
      ...newPool,
      totalValueLockedToken0: newPool.totalValueLockedToken0.minus(
        formatFromTokenAmount(algebraFeesDeducted, params.token0)
      ),
    };
  } else {
    // const swapFeeForAmount1 = getRawFeeFromTokenAmount(
    //   params.amount1SwapAmount,
    //   params.overrideSwapFee ?? params.currentPoolEntity.currentFeeTier
    // );
    const pluginFeeForAmount1 = getRawFeeFromTokenAmount(params.amount1SwapAmount, params.pluginFee);
    // const communityFeeForAmount1 = (swapFeeForAmount1 * BigInt(params.communityFee)) / BigInt(1000);
    const algebraFeesDeducted = pluginFeeForAmount1;

    newPool = {
      ...newPool,
      totalValueLockedToken1: newPool.totalValueLockedToken1.minus(
        formatFromTokenAmount(algebraFeesDeducted, params.token1)
      ),
    };
  }

  return newPool;
}
