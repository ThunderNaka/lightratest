import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  add,
  areIntervalsOverlapping,
  differenceInDays,
  eachDayOfInterval,
  isSameDay,
  isSunday,
  isWeekend,
  parse,
  previousSunday,
} from "date-fns";

import { tw } from "@lightit/shared";
import { Button, getTextColor, icons } from "@lightit/ui";

import type { Employee } from "~/api/employees";
import type { Holiday } from "~/api/holidays";
import { getHolidays } from "~/api/holidays";
import { NoAssignments } from "~/assets";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { MODAL_ROUTES, useNavigateModal } from "~/router";
import { ASSIGNMENT_TYPE } from "~/shared.constants";
import { errorToast, parseBackendDate } from "~/utils";
import { EmployeeHeader } from "../HoursDashboard/HourCalendar";

const rowClassName = "flex items-center justify-center gap-2 min-h-[6rem]";

const getAssignmentGridStyle = (
  startDate: Date,
  fromDate: Date,
  toDate: Date,
  endDate: Date,
) => {
  const firstDayOfProjectInWeek = fromDate >= startDate ? fromDate : startDate;
  const lastDayOfProjectInWeek = endDate >= toDate ? toDate : endDate;

  const daysInThisWeek =
    differenceInDays(lastDayOfProjectInWeek, firstDayOfProjectInWeek) + 1;

  return `${
    Math.max(differenceInDays(fromDate, startDate), 0) + 1
  }/ span ${daysInThisWeek}`;
};

export function isHoliday(date: Date, holidays?: Holiday[]) {
  return holidays
    ? holidays.find((holiday) =>
        isSameDay(date, parse(holiday.date, "yyyy-MM-dd", new Date())),
      )
    : null;
}

const getRowsStyle = (employee: Employee) => {
  return `repeat(${employee.assignments?.length}, minmax(0, 1fr))`;
};

const getDayBorderGridStyle = (startDate: Date, day: Date) =>
  `${Math.max(differenceInDays(day, startDate), 0) + 1} / span 1`;

interface EmployeeHoursProps {
  employee: Employee;
}

