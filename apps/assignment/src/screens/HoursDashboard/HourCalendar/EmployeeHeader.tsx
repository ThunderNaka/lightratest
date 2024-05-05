import { useQuery } from "@tanstack/react-query";
import {
  differenceInDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isToday,
  isWeekend,
} from "date-fns";

import { tw } from "@lightit/shared";
import { icons, Tooltip } from "@lightit/ui";

import { getHolidays } from "~/api/holidays";
import { isHoliday } from "~/screens/EmployeeOverview/EmployeeHoursGraph";
import type { Assignment } from "~/shared.types";
import { errorToast, parseBackendDate } from "~/utils";

const getMonthGridStyle = (startDate: Date, endDate: Date, monthStart: Date) =>
  `${Math.max(differenceInDays(monthStart, startDate), 0) + 1} / span ${
    differenceInDays(
      endDate < endOfMonth(monthStart) ? endDate : endOfMonth(monthStart),
      monthStart < startDate ? startDate : monthStart,
    ) + 1
  }`;

const getDayGridStyle = (startDate: Date, day: Date) =>
  `${Math.max(differenceInDays(day, startDate), 0) + 1} / span 1`;

interface EmployeeHeaderProps {
  startDate: Date;
  endDate: Date;
  noName?: boolean;
  assignments?: Assignment[];
  dailyHours?: number;
}

export const EmployeeHeader = ({
  startDate,
  endDate,
  noName = false,
  assignments,
  dailyHours,
}: EmployeeHeaderProps) => {
  const { data: holidays } = useQuery({
    queryFn: getHolidays,
    queryKey: ["getHolidays"],
    onError: errorToast,
  });

  const totalDaysColumns = differenceInDays(endDate, startDate) + 1;

  const remainingHoursByDay =
    assignments &&
    dailyHours &&
    eachDayOfInterval({
      start: startDate,
      end: endDate,
    })
      .map(
        (day) =>
          assignments
            ?.filter(
              (assignment) =>
                isSameDay(
                  parseBackendDate(assignment.fromDate),
                  new Date(day),
                ) ||
                isSameDay(parseBackendDate(assignment.toDate), new Date(day)) ||
                (isBefore(
                  parseBackendDate(assignment.fromDate),
                  new Date(day),
                ) &&
                  isAfter(parseBackendDate(assignment.toDate), new Date(day))),
            )
            .reduce((acc, curr) => acc + curr.hours, 0),
      )
      .map((hours) => dailyHours - hours);

  return (
    <div
      className={tw(
        "grid grid-cols-10 items-center",
        noName ? "" : "border border-t-0 border-neutrals-medium-200 bg-white",
      )}
    >
      {!noName && (
        <div className="col-span-2 flex h-full items-center justify-center border-r border-neutrals-medium-200 text-center">
          <span className="m-auto text-neutrals-dark-900">Employee Name</span>
        </div>
      )}
      <div className={tw(noName ? "col-span-10" : "col-span-8")}>
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
                className="m-auto h-full w-full border-r border-neutrals-medium-200 py-1 text-center text-neutrals-dark-300"
                style={{
                  gridColumn: getMonthGridStyle(startDate, endDate, monthStart),
                }}
              >
                {differenceInDays(endOfMonth(monthStart), startDate) > 2 &&
                  differenceInDays(endDate, monthStart) > 2 &&
                  format(monthStart, "MMMM")}
              </span>
            ),
          )}
        </div>
        {/* Weeks */}
        <div
          className={tw(
            "grid w-full items-center justify-between border-t border-neutrals-medium-200",
            noName ? "" : "bg-white",
          )}
          style={{
            gridTemplateColumns: `repeat(${totalDaysColumns}, minmax(0, 1fr))`,
          }}
        >
          {eachDayOfInterval({ start: startDate, end: endDate }).map(
            (day, i) => (
              <span
                key={day.toISOString()}
                className={tw(
                  "flex flex-grow items-center justify-center gap-2 border-r border-neutrals-medium-200 py-1 text-center text-primary-dark-300",
                  isToday(day) && "bg-secondary-50",
                )}
                style={{
                  gridColumn: getDayGridStyle(startDate, day),
                }}
              >
                {format(day, "eee d")}
                {remainingHoursByDay &&
                  remainingHoursByDay[i]! > 0 &&
                  remainingHoursByDay[i] !== dailyHours &&
                  !isHoliday(day, holidays) &&
                  !isWeekend(day) && (
                    <Tooltip
                      content={`${remainingHoursByDay[i]} unassigned hour${
                        remainingHoursByDay[i] !== 1 ? "s" : ""
                      }`}
                    >
                      <icons.ExclamationTriangleIcon className="h-4 w-4 text-alert-error-500" />
                    </Tooltip>
                  )}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
};
