import React from "react";
import type { ReactNode } from "react";
import { useDatePicker } from "@rehookify/datepicker";
import format from "date-fns/format";
import type {
  Control,
  FieldErrorsImpl,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { Controller } from "react-hook-form";

import { tw } from "@lightit/shared";
import { icons, Input, Popover } from "@lightit/ui";

import { parseBackendDate, parseFormDate } from "~/utils";
import RangePicker from "./RangePicker";

interface DateRange {
  fromDate: string;
  toDate: string;
}
interface CalendarProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
  inputIcon?: ReactNode;
  showLabels?: boolean;
  error?: FieldErrorsImpl<DateRange>;
  limitDates?: {
    min?: string;
    max?: string;
  };
  fromLabel?: string;
  toLabel?: string;
  gap?: string;
}

export const RangeCalendar = ({
  value = {
    fromDate: "",
    toDate: "",
  },
  onChange,
  inputIcon,
  showLabels = false,
  error,
  limitDates,
  fromLabel,
  toLabel,
  gap = "gap-2",
}: CalendarProps) => {
  const selectedDates = [value.fromDate, value.toDate]
    .filter((v) => !!v)
    .map((v) => parseFormDate(v))
    .sort((a, b) => a.getTime() - b.getTime());
  const onDatesChange = (dateRange: Date[]) => {
    const formattedDateRange = {
      fromDate: dateRange[0] ? format(dateRange[0], "dd/MM/yy") : "",
      toDate: dateRange[1] ? format(dateRange[1], "dd/MM/yy") : "",
    };

    onChange(formattedDateRange);
  };

  const {
    data: { calendars, formattedDates, weekDays },
    propGetters: { dayButton },
    actions: { setNextMonth, setPreviousMonth },
  } = useDatePicker({
    selectedDates,
    onDatesChange,
    dates: {
      mode: "range",
      minDate: limitDates?.min ? parseBackendDate(limitDates?.min) : undefined,
      maxDate: limitDates?.max ? parseBackendDate(limitDates?.max) : undefined,
      selectSameDate: true,
    },
    exclude: {
      day: [0, 6],
    },
    calendar: {
      offsets: [-1, 1],
    },
  });

  const [start, end] = formattedDates;

  const fromDateLabel = fromLabel ?? "From";
  const toDateLabel = toLabel ?? "To";

  return (
    <div className="relative w-full">
      <Popover
        trigger={
          <div className={tw("flex w-full", gap)}>
            <Input
              label={showLabels && fromDateLabel}
              containerClassName="w-full"
              placeholder="dd/mm/yyyy"
              autoComplete="off"
              left={inputIcon}
              error={error?.fromDate?.message}
              onKeyDown={(e) => e.preventDefault()}
              value={start ?? ""}
            />
            <Input
              label={showLabels && toDateLabel}
              left={inputIcon}
              onKeyDown={(e) => e.preventDefault()}
              containerClassName="w-full"
              placeholder="dd/mm/yyyy"
              autoComplete="off"
              error={error?.toDate?.message}
              value={end ?? ""}
            />
          </div>
        }
        content={
          <div className="mt-2 block p-4">
            <main className="grid grid-cols-2 gap-x-6">
              <RangePicker
                calendar={calendars[0]!}
                weekDays={weekDays}
                formattedDates={formattedDates}
                dayButton={dayButton}
                prevButton={
                  <button onClick={setPreviousMonth} type="button">
                    <icons.ChevronLeftIcon className="h-4 w-4" />
                  </button>
                }
              />
              <RangePicker
                calendar={calendars[2]!}
                weekDays={weekDays}
                formattedDates={formattedDates}
                dayButton={dayButton}
                nextButton={
                  <button onClick={setNextMonth} type="button">
                    <icons.ChevronRightIcon className="h-4 w-4" />
                  </button>
                }
              />
            </main>
          </div>
        }
      ></Popover>
    </div>
  );
};

interface HookedRangeCalendar<TFieldValues extends FieldValues>
  extends Omit<CalendarProps, "onChange" | "value" | "name"> {
  id: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
}
export const HookedRangeCalendar = <TFieldValues extends FieldValues>({
  id,
  control,
  ...props
}: HookedRangeCalendar<TFieldValues>) => {
  return (
    <Controller
      name={id}
      control={control}
      render={({ field }) => {
        const { onChange, value } = field;
        return <RangeCalendar {...props} value={value} onChange={onChange} />;
      }}
    />
  );
};
