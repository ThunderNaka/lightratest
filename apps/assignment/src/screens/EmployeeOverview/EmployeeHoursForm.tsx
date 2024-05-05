import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDays,
  areIntervalsOverlapping,
  differenceInBusinessDays,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isToday,
  isWeekend,
  lastDayOfMonth,
  parse,
  parseISO,
} from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToastStore } from "@lightit/toast";
import { Button, Checkbox, HookedSelect, icons, Tooltip } from "@lightit/ui";

import { saveEmployeeInfo } from "~/api/employees";
import type { Employee } from "~/api/employees";
import type { Holiday } from "~/api/holidays";
import { getHolidays } from "~/api/holidays";
import { ChipProject } from "~/components";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { errorToast, handleAxiosFieldErrors } from "~/utils";

const hourOptions = Array.from({ length: 9 }, (_, h) => ({
  value: `${h}`,
  label: `${h}`,
}));

export const employeeHoursSchema = z.object({
  employeeId: z.number(),
  isAssignable: z.boolean(),
  hours: z.string().min(1),
});
export type EmployeeHoursFormValues = z.infer<typeof employeeHoursSchema>;

interface EmployeeHoursFormProps {
  employee: Employee;
}

function getWorkdaysInMonth(
  firstDay: Date,
  lastDay: Date,
  holidays: Holiday[],
  offDays: Date[],
) {
  let workdays = 0;
  for (let date = firstDay; date <= lastDay; date = addDays(date, 1)) {
    if (
      isWeekend(date) === false &&
      !isHoliday(date, holidays) &&
      !offDays.some((day) => isSameDay(date, day))
    ) {
      workdays++;
    }
  }

  return workdays;
}

function isHoliday(date: Date, holidays: Holiday[]): boolean {
  return holidays.some((holiday) => isSameDay(date, new Date(holiday.date)));
}

