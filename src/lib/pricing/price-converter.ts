import type { BigDecimal, Pool as PoolEntity, Token as TokenEntity } from "generated";
import { isPercentageDifferenceWithinThreshold } from "../math/percentage-math";

export const PriceConverter = {
  convertTokenAmountToTrackedUsd: _convertTokenAmountToTrackedUsd,
};

function _convertTokenAmountToTrackedUsd(params: {
  amount: BigDecimal;
  token: TokenEntity;
  comparisonToken: TokenEntity;
  poolEntity: PoolEntity;
  fallbackUsdValue: BigDecimal;
}): BigDecimal {
  if (params.token.swapsCount == 0 || params.comparisonToken.swapsCount == 0) return params.fallbackUsdValue;

  const amountInUsd = params.amount.times(params.token.trackedUsdPrice);

  const conversionRate =
    params.poolEntity.token0_id === params.token.id
      ? params.poolEntity.tokens1PerToken0
      : params.poolEntity.tokens0PerToken1;

  const amountInComparisonToken = params.amount.times(conversionRate);
  const amountInComparisonTokenUSD = amountInComparisonToken.times(params.comparisonToken.trackedUsdPrice);

  const isUSDAmountMatchingComparison = isPercentageDifferenceWithinThreshold(
    amountInUsd,
    amountInComparisonTokenUSD,
    5
  );

  return isUSDAmountMatchingComparison ? amountInUsd : params.fallbackUsdValue;
}
