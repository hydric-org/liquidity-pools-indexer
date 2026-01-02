import { BigDecimal, Pool as PoolEntity, Token as TokenEntity } from "generated";
import { ZERO_BIG_DECIMAL } from "../../core/constants";
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

  const inflowToken0USD = PriceConverter.safeConvertTokenAmountToUSD({
    amount: inflowToken0,
    token: params.token0,
    comparisionToken: params.token1,
    poolEntity: params.pool,
    fallbackUsdValue: ZERO_BIG_DECIMAL,
  });

  const inflowToken1USD = PriceConverter.safeConvertTokenAmountToUSD({
    amount: inflowToken1,
    token: params.token1,
    comparisionToken: params.token0,
    poolEntity: params.pool,
    fallbackUsdValue: ZERO_BIG_DECIMAL,
  });

  const outflowToken0USD = PriceConverter.safeConvertTokenAmountToUSD({
    amount: outflowToken0,
    token: params.token0,
    comparisionToken: params.token1,
    poolEntity: params.pool,
    fallbackUsdValue: ZERO_BIG_DECIMAL,
  });

  const outflowToken1USD = PriceConverter.safeConvertTokenAmountToUSD({
    amount: outflowToken1,
    token: params.token1,
    comparisionToken: params.token0,
    poolEntity: params.pool,
    fallbackUsdValue: ZERO_BIG_DECIMAL,
  });

  const inflowUSD = inflowToken0USD.plus(inflowToken1USD);
  const outflowUSD = outflowToken0USD.plus(outflowToken1USD);
  const netInflowUSD = inflowUSD.minus(outflowUSD);

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
} {
  const amount0Formatted = TokenDecimalMath.rawToDecimal(params.amount0AddedOrRemoved, params.token0);
  const amount1Formatted = TokenDecimalMath.rawToDecimal(params.amount1AddedOrRemoved, params.token1);

  const updatedPoolTotalValueLockedToken0 = params.poolEntity.totalValueLockedToken0.plus(amount0Formatted);
  const updatedPoolTotalValueLockedToken0USD = PriceConverter.safeConvertTokenAmountToUSD({
    amount: updatedPoolTotalValueLockedToken0,
    token: params.token0,
    comparisionToken: params.token1,
    poolEntity: params.poolEntity,
    fallbackUsdValue: ZERO_BIG_DECIMAL,
  });

  const updatedPoolTotalValueLockedToken1 = params.poolEntity.totalValueLockedToken1.plus(amount1Formatted);
  const updatedPoolTotalValueLockedToken1USD = PriceConverter.safeConvertTokenAmountToUSD({
    amount: updatedPoolTotalValueLockedToken1,
    token: params.token1,
    poolEntity: params.poolEntity,
    comparisionToken: params.token0,
    fallbackUsdValue: ZERO_BIG_DECIMAL,
  });

  const updatedPoolTotalValueLockedUSD = updatedPoolTotalValueLockedToken0USD.plus(
    updatedPoolTotalValueLockedToken1USD
  );

  const updatedToken0TotalPooledAmount = params.token0.tokenTotalValuePooled.plus(amount0Formatted);
  const updatedToken0TotalPooledAmountUSD = PriceConverter.safeConvertTokenAmountToUSD({
    amount: updatedToken0TotalPooledAmount,
    token: params.token0,
    poolEntity: params.poolEntity,
    comparisionToken: params.token1,
    fallbackUsdValue: params.token0.poolsCount === 1 ? ZERO_BIG_DECIMAL : params.token0.totalValuePooledUsd,
  });

  const updatedToken1TotalPooledAmount = params.token1.tokenTotalValuePooled.plus(amount1Formatted);
  const updatedToken1TotalPooledAmountUSD = PriceConverter.safeConvertTokenAmountToUSD({
    amount: updatedToken1TotalPooledAmount,
    token: params.token1,
    poolEntity: params.poolEntity,
    comparisionToken: params.token0,
    fallbackUsdValue: params.token1.poolsCount === 1 ? ZERO_BIG_DECIMAL : params.token1.totalValuePooledUsd,
  });

  const isNewTvlUsdBalanced = isPercentageDifferenceWithinThreshold(
    updatedPoolTotalValueLockedToken0USD,
    updatedPoolTotalValueLockedToken1USD,
    100_000
  );

  return {
    newPoolTotalValueLockedToken0: updatedPoolTotalValueLockedToken0,
    newPoolTotalValueLockedToken1: updatedPoolTotalValueLockedToken1,
    newToken0TotalPooledAmount: updatedToken0TotalPooledAmount,
    newToken1TotalPooledAmount: updatedToken1TotalPooledAmount,
    ...(isNewTvlUsdBalanced
      ? {
          newPoolTotalValueLockedToken0USD: updatedPoolTotalValueLockedToken0USD,
          newPoolTotalValueLockedToken1USD: updatedPoolTotalValueLockedToken1USD,
          newPoolTotalValueLockedUSD: updatedPoolTotalValueLockedUSD,
          newToken0TotalPooledAmountUSD: updatedToken0TotalPooledAmountUSD,
          newToken1TotalPooledAmountUSD: updatedToken1TotalPooledAmountUSD,
        }
      : {
          newPoolTotalValueLockedToken0USD: ZERO_BIG_DECIMAL,
          newPoolTotalValueLockedToken1USD: ZERO_BIG_DECIMAL,
          newPoolTotalValueLockedUSD: ZERO_BIG_DECIMAL,
          newToken0TotalPooledAmountUSD: params.token0.totalValuePooledUsd,
          newToken1TotalPooledAmountUSD: params.token1.totalValuePooledUsd,
        }),
  };
}
