import type { BigDecimal } from "generated";
import { ONE_BIG_DECIMAL } from "../../../core/constants";
import type { PoolPrices } from "../../../core/types";
import { SafeMath } from "../safe-math";

export const ConstantProductPriceMath = {
  poolReservesToPrice: _poolReservesToPrice,
};

function _poolReservesToPrice(token0ReserveFormatted: BigDecimal, token1ReserveFormatted: BigDecimal): PoolPrices {
  const price = SafeMath.div(token0ReserveFormatted, token1ReserveFormatted);
  const token0PerToken1Price = price;
  const token1PerToken0Price = SafeMath.div(ONE_BIG_DECIMAL, price);

  return { tokens0PerToken1: token0PerToken1Price, tokens1PerToken0: token1PerToken0Price };
}
