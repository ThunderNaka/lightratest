import { eachWeekOfInterval, nextSaturday } from "date-fns";

export const getDateRangeAsWeeks = (startDate: Date, endDate: Date) => {
  const weeks = eachWeekOfInterval({
    start: startDate,
    end: endDate,
  });
  return weeks.map((weekStart) => ({
    start: weekStart < startDate ? startDate : weekStart,
    end: nextSaturday(weekStart) > endDate ? endDate : nextSaturday(weekStart),
  }));
};
