import { add, endOfMonth, startOfMonth } from "date-fns";

export const getQuarterRange = (date: Date) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(add(monthStart, { months: 2 }));

  return {
    start: monthStart,
    end: monthEnd,
  };
};
