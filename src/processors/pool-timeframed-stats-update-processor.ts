import type { Pool as PoolEntity, PoolTimeframedStats } from "generated";
import type { HandlerContext } from "generated/src/Types";
import { STATS_TIMEFRAME_IN_DAYS, STATS_TIMEFRAME_IN_HOURS } from "../core/constants";
import { InitialPoolTimeframedStatsEntity } from "../core/entity";
import { YieldMath } from "../lib/math";
import { isSecondsTimestampMoreThanDaysAgo, isSecondsTimestampMoreThanHoursAgo } from "../lib/timestamp";
import { DatabaseService } from "../services/database-service";

export async function processPoolTimeframedStatsUpdate(params: {
  context: HandlerContext;
  eventTimestamp: bigint;
  poolEntity: PoolEntity;
}) {
  if (isSecondsTimestampMoreThanDaysAgo(params.eventTimestamp, 100)) return;

  const statsEntities = await DatabaseService.getAllPooltimeframedStatsEntities(params.context, params.poolEntity);

  await Promise.all(
    statsEntities.map(async (stat) => {
      if (!isSecondsTimestampMoreThanHoursAgo(stat.lastRefreshTimestamp, 1)) return;

      const timeframe = stat.timeframe;
      const isRefreshingOneDayStats = timeframe === "DAY";

      let dataAgo = await DatabaseService.getPoolHourlyDataAgo(
        STATS_TIMEFRAME_IN_HOURS[timeframe],
        params.eventTimestamp,
        params.context,
        params.poolEntity
      );

      if (!dataAgo && !isRefreshingOneDayStats) {
        dataAgo = await DatabaseService.getOldestPoolDailyDataAgo(
          STATS_TIMEFRAME_IN_DAYS[timeframe],
          params.eventTimestamp,
          params.context,
          params.poolEntity
        );
      } else if (!dataAgo) {
        dataAgo = await DatabaseService.getOldestPoolHourlyDataAgo(
          STATS_TIMEFRAME_IN_HOURS[timeframe],
          params.eventTimestamp,
          params.context,
          params.poolEntity
        );
      }

      let updatedStat: PoolTimeframedStats;

      if (dataAgo) {
        const yieldAtStart = dataAgo.accumulatedYieldAtStart;
        const accumulatedYield = params.poolEntity.accumulatedYield.minus(yieldAtStart);

        updatedStat = {
          ...stat,
          accumulatedYield: accumulatedYield,
          dataPointTimestamp: dataAgo.timestampAtStart,
          lastRefreshTimestamp: params.eventTimestamp,
          liquidityNetInflowUsd: params.poolEntity.liquidityNetInflowUsd.minus(dataAgo.liquidityNetInflowUsdAtStart),
          feesUsd: params.poolEntity.feesUsd.minus(dataAgo.feesUsdAtStart),
          swapVolumeUsd: params.poolEntity.swapVolumeUsd.minus(dataAgo.swapVolumeUsdAtStart),
          yearlyYield: YieldMath.yearlyYieldFromAccumulated({
            accumulatedYield,
            daysAccumulated: STATS_TIMEFRAME_IN_DAYS[timeframe],
            pool: params.poolEntity,
            eventTimestamp: params.eventTimestamp,
          }),
        };
      } else {
        updatedStat = new InitialPoolTimeframedStatsEntity({
          id: stat.id,
          poolId: stat.pool_id,
          timeframe: timeframe,
          dataPointTimestamp: params.eventTimestamp,
        });
      }

      params.context.PoolTimeframedStats.set(updatedStat);
    })
  );
}
