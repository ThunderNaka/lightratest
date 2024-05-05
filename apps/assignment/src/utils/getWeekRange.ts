import { add, endOfWeek, startOfWeek } from "date-fns";

export const getWeekRange = (date: Date) => {
  const weekStart = add(startOfWeek(date), { days: 1 });
  const weekEnd = add(endOfWeek(weekStart), { days: -1 });

  return {
    start: weekStart,
    end: weekEnd,
  };
};