export const EmployeeHoursGraph = ({ employee }: EmployeeHoursProps) => {
  const { hasPermission } = usePermissions();
  const [date, setStartDate] = useState(
    new Date(new Date().setHours(0, 0, 0, 0)),
  );
  const navigateModal = useNavigateModal();

  const startDate = isSunday(date) ? date : previousSunday(date);
  const endDate = add(startDate, { days: 6 });

  const assignments =
    employee.assignments?.map((a) => ({
      ...a,
      parsedFromDate: parseBackendDate(a.fromDate),
      parsedToDate: parseBackendDate(a.toDate),
    })) ?? [];

  const changeDate = (toAdd: number) => {
    let date = startDate;
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    switch (toAdd) {
      case 0:
        date = isSunday(today) ? today : previousSunday(today);
        break;
      case 1:
      case -1:
        date = add(startDate, {
          weeks: toAdd,
        });
        break;
    }
    setStartDate(date);
  };

  const newAssignment = () => {
    navigateModal(
      `${MODAL_ROUTES.newAssignmentForm}/?type=project&employeeId=${employee.id}`,
    );
  };

  const editAssignment = (assignmentId: number) => {
    navigateModal(`${MODAL_ROUTES.assignmentDetails}/${assignmentId}`);
  };

  const filteredAssignments = assignments.filter((assignment) =>
    areIntervalsOverlapping(
      { start: startDate, end: endDate },
      {
        start: new Date(assignment.fromDate),
        end: new Date(assignment.toDate),
      },
      { inclusive: true },
    ),
  );

  const assignmentsToShow = filteredAssignments
    .filter(
      (assignment, index, self) =>
        assignment.type !== "timeOff" ||
        self.findIndex((v) => v.type === "timeOff") === index,
    )
    .sort((a) => (a.type === "timeOff" ? -1 : 1));

  const { data: holidays } = useQuery({
    queryFn: getHolidays,
    queryKey: ["getHolidays"],
    onError: errorToast,
  });

  return (
    <>
      {!assignments.length && (
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-4">
          <img
            src={NoAssignments}
            alt="There's no info to show"
            className="h-40"
          />
          <span className="text-lg">There are no assignments</span>
          {(hasPermission(PERMISSIONS.createTeamAssignment) ||
            hasPermission(PERMISSIONS.createInternalProject)) && (
            <Button
              variant="secondary"
              size="sm"
              onClick={newAssignment}
              left={<icons.PlusIcon />}
            >
              New Assignment
            </Button>
          )}
        </div>
      )}
      {!!assignments.length && (
        <div className="flex items-stretch gap-2">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Assignments</span>
              <div className="flex gap-1 self-center rounded py-0 text-secondary">
                <Button
                  size="sm"
                  variant="outline"
                  className="m-auto h-fit w-7 justify-center border-transparent p-0 px-1 hover:border-transparent"
                  onClick={() => changeDate(-1)}
                >
                  <icons.ChevronLeftIcon className="h-full w-full stroke-secondary hover:stroke-secondary-600" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="m-auto justify-center border-transparent px-2 py-0 hover:border-transparent"
                  onClick={() => changeDate(0)}
                >
                  Today
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="m-auto h-fit w-7 justify-center border-transparent p-0 px-1 hover:border-transparent"
                  onClick={() => changeDate(1)}
                >
                  <icons.ChevronRightIcon className="h-full w-full stroke-secondary hover:stroke-secondary-600" />
                </Button>
                {(hasPermission(PERMISSIONS.createTeamAssignment) ||
                  hasPermission(PERMISSIONS.createInternalProject)) && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="ml-4 h-8 focus:ring-0"
                    onClick={newAssignment}
                    left={<icons.PlusIcon />}
                  >
                    New Assignment
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-1 flex-col">
              <EmployeeHeader
                startDate={startDate}
                endDate={endDate}
                noName
                assignments={assignmentsToShow}
                dailyHours={employee.hours}
              />

              <div className="grid grid-cols-7 items-center">
                <div
                  className="relative col-span-7 grid h-full flex-grow grid-cols-7 items-center gap-y-4 py-2"
                  style={{
                    gridTemplateRows: getRowsStyle(employee),
                  }}
                >
                  {/* Day borders */}
                  <div
                    className={tw(
                      rowClassName,
                      "pointer-events-none absolute left-0 top-0 grid h-full w-full items-center gap-0",
                    )}
                    style={{
                      gridTemplateColumns: `repeat(${
                        differenceInDays(endDate, startDate) + 1
                      }, minmax(0, 1fr))`,
                    }}
                  >
                    {eachDayOfInterval({ start: startDate, end: endDate }).map(
                      (day, i, { length }) => (
                        <div
                          key={day.toISOString()}
                          className={tw(
                            "m-auto h-full w-full py-1 text-center",
                            (isWeekend(day) || isHoliday(day, holidays)) &&
                              "line-clamp-2 flex bg-primary-dark-50 p-3 text-xs hover:opacity-80",
                            i !== length &&
                              "border-r border-neutrals-medium-200",
                          )}
                          style={{
                            gridColumn: getDayBorderGridStyle(startDate, day),
                          }}
                        >
                          {isHoliday(day, holidays)?.name
                            ? "Holiday: " + isHoliday(day, holidays)?.name
                            : isWeekend(day)
                            ? "Vacation"
                            : ""}
                        </div>
                      ),
                    )}
                  </div>

                  {/* Employee assignments */}
                  {assignmentsToShow.map((assignment, index) => {
                    const project = employee.projects?.find(
                      (a) =>
                        a.id ===
                        (assignment.type === ASSIGNMENT_TYPE.PROJECT &&
                          assignment.assignableId),
                    );

                    const color = project?.color ?? "gray-100";

                    return (
                      <Button
                        key={`${assignment.id}-${assignment.fromDate}`}
                        onClick={() =>
                          hasPermission(PERMISSIONS.updateTeamAssignment) &&
                          editAssignment(assignment.id)
                        }
                        id={`${assignment.id}-${assignment.fromDate}`}
                        className={tw(
                          "group z-10 flex h-10 cursor-pointer items-center justify-start px-4 text-left text-xs hover:opacity-70",
                          `bg-${color} border-gray-700 hover:bg-${color} focus:bg-${color} text-${getTextColor(
                            color,
                          )}`,
                        )}
                        style={{
                          gridColumn: getAssignmentGridStyle(
                            startDate,
                            assignment.parsedFromDate,
                            assignment.parsedToDate,
                            endDate,
                          ),
                          gridRow: index + 1,
                        }}
                      >
                        <p className="line-clamp-2">
                          {assignment.type === ASSIGNMENT_TYPE.TIME_OFF
                            ? "🏝️ Time Off"
                            : assignment.type === ASSIGNMENT_TYPE.COURSE
                            ? "🎓 Course"
                            : `🕰️ ${project?.name}`}
                        </p>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
