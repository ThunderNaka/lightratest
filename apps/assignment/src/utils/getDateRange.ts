import { TIME_INTERVAL } from "~/shared.constants";
import type { TimeInterval } from "~/shared.types";
import { getMonthRange } from "./getMonthRange";
import { getQuarterRange } from "./getQuarterRange";
import { getWeekRange } from "./getWeekRange";

export const getDateRange = (range: TimeInterval, startDate: Date) => {
  switch (range) {
    case TIME_INTERVAL.QUARTER:
      return getQuarterRange(startDate);
    case TIME_INTERVAL.MONTH:
      return getMonthRange(startDate);
    case TIME_INTERVAL.WEEK:
      return getWeekRange(startDate);
  }
};
