import type { BigDecimal } from "generated";
import { ZERO_BIG_DECIMAL } from "../../core/constants";

export const SafeMath = {
  div,
  sqrt,
};

function div(a: BigDecimal, b: BigDecimal): BigDecimal {
  if (b.eq(ZERO_BIG_DECIMAL)) return ZERO_BIG_DECIMAL;

  return a.div(b);
}
function sqrt(a: BigDecimal): BigDecimal {
  if (a.lte(ZERO_BIG_DECIMAL)) return ZERO_BIG_DECIMAL;

  return a.sqrt();
}
