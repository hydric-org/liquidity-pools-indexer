import type { BigDecimal, Pool as PoolEntity, Token as TokenEntity } from "generated";
import { MAX_TVL_IMBALANCE_PERCENTAGE, ZERO_BIG_DECIMAL } from "../../core/constants";
import { PriceConverter } from "../pricing/price-converter";
import { isPercentageDifferenceWithinThreshold } from "./percentage-math";
import { TokenDecimalMath } from "./token/token-decimal-math";

export function calculateLiquidityFlow(params: {
  amount0AddedOrRemoved: bigint;
  amount1AddedOrRemoved: bigint;
  token0: TokenEntity;
  token1: TokenEntity;
  pool: PoolEntity;
}): {
  inflowToken0: BigDecimal;
  inflowToken1: BigDecimal;
  outflowToken0: BigDecimal;
  outflowToken1: BigDecimal;
  netInflowToken0: BigDecimal;
  netInflowToken1: BigDecimal;
  inflowUSD: BigDecimal;
  outflowUSD: BigDecimal;
  netInflowUSD: BigDecimal;
  trackedInflowUSD: BigDecimal;
  trackedOutflowUSD: BigDecimal;
  trackedNetInflowUSD: BigDecimal;
} {
  const amount0Formatted = TokenDecimalMath.rawToDecimal(params.amount0AddedOrRemoved, params.token0);
  const amount1Formatted = TokenDecimalMath.rawToDecimal(params.amount1AddedOrRemoved, params.token1);
  const isAmount0Positive = params.amount0AddedOrRemoved > 0;
  const isAmount1Positive = params.amount1AddedOrRemoved > 0;

  const inflowToken0 = isAmount0Positive ? amount0Formatted : ZERO_BIG_DECIMAL;
  const inflowToken1 = isAmount1Positive ? amount1Formatted : ZERO_BIG_DECIMAL;
  const outflowToken0 = isAmount0Positive ? ZERO_BIG_DECIMAL : amount0Formatted.abs();
  const outflowToken1 = isAmount1Positive ? ZERO_BIG_DECIMAL : amount1Formatted.abs();
  const netInflowToken0 = amount0Formatted;
  const netInflowToken1 = amount1Formatted;

  const inflowToken0USD = inflowToken0.times(params.token0.usdPrice);
  const trackedInflowToken0USD = PriceConverter.convertTokenAmountToTrackedUsd({
    amount: inflowToken0,
    token: params.token0,
    comparisonToken: params.token1,
    poolEntity: params.pool,
    fallbackUsdValue: ZERO_BIG_DECIMAL,
  });

  const inflowToken1USD = inflowToken1.times(params.token1.usdPrice);
  const trackedInflowToken1USD = PriceConverter.convertTokenAmountToTrackedUsd({
    amount: inflowToken1,
    token: params.token1,
    comparisonToken: params.token0,
    poolEntity: params.pool,
    fallbackUsdValue: ZERO_BIG_DECIMAL,
  });

  const outflowToken0USD = outflowToken0.times(params.token0.usdPrice);
  const trackedOutflowToken0USD = PriceConverter.convertTokenAmountToTrackedUsd({
    amount: outflowToken0,
    token: params.token0,
    comparisonToken: params.token1,
    poolEntity: params.pool,
    fallbackUsdValue: ZERO_BIG_DECIMAL,
  });

  const outflowToken1USD = outflowToken1.times(params.token1.usdPrice);
  const trackedOutflowToken1USD = PriceConverter.convertTokenAmountToTrackedUsd({
    amount: outflowToken1,
    token: params.token1,
    comparisonToken: params.token0,
    poolEntity: params.pool,
    fallbackUsdValue: ZERO_BIG_DECIMAL,
  });

  const inflowUSD = inflowToken0USD.plus(inflowToken1USD);
  const trackedInflowUSD = trackedInflowToken0USD.plus(trackedInflowToken1USD);

  const outflowUSD = outflowToken0USD.plus(outflowToken1USD);
  const trackedOutflowUSD = trackedOutflowToken0USD.plus(trackedOutflowToken1USD);

  const netInflowUSD = inflowUSD.minus(outflowUSD);
  const trackedNetInflowUSD = trackedInflowUSD.minus(trackedOutflowUSD);

  return {
    inflowToken0: inflowToken0,
    inflowToken1: inflowToken1,
    outflowToken0: outflowToken0,
    outflowToken1: outflowToken1,
    netInflowToken0: netInflowToken0,
    netInflowToken1: netInflowToken1,
    inflowUSD: inflowUSD,
    outflowUSD: outflowUSD,
    netInflowUSD: netInflowUSD,
    trackedInflowUSD: trackedInflowUSD,
    trackedOutflowUSD: trackedOutflowUSD,
    trackedNetInflowUSD: trackedNetInflowUSD,
  };
}

