import type { BigDecimal, Pool as PoolEntity } from "generated";
import { daysBetweenSecondsTimestamps } from "../timestamp";

export const YieldMath = {
  yearlyYieldFromAccumulated: _yearlyYieldFromAccumulated,
};

function _yearlyYieldFromAccumulated(params: {
  daysAccumulated: number;
  accumulatedYield: BigDecimal;
  pool: PoolEntity;
  eventTimestamp: bigint;
}): BigDecimal {
  const poolAgeInDays = daysBetweenSecondsTimestamps(params.eventTimestamp, params.pool.createdAtTimestamp);
  const effectiveDays = Math.max(Math.min(poolAgeInDays, params.daysAccumulated), 1);

  return params.accumulatedYield.times(365).div(effectiveDays);
}
