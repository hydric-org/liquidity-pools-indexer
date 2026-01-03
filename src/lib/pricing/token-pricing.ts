import type { BigDecimal, Pool, Token as TokenEntity } from "generated";
import { OUTLIER_TOKEN_PRICE_PERCENT_THRESHOLD, ZERO_BIG_DECIMAL } from "../../core/constants";
import { IndexerNetwork } from "../../core/network";
import {
  findNativeToken,
  findStableToken,
  findWrappedNative,
  isNativePool,
  isStableOnlyPool,
  isVariableWithStablePool,
  isWrappedNativePool,
} from "../../core/pool";
import type { PoolPrices } from "../../core/types";
import { isPercentageDifferenceWithinThreshold } from "../math/percentage-math";
import { calculateSwapTokenPrices } from "../math/swap-math";
import { TokenDecimalMath } from "../math/token/token-decimal-math";

export const PriceDiscover = {
  discoverTokenUsdMarketPrices,
  discoverUsdPricesFromPoolPrices,
};

export function discoverTokenUsdMarketPrices(params: {
  poolToken0Entity: TokenEntity;
  poolToken1Entity: TokenEntity;
  newPoolPrices: PoolPrices;
  rawSwapAmount0: bigint;
  rawSwapAmount1: bigint;
  network: IndexerNetwork;
  pool: Pool;
}): {
  token0MarketUsdPrice: BigDecimal;
  token1MarketUsdPrice: BigDecimal;
} {
  const formattedAmount0 = TokenDecimalMath.rawToDecimal(params.rawSwapAmount0, params.poolToken0Entity);
  const formattedAmount1 = TokenDecimalMath.rawToDecimal(params.rawSwapAmount1, params.poolToken1Entity);

  const [suggestedToken0Price, suggestedToken1Price] = discoverUsdPricesFromPoolPrices({
    network: params.network,
    poolPrices: params.newPoolPrices,
    poolToken0Entity: params.poolToken0Entity,
    poolToken1Entity: params.poolToken1Entity,
  });

  const currentPrice0 = params.poolToken0Entity.usdPrice;
  const currentPrice1 = params.poolToken1Entity.usdPrice;

  const anchorPrice0 = currentPrice0.eq(ZERO_BIG_DECIMAL) ? suggestedToken0Price : currentPrice0;
  const anchorPrice1 = currentPrice1.eq(ZERO_BIG_DECIMAL) ? suggestedToken1Price : currentPrice1;

  const [token0SwapUsdPrice, token1SwapUsdPrice] = calculateSwapTokenPrices({
    network: params.network,
    swapAmount0: formattedAmount0,
    swapAmount1: formattedAmount1,
    currentToken0Price: anchorPrice0,
    currentToken1Price: anchorPrice1,
  });

  const isMarketPayingNew0Price = isPercentageDifferenceWithinThreshold(
    suggestedToken0Price,
    token0SwapUsdPrice,
    OUTLIER_TOKEN_PRICE_PERCENT_THRESHOLD
  );

  const isMarketPayingNew1Price = isPercentageDifferenceWithinThreshold(
    suggestedToken1Price,
    token1SwapUsdPrice,
    OUTLIER_TOKEN_PRICE_PERCENT_THRESHOLD
  );

  return {
    token0MarketUsdPrice: isMarketPayingNew0Price
      ? suggestedToken0Price.decimalPlaces(params.poolToken0Entity.decimals)
      : currentPrice0,
    token1MarketUsdPrice: isMarketPayingNew1Price
      ? suggestedToken1Price.decimalPlaces(params.poolToken1Entity.decimals)
      : currentPrice1,
  };
}

export function discoverUsdPricesFromPoolPrices(params: {
  poolToken0Entity: TokenEntity;
  poolToken1Entity: TokenEntity;
  poolPrices: PoolPrices;
  network: IndexerNetwork;
}): [token0Price: BigDecimal, token1Price: BigDecimal] {
  if (isVariableWithStablePool(params.poolToken0Entity, params.poolToken1Entity, params.network)) {
    const stableToken = findStableToken(params.poolToken0Entity, params.poolToken1Entity, params.network);

    if (stableToken.id == params.poolToken0Entity.id) {
      const price1 = params.poolPrices.tokens0PerToken1;
      const price0 = params.poolPrices.tokens1PerToken0.times(price1);
      return [price0, price1];
    } else {
      const price0 = params.poolPrices.tokens1PerToken0;
      const price1 = params.poolPrices.tokens0PerToken1.times(price0);
      return [price0, price1];
    }
  }

  if (isNativePool(params.poolToken0Entity, params.poolToken1Entity)) {
    const nativeToken = findNativeToken(params.poolToken0Entity, params.poolToken1Entity);

    if (nativeToken.id == params.poolToken0Entity.id) {
      return [
        params.poolToken0Entity.usdPrice,
        params.poolPrices.tokens0PerToken1.times(params.poolToken0Entity.usdPrice),
      ];
    } else {
      return [
        params.poolPrices.tokens1PerToken0.times(params.poolToken1Entity.usdPrice),
        params.poolToken1Entity.usdPrice,
      ];
    }
  }

  if (isWrappedNativePool(params.poolToken0Entity, params.poolToken1Entity, params.network)) {
    const wrappedNativeToken = findWrappedNative(params.poolToken0Entity, params.poolToken1Entity, params.network);

    if (wrappedNativeToken.id == params.poolToken0Entity.id) {
      return [
        params.poolToken0Entity.usdPrice,
        params.poolPrices.tokens0PerToken1.times(params.poolToken0Entity.usdPrice),
      ];
    } else {
      return [
        params.poolPrices.tokens1PerToken0.times(params.poolToken1Entity.usdPrice),
        params.poolToken1Entity.usdPrice,
      ];
    }
  }

  if (isStableOnlyPool(params.poolToken0Entity, params.poolToken1Entity, params.network)) {
    return [params.poolPrices.tokens1PerToken0, params.poolPrices.tokens0PerToken1];
  }

  let p0 = params.poolToken0Entity.usdPrice;
  let p1 = params.poolToken1Entity.usdPrice;

  if (!params.poolToken1Entity.usdPrice.eq(ZERO_BIG_DECIMAL)) {
    p0 = params.poolPrices.tokens1PerToken0.times(params.poolToken1Entity.usdPrice);
  }

  if (!params.poolToken0Entity.usdPrice.eq(ZERO_BIG_DECIMAL)) {
    p1 = params.poolPrices.tokens0PerToken1.times(params.poolToken0Entity.usdPrice);
  }

  return [p0, p1];
}
