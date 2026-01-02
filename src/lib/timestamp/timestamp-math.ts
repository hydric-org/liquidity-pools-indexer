import { ONE_DAY_IN_SECONDS, ONE_HOUR_IN_SECONDS } from "../../core/constants";

export function subtractHoursFromSecondsTimestamp(timestamp: bigint, hours: number): bigint {
  return timestamp - BigInt(ONE_HOUR_IN_SECONDS * hours);
}

export function subtractDaysFromSecondsTimestamp(timestamp: bigint, days: number): bigint {
  return timestamp - BigInt(ONE_DAY_IN_SECONDS * days);
}

export function daysBetweenSecondsTimestamps(timestamp1: bigint, timestamp2: bigint): number {
  const timestampDifference = Number(timestamp1 - timestamp2);

  return Math.abs(timestampDifference) / ONE_DAY_IN_SECONDS;
}
