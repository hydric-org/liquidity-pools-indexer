import { BigDecimal, Pool as PoolEntity, Token as TokenEntity } from "generated";
import { HUNDRED_BIG_DECIMAL, MILLION_BIG_INT, ZERO_BIG_DECIMAL } from "../../core/constants";
import { IndexerNetwork } from "../../core/network";
import { PriceConverter } from "../pricing/price-converter";
import { SafeMath } from "./safe-math";
import { TokenDecimalMath } from "./token/token-decimal-math";

export function calculateSwapVolume(params: {
  swapAmount0: BigDecimal;
  swapAmount1: BigDecimal;
  token0: TokenEntity;
  token1: TokenEntity;
  poolEntity: PoolEntity;
}): {
  readonly volumeToken0: BigDecimal;
  readonly volumeToken1: BigDecimal;
  readonly volumeUSD: BigDecimal;
  readonly volumeToken0USD: BigDecimal;
  readonly volumeToken1USD: BigDecimal;
} {
  const isToken0Output = params.swapAmount0.lt(ZERO_BIG_DECIMAL);

  const inputAmount = isToken0Output ? params.swapAmount1 : params.swapAmount0;
  const inputToken = isToken0Output ? params.token1 : params.token0;
  const compareToken = isToken0Output ? params.token0 : params.token1;
  const tvlCap = isToken0Output
    ? params.poolEntity.totalValueLockedToken1Usd
    : params.poolEntity.totalValueLockedToken0Usd;

  let volumeUsd = PriceConverter.safeConvertTokenAmountToUSD({
    amount: inputAmount,
    token: inputToken,
    comparisionToken: compareToken,
    fallbackUsdValue: ZERO_BIG_DECIMAL,
    poolEntity: params.poolEntity,
  });

  if (volumeUsd.gt(tvlCap)) volumeUsd = ZERO_BIG_DECIMAL;

  if (isToken0Output) {
    return {
      volumeUSD: volumeUsd,
      volumeToken1USD: volumeUsd,
      volumeToken1: params.swapAmount1,
      volumeToken0: ZERO_BIG_DECIMAL,
      volumeToken0USD: ZERO_BIG_DECIMAL,
    };
  }

  return {
    volumeUSD: volumeUsd,
    volumeToken0USD: volumeUsd,
    volumeToken0: params.swapAmount0,
    volumeToken1: ZERO_BIG_DECIMAL,
    volumeToken1USD: ZERO_BIG_DECIMAL,
  };
}

export function calculateSwapFees(params: {
  rawSwapAmount0: bigint;
  rawSwapAmount1: bigint;
  rawSwapFee: number;
  token0: TokenEntity;
  token1: TokenEntity;
  poolEntity: PoolEntity;
}): {
  readonly feesToken0: BigDecimal;
  readonly feesToken1: BigDecimal;
  readonly feesUSD: BigDecimal;
  readonly feesToken0USD: BigDecimal;
  readonly feesToken1USD: BigDecimal;
} {
  const isToken0Output = params.rawSwapAmount0 < 0n;

  if (isToken0Output) {
    const rawFee = calculateRawSwapFeeFromTokenAmount(params.rawSwapAmount1, params.rawSwapFee);
    const tokenFees = TokenDecimalMath.rawToDecimal(rawFee, params.token1);

    const tokenFeesUsd = PriceConverter.safeConvertTokenAmountToUSD({
      amount: tokenFees,
      token: params.token1,
      comparisionToken: params.token0,
      poolEntity: params.poolEntity,
      fallbackUsdValue: ZERO_BIG_DECIMAL,
    });

    return {
      feesToken1: tokenFees,
      feesUSD: tokenFeesUsd,
      feesToken1USD: tokenFeesUsd,
      feesToken0: ZERO_BIG_DECIMAL,
      feesToken0USD: ZERO_BIG_DECIMAL,
    };
  }

  const rawFee = calculateRawSwapFeeFromTokenAmount(params.rawSwapAmount0, params.rawSwapFee);
  const tokenFees = TokenDecimalMath.rawToDecimal(rawFee, params.token0);

  const tokenFeesUsd = PriceConverter.safeConvertTokenAmountToUSD({
    amount: tokenFees,
    token: params.token0,
    comparisionToken: params.token1,
    poolEntity: params.poolEntity,
    fallbackUsdValue: ZERO_BIG_DECIMAL,
  });

  return {
    feesToken0: tokenFees,
    feesUSD: tokenFeesUsd,
    feesToken0USD: tokenFeesUsd,
    feesToken1: ZERO_BIG_DECIMAL,
    feesToken1USD: ZERO_BIG_DECIMAL,
  };
}

export function calculateRawSwapFeeFromTokenAmount(rawTokenAmount: bigint, rawFee: number): bigint {
  return (rawTokenAmount * BigInt(rawFee)) / MILLION_BIG_INT;
}

export function calculateSwapYield(params: { swapFeesUsd: BigDecimal; poolTotalValueLockedUsd: BigDecimal }) {
  if (params.poolTotalValueLockedUsd.eq(ZERO_BIG_DECIMAL)) return ZERO_BIG_DECIMAL;

  return params.swapFeesUsd.div(params.poolTotalValueLockedUsd).times(HUNDRED_BIG_DECIMAL);
}

export function calculateSwapTokenPrices(params: {
  swapAmount0: BigDecimal;
  swapAmount1: BigDecimal;
  network: IndexerNetwork;
  currentToken0Price: BigDecimal;
  currentToken1Price: BigDecimal;
}): [token0Price: BigDecimal, token1Price: BigDecimal] {
  const abs0 = params.swapAmount0.abs();
  const abs1 = params.swapAmount1.abs();

  const valueToken0 = abs0.times(params.currentToken0Price);
  const valueToken1 = abs1.times(params.currentToken1Price);

  if (abs0.eq(ZERO_BIG_DECIMAL) || abs1.eq(ZERO_BIG_DECIMAL)) {
    return [params.currentToken0Price, params.currentToken1Price];
  }

  const paidForToken0 = SafeMath.div(valueToken1, abs0);
  const paidForToken1 = SafeMath.div(valueToken0, abs1);

  return [paidForToken0, paidForToken1];
}
