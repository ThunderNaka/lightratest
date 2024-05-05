import { endOfMonth, startOfMonth } from "date-fns";

export const getMonthRange = (date: Date) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  return {
    start: monthStart,
    end: monthEnd,
  };
};