function getTimeOffDatesInMonth(
  start: string,
  stop: string,
  holidays: Holiday[],
  monthTimeOff: Date,
): Date[] {
  const dateArray: Date[] = [];
  const startDate = new Date(parseISO(start));
  const stopDate = new Date(parseISO(stop));

  const currentDate = new Date(startDate);
  while (
    currentDate <= stopDate &&
    currentDate.getMonth() === monthTimeOff.getMonth()
  ) {
    if (isWeekend(currentDate) === false && !isHoliday(currentDate, holidays)) {
      dateArray.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}

export const EmployeeHoursForm = ({ employee }: EmployeeHoursFormProps) => {
  const { hasPermission } = usePermissions();
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const defaultValues = {
    employeeId: employee?.id,
    hours: `${employee?.hours}`,
    isAssignable: employee?.isAssignable,
  };

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isDirty },
    control,
  } = useForm<EmployeeHoursFormValues>({
    resolver: zodResolver(employeeHoursSchema),
    defaultValues,
  });

  const { mutate: createInfoMutation } = useMutation({
    mutationFn: saveEmployeeInfo.mutation,
    onSuccess: () => {
      void pushToast({
        type: "success",
        title: "Employee info saved",
      });
      saveEmployeeInfo.invalidates(queryClient, { employeeId: employee.id });
    },
    onError: (err) => {
      errorToast(err);
      handleAxiosFieldErrors(err, setError);
    },
  });

  const { data: holidays } = useQuery({
    queryFn: getHolidays,
    queryKey: ["getHolidays"],
    onError: errorToast,
  });

  const watchHours = parseFloat(watch("hours"));

  const today = new Date();
  const firstMonthDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const selectedMonth = format(today, "MMMM");
  const lastMonthDay = lastDayOfMonth(today);
  const monthlyBusinessDays =
    differenceInBusinessDays(lastMonthDay, firstMonthDay) + 1;

  const timeOffAssignments = employee?.assignments?.filter(
    (assignment) => assignment.type === "timeOff",
  );

  const timeOffDatesInMonth =
    (holidays &&
      timeOffAssignments?.reduce((allOffDays, assignment) => {
        return allOffDays.concat(
          getTimeOffDatesInMonth(
            assignment.fromDate,
            assignment.toDate,
            holidays,
            today,
          ),
        );
      }, [] as Date[])) ??
    [];

  const workDays = holidays
    ? getWorkdaysInMonth(
        firstMonthDay,
        lastMonthDay,
        holidays,
        timeOffDatesInMonth,
      )
    : monthlyBusinessDays;
  const monthlyHours = watchHours * workDays;
  const monthlyOffHours = timeOffDatesInMonth.length * employee.hours;

  const monthlyAssignedHours =
    employee?.assignments
      ?.filter((assignment) => assignment.type !== "timeOff")
      .reduce((totalHours, assignment) => {
        const fromDate = parse(assignment.fromDate, "y-MM-dd", new Date());
        const toDate = parse(assignment.toDate, "y-MM-dd", new Date());

        // Get first day of current month that has an assignment.
        const firstDay =
          differenceInBusinessDays(fromDate, firstMonthDay) > 0
            ? fromDate
            : firstMonthDay;

        // Get last day of current month that has an assignment.
        const lastDay =
          differenceInBusinessDays(toDate, lastMonthDay) < 0
            ? toDate
            : lastMonthDay;

        const businessDays = differenceInBusinessDays(lastDay, firstDay) + 1;

        const businessDaysWithHolidays = holidays
          ? getWorkdaysInMonth(firstDay, lastDay, holidays, timeOffDatesInMonth)
          : businessDays;

        try {
          // Add only hours that overlaps with current month.
          const shouldAddHours = areIntervalsOverlapping(
            { start: firstDay, end: lastDay },
            { start: fromDate, end: toDate },
            { inclusive: true },
          );

          return (
            totalHours +
            (shouldAddHours ? businessDaysWithHolidays * assignment.hours : 0)
          );
        } catch (RangeError) {
          return totalHours;
        }
      }, 0) ?? 0;

  const todayAssignments = employee.assignments?.filter((assignment) => {
    const fromDate = parse(assignment.fromDate, "y-MM-dd", new Date());
    const toDate = parse(assignment.toDate, "y-MM-dd", new Date());

    return (
      (isBefore(fromDate, today) && isAfter(toDate, today)) ||
      isToday(fromDate) ||
      isToday(toDate)
    );
  });

  const todayProjects = employee.projects?.filter(
    (project) =>
      !!todayAssignments?.find(
        (assignment) =>
          assignment.type === "project" &&
          assignment.assignableId === project.id,
      ),
  );

  const canAssignHours = hasPermission(PERMISSIONS.updateEmployeeHours);

  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex flex-col">
        {!!todayProjects?.length && (
          <>
            <span className="mb-2 font-semibold">Assigned hours today</span>
            <div className="flex w-full flex-col gap-3">
              {todayProjects?.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between"
                >
                  <ChipProject project={project} />
                  <span>
                    {todayAssignments
                      ?.filter(
                        (a) =>
                          a.type === "project" && a.assignableId === project.id,
                      )
                      .reduce(
                        (todayProjectHours, { hours }) =>
                          todayProjectHours + hours,
                        0,
                      ) ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col">
        <div className="border-t-1 border-gray flex justify-between">
          <span className="font-semibold">
            Working hours for {selectedMonth}
          </span>
          <span>{monthlyHours}</span>
        </div>
        <div className="border-t-1 border-gray flex justify-between">
          <span className="">Assigned hours</span>
          <div className="flex items-center gap-2">
            {monthlyHours - (monthlyAssignedHours + monthlyOffHours) > 0 && (
              <Tooltip content="There are still hours to assign in this month.">
                <icons.ExclamationTriangleIcon className="h-6 w-6 text-alert-error-500" />
              </Tooltip>
            )}
            <div>{monthlyAssignedHours}</div>
          </div>
        </div>
        <div className="border-t-1 border-gray flex justify-between">
          <span className="">Time Off hours</span>
          <div className="flex items-center gap-2">
            <div>
              {monthlyOffHours} ({timeOffDatesInMonth.length} days)
            </div>
          </div>
        </div>
        <div className="border-t-1 border-gray flex justify-between">
          <span className="">Assignable hours</span>
          <div className="flex items-center gap-2">
            <div>{monthlyHours - monthlyAssignedHours}</div>
          </div>
        </div>
      </div>

      <div className="flex-1"></div>

      {canAssignHours && (
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) =>
            void handleSubmit((values) => createInfoMutation(values))(e)
          }
        >
          <HookedSelect
            id="hours"
            label="Daily hours"
            placeholder="Pick daily hours"
            options={hourOptions}
            error={errors.hours?.message}
            control={control}
            disabled={true}
          />

          <Checkbox
            id="isAssignable"
            label="Notify if no project is assigned"
            {...register("isAssignable")}
          />

          <div className="flex justify-end">
            {isDirty && (
              <Button
                variant="secondary"
                size="sm"
                className="mr-2"
                onClick={() => {
                  reset(defaultValues);
                }}
              >
                Cancel
              </Button>
            )}
            <Button size="sm" type="submit" disabled={!isDirty}>
              Save Changes
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
