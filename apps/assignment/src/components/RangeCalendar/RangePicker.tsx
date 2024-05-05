import type { FC, ReactNode } from "react";
import type {
  DPCalendar,
  DPDay,
  DPPropGetter,
  DPPropsGetterConfig,
} from "@rehookify/datepicker";

import { tw } from "@lightit/shared";
import { Typography } from "@lightit/ui";

interface RangeCalendarProps {
  prevButton?: ReactNode;
  nextButton?: ReactNode;
  calendar: DPCalendar;
  weekDays: string[];
  formattedDates: string[];
  dayButton: (day: DPDay, config?: DPPropsGetterConfig) => DPPropGetter;
}

export const RangePicker: FC<RangeCalendarProps> = ({
  prevButton,
  nextButton,
  calendar,
  weekDays,
  formattedDates,
  dayButton,
}) => {
  const [start, end] = formattedDates;

  const { days, month, year } = calendar;

  const groupedDays: DPDay[][] = [];
  days.forEach((_, index) => {
    if (index % 7 === 0) {
      return groupedDays.push(days.slice(index, index + 7));
    }
  });

  return (
    <div>
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          {prevButton ?? <div />}
          <p className="text-center text-lg">{`${month} ${year}`}</p>
          {nextButton ?? <div />}
        </div>
        <div className="mb-2 grid h-8 grid-cols-7 items-center gap-y-2 text-gray-600">
          {weekDays.map((d) => (
            <p key={d} className="text-center text-xs">
              {d.slice(0, 2)}
            </p>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7">
        {groupedDays[0]?.map((_, colIndex) => (
          <div key={colIndex} className="flex flex-col">
            {groupedDays.map((week) => {
              const day = week[colIndex];
              const { inCurrentMonth, $date, now, disabled, range, selected } =
                day!;

              const isStartDayInRange = start?.slice(0, 2) === day?.day;
              const isLastDayInRange = end?.slice(0, 2) === day?.day;

              return (
                <button
                  className={tw(
                    "my-0.5 flex h-8 w-8 items-center justify-center focus:outline-none",
                    range && inCurrentMonth && "bg-purple-100",
                    colIndex === 0 && "rounded-l-full",
                    colIndex === 6 && "rounded-r-full",
                    now &&
                      inCurrentMonth &&
                      !range &&
                      "rounded-full border border-black",
                    isStartDayInRange && selected && "rounded-l-full",
                    isLastDayInRange && selected && "rounded-r-full",
                  )}
                  disabled={!inCurrentMonth}
                  key={$date.toString()}
                  {...dayButton(day!)}
                  type="button"
                >
                  <Typography
                    font="regular"
                    variant="small"
                    className={tw(
                      "flex h-8 w-8 items-center justify-center text-xs",
                      disabled && "text-primary-400 opacity-40",
                      (!inCurrentMonth ?? disabled) &&
                        "text-primary-400 opacity-40",
                      selected &&
                        inCurrentMonth &&
                        "z-10 rounded-full bg-secondary-500 text-white",
                    )}
                  >
                    {day?.day}
                  </Typography>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RangePicker;
