import type { BigDecimal, Pool as PoolEntity, Token as TokenEntity } from "generated";
import { isPercentageDifferenceWithinThreshold } from "../math/percentage-math";

export const PriceConverter = {
  safeConvertTokenAmountToUSD: _safeConvertTokenAmountToUSD,
};

function _safeConvertTokenAmountToUSD(params: {
  amount: BigDecimal;
  token: TokenEntity;
  comparisionToken: TokenEntity;
  poolEntity: PoolEntity;
  fallbackUsdValue: BigDecimal;
}): BigDecimal {
  if (params.token.swapsCount == 0 || params.comparisionToken.swapsCount == 0) return params.fallbackUsdValue;

  const amountInUSD = params.amount.times(params.token.usdPrice);

  const conversionRate =
    params.poolEntity.token0_id === params.token.id
      ? params.poolEntity.tokens1PerToken0
      : params.poolEntity.tokens0PerToken1;

  const amountInComparisionToken = params.amount.times(conversionRate);
  const amountInComparisionTokenUSD = amountInComparisionToken.times(params.comparisionToken.usdPrice);

  const isUSDAmountMatchinComparision = isPercentageDifferenceWithinThreshold(
    amountInUSD,
    amountInComparisionTokenUSD,
    10
  );

  return isUSDAmountMatchinComparision ? amountInUSD : params.fallbackUsdValue;
}