export function calculateNewLockedAmounts(params: {
  amount0AddedOrRemoved: bigint;
  amount1AddedOrRemoved: bigint;
  poolEntity: PoolEntity;
  token0: TokenEntity;
  token1: TokenEntity;
}): {
  newPoolTotalValueLockedToken0: BigDecimal;
  newPoolTotalValueLockedToken0USD: BigDecimal;
  newPoolTotalValueLockedToken1: BigDecimal;
  newPoolTotalValueLockedToken1USD: BigDecimal;
  newPoolTotalValueLockedUSD: BigDecimal;
  newToken0TotalPooledAmount: BigDecimal;
  newToken0TotalPooledAmountUSD: BigDecimal;
  newToken1TotalPooledAmount: BigDecimal;
  newToken1TotalPooledAmountUSD: BigDecimal;
  newTrackedPoolTotalValueLockedToken0USD: BigDecimal;
  newTrackedPoolTotalValueLockedToken1USD: BigDecimal;
  newTrackedPoolTotalValueLockedUSD: BigDecimal;
  newTrackedToken0TotalPooledAmountUSD: BigDecimal;
  newTrackedToken1TotalPooledAmountUSD: BigDecimal;
} {
  const amount0Formatted = TokenDecimalMath.rawToDecimal(params.amount0AddedOrRemoved, params.token0);
  const amount1Formatted = TokenDecimalMath.rawToDecimal(params.amount1AddedOrRemoved, params.token1);

  const updatedPoolTotalValueLockedToken0 = params.poolEntity.totalValueLockedToken0.plus(amount0Formatted);
  const updatedPoolTotalValueLockedToken0USD = updatedPoolTotalValueLockedToken0.times(params.token0.usdPrice);
  const updatedTrackedPoolTotalValueLockedToken0USD = PriceConverter.convertTokenAmountToTrackedUsd({
    amount: updatedPoolTotalValueLockedToken0,
    token: params.token0,
    comparisonToken: params.token1,
    poolEntity: params.poolEntity,
    fallbackUsdValue: ZERO_BIG_DECIMAL,
  });

  const updatedPoolTotalValueLockedToken1 = params.poolEntity.totalValueLockedToken1.plus(amount1Formatted);
  const updatedPoolTotalValueLockedToken1USD = updatedPoolTotalValueLockedToken1.times(params.token1.usdPrice);
  const updatedTrackedPoolTotalValueLockedToken1USD = PriceConverter.convertTokenAmountToTrackedUsd({
    amount: updatedPoolTotalValueLockedToken1,
    token: params.token1,
    poolEntity: params.poolEntity,
    comparisonToken: params.token0,
    fallbackUsdValue: ZERO_BIG_DECIMAL,
  });

  const updatedPoolTotalValueLockedUSD = updatedPoolTotalValueLockedToken0USD.plus(
    updatedPoolTotalValueLockedToken1USD
  );

  const updatedTrackedPoolTotalValueLockedUSD = updatedTrackedPoolTotalValueLockedToken0USD.plus(
    updatedTrackedPoolTotalValueLockedToken1USD
  );

  const updatedToken0TotalPooledAmount = params.token0.tokenTotalValuePooled.plus(amount0Formatted);
  const updatedToken0TotalPooledAmountUSD = updatedToken0TotalPooledAmount.times(params.token0.usdPrice);
  const updatedToken0TrackedTotalPooledAmountUSD = PriceConverter.convertTokenAmountToTrackedUsd({
    amount: updatedToken0TotalPooledAmount,
    token: params.token0,
    poolEntity: params.poolEntity,
    comparisonToken: params.token1,
    fallbackUsdValue: params.token0.poolsCount === 1 ? ZERO_BIG_DECIMAL : params.token0.totalValuePooledUsd,
  });

  const updatedToken1TotalPooledAmount = params.token1.tokenTotalValuePooled.plus(amount1Formatted);
  const updatedToken1TotalPooledAmountUSD = updatedToken1TotalPooledAmount.times(params.token1.usdPrice);
  const updatedTrackedToken1TotalPooledAmountUSD = PriceConverter.convertTokenAmountToTrackedUsd({
    amount: updatedToken1TotalPooledAmount,
    token: params.token1,
    poolEntity: params.poolEntity,
    comparisonToken: params.token0,
    fallbackUsdValue: params.token1.poolsCount === 1 ? ZERO_BIG_DECIMAL : params.token1.totalValuePooledUsd,
  });

  const isNewTrackedTvlUsdBalanced = isPercentageDifferenceWithinThreshold(
    updatedTrackedPoolTotalValueLockedToken0USD,
    updatedTrackedPoolTotalValueLockedToken1USD,
    MAX_TVL_IMBALANCE_PERCENTAGE
  );

  return {
    newPoolTotalValueLockedToken0: updatedPoolTotalValueLockedToken0,
    newPoolTotalValueLockedToken1: updatedPoolTotalValueLockedToken1,
    newToken0TotalPooledAmount: updatedToken0TotalPooledAmount,
    newToken1TotalPooledAmount: updatedToken1TotalPooledAmount,
    newPoolTotalValueLockedToken0USD: updatedPoolTotalValueLockedToken0USD,
    newPoolTotalValueLockedToken1USD: updatedPoolTotalValueLockedToken1USD,
    newPoolTotalValueLockedUSD: updatedPoolTotalValueLockedUSD,
    newToken0TotalPooledAmountUSD: updatedToken0TotalPooledAmountUSD,
    newToken1TotalPooledAmountUSD: updatedToken1TotalPooledAmountUSD,
    ...(isNewTrackedTvlUsdBalanced
      ? {
          newTrackedPoolTotalValueLockedToken0USD: updatedTrackedPoolTotalValueLockedToken0USD,
          newTrackedPoolTotalValueLockedToken1USD: updatedTrackedPoolTotalValueLockedToken1USD,
          newTrackedPoolTotalValueLockedUSD: updatedTrackedPoolTotalValueLockedUSD,
          newTrackedToken0TotalPooledAmountUSD: updatedToken0TrackedTotalPooledAmountUSD,
          newTrackedToken1TotalPooledAmountUSD: updatedTrackedToken1TotalPooledAmountUSD,
        }
      : {
          newTrackedPoolTotalValueLockedToken0USD: ZERO_BIG_DECIMAL,
          newTrackedPoolTotalValueLockedToken1USD: ZERO_BIG_DECIMAL,
          newTrackedPoolTotalValueLockedUSD: ZERO_BIG_DECIMAL,
          newTrackedToken0TotalPooledAmountUSD: params.token0.totalValuePooledUsd,
          newTrackedToken1TotalPooledAmountUSD: params.token1.totalValuePooledUsd,
        }),
  };
}
