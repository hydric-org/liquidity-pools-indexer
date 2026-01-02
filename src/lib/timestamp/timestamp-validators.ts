import { ONE_DAY_IN_SECONDS, ONE_HOUR_IN_SECONDS } from "../../core/constants";

export function isSecondsTimestampMoreThanDaysAgo(timestamp: bigint, days: number): boolean {
  const now = Date.now() / 1000;
  const threshold = now - days * ONE_DAY_IN_SECONDS;

  return Number(timestamp) < threshold;
}

export function isSecondsTimestampMoreThanHoursAgo(timestamp: bigint, hours: number): boolean {
  const now = Date.now() / 1000;
  const threshold = now - hours * ONE_HOUR_IN_SECONDS;

  return Number(timestamp) < threshold;
}
