import { Pool as PoolEntity, Token as TokenEntity } from "generated";
import { HandlerContext } from "generated/src/Types";
import { formatFromTokenAmount } from "../../../common/token-commons";

export async function handleAlgebraPoolExcessTokens(params: {
  context: HandlerContext;
  poolEntity: PoolEntity;
  token0Entity: TokenEntity;
  token1Entity: TokenEntity;
  amount0: bigint;
  amount1: bigint;
}) {
  const excessAmount0Formatted = formatFromTokenAmount(params.amount0, params.token0Entity);
  const excessAmount1Formatted = formatFromTokenAmount(params.amount1, params.token1Entity);

  const updatedPoolTotalValueLockedToken0 = params.poolEntity.totalValueLockedToken0.plus(excessAmount0Formatted);
  const updatedPoolTotalValueLockedToken1 = params.poolEntity.totalValueLockedToken1.plus(excessAmount1Formatted);
  const updatedPoolTotalValueLockedUSD = updatedPoolTotalValueLockedToken0
    .times(params.token0Entity.usdPrice)
    .plus(updatedPoolTotalValueLockedToken1.times(params.token1Entity.usdPrice));

  const updatedToken0TotalTokenPooledAmount = params.token0Entity.totalTokenPooledAmount.plus(excessAmount0Formatted);
  const updatedToken1TotalTokenPooledAmount = params.token1Entity.totalTokenPooledAmount.plus(excessAmount1Formatted);

  const updatedToken0TotalValuePooledUsd = updatedToken0TotalTokenPooledAmount.times(params.token0Entity.usdPrice);
  const updatedToken1TotalValuePooledUsd = updatedToken1TotalTokenPooledAmount.times(params.token1Entity.usdPrice);

  params.poolEntity = {
    ...params.poolEntity,
    totalValueLockedToken0: updatedPoolTotalValueLockedToken0,
    totalValueLockedToken1: updatedPoolTotalValueLockedToken1,
    totalValueLockedUSD: updatedPoolTotalValueLockedUSD,
  };

  params.token0Entity = {
    ...params.token0Entity,
    totalTokenPooledAmount: updatedToken0TotalTokenPooledAmount,
    totalValuePooledUsd: updatedToken0TotalValuePooledUsd,
  };

  params.token1Entity = {
    ...params.token1Entity,
    totalTokenPooledAmount: updatedToken1TotalTokenPooledAmount,
    totalValuePooledUsd: updatedToken1TotalValuePooledUsd,
  };

  params.context.Pool.set(params.poolEntity);
  params.context.Token.set(params.token0Entity);
  params.context.Token.set(params.token1Entity);
}
