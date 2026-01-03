import type { Token as TokenEntity } from "generated";
import type { HandlerContext } from "generated/src/Types";
import { EntityId } from "../core/entity";
import { IndexerNetwork } from "../core/network";
import type { PoolPrices } from "../core/types";
import { PriceDiscover } from "../lib/pricing/token-pricing";

export async function processPoolPricesUpdate(params: {
  context: HandlerContext;
  poolAddress: string;
  poolPrices: PoolPrices;
  network: IndexerNetwork;
}) {
  const poolId = EntityId.fromAddress(params.network, params.poolAddress);

  const poolEntity = await params.context.Pool.getOrThrow(poolId);
  const [token0, token1]: [TokenEntity, TokenEntity] = await Promise.all([
    params.context.Token.getOrThrow(poolEntity.token0_id),
    params.context.Token.getOrThrow(poolEntity.token1_id),
  ]);

  const [token0UsdPrice, token1UsdPrice] = PriceDiscover.discoverUsdPricesFromPoolPrices({
    network: params.network,
    poolToken0Entity: token0,
    poolToken1Entity: token1,
    poolPrices: params.poolPrices,
  });

  params.context.Pool.set({
    ...poolEntity,
    tokens0PerToken1: params.poolPrices.tokens0PerToken1,
    tokens1PerToken0: params.poolPrices.tokens1PerToken0,
  });

  params.context.Token.set({
    ...token0,
    usdPrice: token0UsdPrice,
  });

  params.context.Token.set({
    ...token1,
    usdPrice: token1UsdPrice,
  });
}
