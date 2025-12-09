import { BigDecimal, Pool as PoolEntity, Token as TokenEntity } from "generated";
import { ZERO_BIG_DECIMAL } from "../../common/constants";
import { getRawFeeFromTokenAmount } from "../../common/pool-commons";
import { formatFromTokenAmount } from "../../common/token-commons";
import { ALGEBRA_COMMUNITY_FEE_DENOMINATOR } from "./constants";

export function calculateAlgebraNonLPFeesAmount(params: {
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
    const swapFeeTokenAmount = getRawFeeFromTokenAmount(params.swapAmount0, params.swapFee);
    const pluginFeeTokenAmount = getRawFeeFromTokenAmount(params.swapAmount0, params.pluginFee);
    const communityFeeTokenAmount =
      (swapFeeTokenAmount * BigInt(params.communityFee)) / ALGEBRA_COMMUNITY_FEE_DENOMINATOR;
    const algebraNonLPFees = pluginFeeTokenAmount + communityFeeTokenAmount;

    return {
      token0FeeAmount: formatFromTokenAmount(algebraNonLPFees, params.token0),
      token1FeeAmount: ZERO_BIG_DECIMAL,
    };
  }

  const swapFeeTokenAmount = getRawFeeFromTokenAmount(params.swapAmount1, params.swapFee);
  const pluginFeeTokenAmount = getRawFeeFromTokenAmount(params.swapAmount1, params.pluginFee);
  const communityFeeTokenAmount =
    (swapFeeTokenAmount * BigInt(params.communityFee)) / ALGEBRA_COMMUNITY_FEE_DENOMINATOR;
  const algebraNonLPFees = pluginFeeTokenAmount + communityFeeTokenAmount;

  return {
    token0FeeAmount: ZERO_BIG_DECIMAL,
    token1FeeAmount: formatFromTokenAmount(algebraNonLPFees, params.token1),
  };
}
