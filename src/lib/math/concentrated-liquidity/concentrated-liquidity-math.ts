import { ZERO_BIG_INT } from "../../../core/constants";
import { ConcentratedSqrtPriceMath } from "./concentrated-sqrt-price-math";
import { ConcentratedTickMath } from "./concentrated-tick-math";

export const ConcentratedLiquidityMath = {
  calculateAmount0ForDelta: _calculateAmount0ForDelta,
  calculateAmount1ForDelta: _calculateAmount1ForDelta,
};

function _calculateAmount0ForDelta(
  tickLower: number,
  tickUpper: number,
  currTick: bigint,
  liquidityDelta: bigint,
  currSqrtPriceX96: bigint
): bigint {
  const sqrtRatioAX96 = ConcentratedTickMath.getSqrtRatioAtTick(tickLower);
  const sqrtRatioBX96 = ConcentratedTickMath.getSqrtRatioAtTick(tickUpper);

  let amount0 = ZERO_BIG_INT;
  const roundUp = liquidityDelta > ZERO_BIG_INT;

  if (currTick < tickLower) {
    amount0 = ConcentratedSqrtPriceMath.getAmount0Delta(sqrtRatioAX96, sqrtRatioBX96, liquidityDelta, roundUp);
  } else if (currTick < tickUpper) {
    amount0 = ConcentratedSqrtPriceMath.getAmount0Delta(currSqrtPriceX96, sqrtRatioBX96, liquidityDelta, roundUp);
  } else {
    amount0 = ZERO_BIG_INT;
  }

  return amount0;
}

function _calculateAmount1ForDelta(
  tickLower: number,
  tickUpper: number,
  currTick: bigint,
  amount: bigint,
  currSqrtPriceX96: bigint
): bigint {
  const sqrtRatioAX96 = ConcentratedTickMath.getSqrtRatioAtTick(tickLower);
  const sqrtRatioBX96 = ConcentratedTickMath.getSqrtRatioAtTick(tickUpper);

  let amount1 = ZERO_BIG_INT;
  const roundUp = amount > ZERO_BIG_INT;

  if (currTick < tickLower) {
    amount1 = ZERO_BIG_INT;
  } else if (currTick < tickUpper) {
    amount1 = ConcentratedSqrtPriceMath.getAmount1Delta(sqrtRatioAX96, currSqrtPriceX96, amount, roundUp);
  } else {
    amount1 = ConcentratedSqrtPriceMath.getAmount1Delta(sqrtRatioAX96, sqrtRatioBX96, amount, roundUp);
  }

  return amount1;
}
