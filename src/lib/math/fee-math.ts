import { SWAP_FEE_DENOMINATOR } from "../../core/constants";
import { ALGEBRA_COMMUNITY_FEE_DENOMINATOR } from "../../processors/algebra-processors/utils/constants";

export const FeeMath = {
  calculateRawSwapFeeFromTokenAmount,
  convertRawSwapFeeToPercentage,
  convertRawAlgebraCommunityFeeToPercentage,
};

function calculateRawSwapFeeFromTokenAmount(rawTokenAmount: bigint, rawFee: number): bigint {
  return (rawTokenAmount * BigInt(rawFee)) / BigInt(SWAP_FEE_DENOMINATOR);
}

function convertRawSwapFeeToPercentage(rawFee: number): number {
  return rawFee / (SWAP_FEE_DENOMINATOR / 100);
}

function convertRawAlgebraCommunityFeeToPercentage(rawFee: number): number {
  return rawFee / (ALGEBRA_COMMUNITY_FEE_DENOMINATOR / 100);
}
