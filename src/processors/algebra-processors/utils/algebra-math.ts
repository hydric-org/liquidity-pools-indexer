import type { BigDecimal, Pool as PoolEntity, Token as TokenEntity } from "generated";
import { ZERO_BIG_DECIMAL } from "../../../core/constants";
import { calculateRawSwapFeeFromTokenAmount } from "../../../lib/math";
import { TokenDecimalMath } from "../../../lib/math/token/token-decimal-math";
import { ALGEBRA_COMMUNITY_FEE_DENOMINATOR } from "./constants";

export const AlgebraMath = {
  calculateAlgebraNonLPFeesAmount,
};

function calculateAlgebraNonLPFeesAmount(params: {
  poolEntity: PoolEntity;
  pluginFee: number;
  communityFee: number;
  swapAmount0: bigint;
  swapAmount1: bigint;
  token0: TokenEntity;
  token1: TokenEntity;
  swapFee: number;
}): { token0FeeAmount: BigDecimal; token1FeeAmount: BigDecimal } {
  if (params.swapAmount0 > 0n) {
    const swapFeeTokenAmount = calculateRawSwapFeeFromTokenAmount(params.swapAmount0, params.swapFee);
    const pluginFeeTokenAmount = calculateRawSwapFeeFromTokenAmount(params.swapAmount0, params.pluginFee);
    const communityFeeTokenAmount =
      (swapFeeTokenAmount * BigInt(params.communityFee)) / ALGEBRA_COMMUNITY_FEE_DENOMINATOR;
    const algebraNonLPFees = pluginFeeTokenAmount + communityFeeTokenAmount;

    return {
      token0FeeAmount: TokenDecimalMath.rawToDecimal(algebraNonLPFees, params.token0),
      token1FeeAmount: ZERO_BIG_DECIMAL,
    };
  }

  const swapFeeTokenAmount = calculateRawSwapFeeFromTokenAmount(params.swapAmount1, params.swapFee);
  const pluginFeeTokenAmount = calculateRawSwapFeeFromTokenAmount(params.swapAmount1, params.pluginFee);
  const communityFeeTokenAmount =
    (swapFeeTokenAmount * BigInt(params.communityFee)) / ALGEBRA_COMMUNITY_FEE_DENOMINATOR;
  const algebraNonLPFees = pluginFeeTokenAmount + communityFeeTokenAmount;

  return {
    token0FeeAmount: ZERO_BIG_DECIMAL,
    token1FeeAmount: TokenDecimalMath.rawToDecimal(algebraNonLPFees, params.token1),
  };
}
