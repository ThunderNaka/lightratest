import {
  add,
  differenceInDays,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  format,
  isThisWeek,
} from "date-fns";

import { tw } from "@lightit/shared";

const getMonthGridStyle = (startDate: Date, endDate: Date, monthStart: Date) =>
  `${Math.max(differenceInDays(monthStart, startDate), 0) + 1} / span ${
    differenceInDays(
      endDate < endOfMonth(monthStart) ? endDate : endOfMonth(monthStart),
      monthStart < startDate ? startDate : monthStart,
    ) + 1
  }`;

const getWeekGridStyle = (startDate: Date, weekStart: Date) =>
  `${Math.max(differenceInDays(weekStart, startDate), 0) + 1} / span 7`;

interface ProjectHeaderProps {
  startDate: Date;
  endDate: Date;
}

export const ProjectHeader = ({ startDate, endDate }: ProjectHeaderProps) => {
  const totalDaysColumns = differenceInDays(endDate, startDate) + 1;

  return (
    <div className="grid grid-cols-6 items-center border border-t-0 border-neutrals-medium-300 bg-white text-neutrals-dark-300">
      <div className="flex h-full items-center justify-center border-r border-neutrals-medium-300 text-center">
        <span className="m-auto text-neutrals-dark-900">Project Name</span>
      </div>
      <div className="col-span-5">
        {/* Months */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${totalDaysColumns}, minmax(0, 1fr))`,
          }}
        >
          {eachMonthOfInterval({ start: startDate, end: endDate }).map(
            (monthStart) => (
              <span
                key={monthStart.toISOString()}
                className="m-auto h-full w-full border-r border-neutrals-medium-300 py-2 text-center"
                style={{
                  gridColumn: getMonthGridStyle(startDate, endDate, monthStart),
                }}
              >
                {differenceInDays(endOfMonth(monthStart), startDate) > 7 &&
                  differenceInDays(endDate, monthStart) > 7 &&
                  format(monthStart, "MMMM")}
              </span>
            ),
          )}
        </div>
        {/* Weeks */}
        <div
          className="grid w-full items-center justify-between border-t border-neutrals-medium-300 bg-white"
          style={{
            gridTemplateColumns: `repeat(${totalDaysColumns}, minmax(0, 1fr))`,
          }}
        >
          {eachWeekOfInterval({ start: startDate, end: endDate }).map(
            (weekStart) => (
              <span
                key={weekStart.toISOString()}
                className={tw(
                  "flex-grow border-r border-neutrals-medium-300 py-2 text-center",
                  isThisWeek(weekStart) && "bg-secondary-50 text-secondary-500",
                )}
                style={{
                  gridColumn: getWeekGridStyle(startDate, weekStart),
                }}
              >
                {format(weekStart, "d")} -{" "}
                {format(add(weekStart, { days: 6 }), "d")}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
};
