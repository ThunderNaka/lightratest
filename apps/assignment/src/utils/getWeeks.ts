import { add } from "date-fns";

export const getWeeks = (days: Date[]) => {
  const chunk = () =>
    Array.from({ length: Math.ceil(days.length / 7) }, (_, i) =>
      days.slice(i * 7, i * 7 + 7),
    );

  const weeks = chunk().map((week) => {
    if (week[0])
      return {
        start: week[0],
        end: add(week[0], { days: 6 }),
      };
  });

  return weeks;
};
