import {
  add,
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
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useSearchParams } from "react-router-dom";

import { tw } from "@lightit/shared";
import { icons } from "@lightit/ui";

import { getDateRange, getWeeks, searchParamToDate } from "~/utils";

interface HeaderProps {
  range: "quarter" | "month" | "week";
  isProjectView?: boolean;
}

export const EmployeeListHeader = ({
  range,
  isProjectView = false,
}: HeaderProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const startDate = searchParamToDate(searchParams.get("startDate"));

  const dateRange = getDateRange(range, startDate);
  const days = eachDayOfInterval(dateRange);
  const weeks = getWeeks(days);

  const totalColumns = range === "quarter" ? weeks.length * 7 : days.length;

  const months = eachMonthOfInterval(dateRange)
    .filter(
      (monthStart) =>
        (range === "week" ||
          (differenceInDays(endOfMonth(monthStart), dateRange.start) > 7 &&
            differenceInDays(dateRange.end, monthStart) > 7)) &&
        format(monthStart, "MMMM"),
    )
    .map((month) => ({ start: month, end: endOfMonth(month) }));

  const handleDateNavigation = (direction: number) => {
    const monthMove = { months: direction };
    const weekMove = { weeks: direction };

    const updatedStartDate = format(
      add(startDate, range === "week" ? weekMove : monthMove),
      "yyyy-MM-dd",
    );

    setSearchParams((prev) => {
      if (updatedStartDate && range !== "week") {
        prev.set(
          "startDate",
          format(
            startOfMonth(searchParamToDate(updatedStartDate)),
            "yyyy-MM-dd",
          ),
        );
      } else if (updatedStartDate && range === "week") {
        prev.set(
          "startDate",
          format(
            startOfWeek(searchParamToDate(updatedStartDate)),
            "yyyy-MM-dd",
          ),
        );
      } else {
        prev.delete("searchText");
      }

      return prev;
    });
  };
  return (
    <div className="relative flex rounded-2xl border border-neutrals-medium-200 bg-white">
      <button
        onClick={() => handleDateNavigation(-1)}
        className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full bg-nostalgia-purple-900 p-2"
      >
        <icons.ChevronLeftIcon className="h-4 w-4 stroke-[3] text-white" />
      </button>
      {isProjectView && <div className="inline-flex w-44 border-r" />}

      <div
        className="grid flex-1 grid-rows-2 overflow-hidden rounded-2xl font-medium"
        style={{
          gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))`,
          gridTemplateRows: "auto",
        }}
      >
        {months.map((month, i) => (
          <div
            key={month.start.toISOString()}
            className={`flex items-center justify-center ${
              i < months.length - 1 && "border-r"
            } p-2 text-neutrals-dark-900`}
            style={{
              gridRow: 1,
              gridColumn:
                range !== "week"
                  ? `${
                      differenceInDays(month.start, dateRange.start) + 1
                    } / span ${differenceInDays(month.end, month.start) + 1}`
                  : `${
                      i === 0
                        ? 1
                        : differenceInDays(month.start, dateRange.start) + 1
                    } / span ${
                      differenceInDays(month.end, dateRange.start) + 1
                    }`,
            }}
          >
            {format(month.start, "MMMM")}
          </div>
        ))}

        {range === "quarter" ? (
          <>
            {weeks.map((week) => {
              if (week)
                return (
                  <div
                    key={week.start?.toISOString()}
                    className={tw(
                      "flex items-center justify-center border-r border-t p-2 text-sm text-neutrals-medium-300 last:border-r-0",
                      (isAfter(new Date(), week.start) ||
                        isSameDay(new Date(), week.start)) &&
                        (isSameDay(new Date(), week.end) ||
                          isBefore(new Date(), week.end)) &&
                        "bg-nostalgia-purple-800 text-white",
                    )}
                    style={{
                      gridRow: 2,
                      gridColumn: `${
                        differenceInDays(week.start, dateRange.start) + 1
                      } / span 7`,
                    }}
                  >
                    {`${format(week.start, "d")} - ${format(week.end, "d")}`}
                  </div>
                );
            })}
          </>
        ) : (
          <>
            {days.map((day) => (
              <div
                key={day.toString()}
                className={tw(
                  "flex flex-col items-center justify-center border-r border-t p-2 text-sm text-neutrals-dark-300 last:border-r-0",
                  isWeekend(day) && "bg-neutrals-light-200",
                  range === "month" &&
                    isToday(day) &&
                    "bg-nostalgia-purple-900 text-white",
                  range === "week" && isToday(day) && "text-white",
                )}
                style={{
                  gridRow: 2,
                  gridColumn: `${
                    differenceInDays(day, dateRange.start) + 1
                  } / span 1`,
                }}
              >
                <span
                  className={tw(
                    range === "week" &&
                      isToday(day) &&
                      "aspect-square rounded-full bg-nostalgia-purple-900",
                    range === "week" &&
                      "flex items-center justify-center px-2 text-2xl",
                  )}
                >
                  {format(day, "d")}
                </span>
                {range === "week" && (
                  <span
                    className={tw(
                      range === "week" &&
                        isToday(day) &&
                        "text-nostalgia-purple-900",
                    )}
                  >
                    {format(day, "EEEE")}
                  </span>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      <button
        onClick={() => handleDateNavigation(1)}
        className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full bg-nostalgia-purple-900 p-2"
      >
        <icons.ChevronRightIcon className="h-4 w-4 stroke-[3] text-white" />
      </button>
    </div>
  );
};
