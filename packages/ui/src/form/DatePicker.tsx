import React, { useEffect, useState } from "react";
import { useDatePicker } from "@rehookify/datepicker";
import { addYears, isValid, subYears } from "date-fns";

import { tw } from "@lightit/shared";

import { Select, Typography } from "..";

const lastDecade = subYears(new Date(), 10);
const nextDecade = addYears(new Date(), 10);

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}
export const DatePicker = ({
  value,
  onChange,
  minDate = lastDecade,
  maxDate = nextDecade,
}: DatePickerProps) => {
  const [selectedDates, onDatesChange] = useState<Date[]>(value ? [value] : []);

  const {
    data: { calendars, weekDays, months, years },
    actions: { setYear, setMonth },
  } = useDatePicker({
    selectedDates,
    onDatesChange,
    years: {
      mode: "fluid",
      numberOfYears: 30,
      step: 0,
    },
    dates: {
      minDate: minDate,
      maxDate: maxDate,
    },
    calendar: {
      startDay: 1,
    },
    locale: {
      weekday: "short",
    },
  });

  useEffect(() => {
    if (value && isValid(value)) {
      onDatesChange([value]);
      setMonth(value);
      setYear(value);
    }
  }, [value, setMonth, setYear]);

  if (!calendars[0]) {
    return null;
  }

  const { month, year, days } = calendars[0];

  const enabledYears = years
    .filter(({ disabled }) => !disabled)
    .map(({ year, $date }) => ({
      label: year.toString(),
      value: $date.toString(),
    }));

  const defaultYear = years.find((y) => y.year === parseInt(year, 10));

  const enabledMonths = months
    .filter(({ disabled }) => !disabled)
    .map(({ month, $date }) => ({
      label: month.toString(),
      value: $date.toString(),
    }));

  const defaultMonth = months.find((m) => m.month === month);

  return (
    <div className="w-[250px] rounded-lg bg-white p-2 drop-shadow-md">
      <div className="flex items-center gap-2">
        <Select
          id="month"
          containerClassName="w-full"
          className={tw(
            "rounded-none border-x-0 border-t-0 border-b-secondary-500 focus:border-b-secondary-500 focus:ring-0",
          )}
          options={enabledMonths}
          value={defaultMonth?.$date.toString() ?? ""}
          onChange={(value) => {
            const date = new Date(value);
            setMonth(date);
            onChange?.(date);
          }}
        />
        <Select
          id="year"
          containerClassName="w-full"
          className={tw(
            "rounded-none border-x-0 border-t-0 border-b-secondary-500 focus:border-b-secondary-500 focus:ring-0",
          )}
          options={enabledYears}
          value={defaultYear?.$date.toString() ?? ""}
          onChange={(value) => {
            const date = new Date(value);
            setYear(date);
            onChange?.(date);
          }}
        />
      </div>
      <div className="mt-2 grid grid-cols-7 text-center">
        {weekDays.map((d) => (
          <Typography
            variant="detail"
            font="regular"
            className="text-neutrals-dark-500"
            key={d}
          >
            {d.charAt(0)}
          </Typography>
        ))}
      </div>

      <div className="isolate mt-2 grid grid-cols-7 overflow-hidden rounded-lg  ">
        {days.map((d) => {
          const { inCurrentMonth, $date, now, day, selected, disabled } = d;
          return (
            <button
              className={tw("flex items-center justify-center gap-px ")}
              disabled={disabled}
              key={$date.toString()}
              onClick={(e) => {
                e.preventDefault();
                onDatesChange([$date]);
                onChange?.($date);
              }}
            >
              <Typography
                font="regular"
                variant="small"
                className={tw(
                  "flex h-8 w-8 items-center justify-center rounded-full  ",
                  (!inCurrentMonth || disabled) &&
                    "text-primary-400 opacity-40",
                  now && "border border-secondary-500",
                  selected && "bg-secondary-500 text-white",
                )}
              >
                {day}
              </Typography>
            </button>
          );
        })}
      </div>
    </div>
  );
};
