import React from "react";
import {
  differenceInBusinessDays,
  differenceInDays,
  eachDayOfInterval,
  isWeekend,
} from "date-fns";
import { useNavigate } from "react-router-dom";

import { tw } from "@lightit/shared";
import { CircularAvatar, getTextColor, Typography } from "@lightit/ui";

import type { EmployeeWithAssignments } from "~/api/employees";
import { MODAL_ROUTES, ROUTES, useNavigateModal } from "~/router";
import { parseBackendDate } from "~/utils";

const rowClassName =
  "flex items-center justify-center gap-2 bg-primary-white-50 min-h-[6rem]";

const getAssignmentGridStyle = (
  startDate: Date,
  fromDate: Date,
  toDate: Date,
) =>
  `${Math.max(differenceInDays(fromDate, startDate), 0) + 1}/ span ${
    differenceInDays(toDate, fromDate) + 1
  }`;

const getRowsStyle = (employee: EmployeeWithAssignments) => {
  return `repeat(${employee.assignments?.length}, minmax(0, 1fr))`;
};

const getDayBorderGridStyle = (startDate: Date, day: Date) =>
  `${Math.max(differenceInDays(day, startDate), 0) + 1} / span 1`;

interface EmployeeHoursProps {
  employee: EmployeeWithAssignments;
  startDate: Date;
  endDate: Date;
  onEmployeeSelected: (employee: EmployeeWithAssignments) => void;
}

export const EmployeeHours = ({
  startDate,
  endDate,
  employee,
  onEmployeeSelected,
}: EmployeeHoursProps) => {
  const assignments =
    employee.assignments?.map((a) => ({
      ...a,
      parsedFromDate: parseBackendDate(a.fromDate),
      parsedToDate: parseBackendDate(a.toDate),
    })) ?? [];

  const totalAssignedHours = Math.round(
    assignments?.reduce(
      (total, { hours, parsedToDate, parsedFromDate }) =>
        total + hours * differenceInBusinessDays(parsedToDate, parsedFromDate),
      0,
    ) ?? 0,
  );
  const navigate = useNavigate();
  const navigateModal = useNavigateModal();

  return (
    <div className="grid grid-cols-10 items-center border border-t-0 border-neutrals-medium-200 bg-white">
      {/* Project Name and Employees */}
      <div className="col-span-2 flex h-full items-center justify-center border-r border-neutrals-medium-200">
        <button
          className={tw(
            rowClassName,
            "w-full cursor-pointer flex-wrap justify-between gap-4 px-4",
          )}
          onClick={() => onEmployeeSelected(employee)}
        >
          <div className="flex w-full items-center justify-center ">
            <CircularAvatar
              size="xs"
              defaultToIcon={employee.avatarUrl ? true : false}
              name={employee.name}
              image={employee.avatarUrl}
              className="mr-3"
            />
            <Typography className=" mr-3 shrink truncate ">
              {employee.name}
            </Typography>
            <div className="flex rounded bg-primary-50 p-1 text-sm text-neutrals-dark-400 ">
              {totalAssignedHours}h
            </div>
          </div>
        </button>
      </div>
      <div
        className="relative col-span-8 grid h-full flex-grow grid-cols-7 items-center gap-y-4 py-2"
        style={{
          gridTemplateRows: getRowsStyle(employee),
        }}
      >
        {/* Day borders */}
        <div
          className={tw(
            rowClassName,
            "pointer-events-none absolute left-0 top-0 grid h-full w-full items-center gap-0 !bg-transparent",
          )}
          style={{
            gridTemplateColumns: `repeat(${
              differenceInDays(endDate, startDate) + 1
            }, minmax(0, 1fr))`,
          }}
        >
          {eachDayOfInterval({ start: startDate, end: endDate }).map((day) => (
            <div
              key={day.toISOString()}
              className={tw(
                "m-auto h-full w-full border-r border-neutrals-medium-200 py-1 text-center",
                isWeekend(day) && "bg-primary-dark-50",
              )}
              style={{
                gridColumn: getDayBorderGridStyle(startDate, day),
              }}
            />
          ))}
        </div>
        {/* Employee assignments */}
        {assignments.map((assignment, index) => (
          <button
            key={`${assignment.id}-${assignment.fromDate}`}
            id={`${assignment.id} - ${assignment.fromDate}`}
            className={tw(
              "group z-10 flex h-9 cursor-pointer items-center justify-start border-gray-700 px-4 text-left text-xs transition-all hover:bg-opacity-100",
              assignment.type === "project" &&
                `bg-${
                  assignment.assignable.color ?? "gray-100"
                }  text-${getTextColor(assignment.assignable.color ?? "")}`,
            )}
            style={{
              gridColumn: getAssignmentGridStyle(
                startDate,
                assignment.parsedFromDate,
                assignment.parsedToDate,
              ),
              gridRow: index + 1,
            }}
            onClick={() => {
              assignment.type === "project"
                ? navigate(
                    `${ROUTES.projects.base}/${assignment.assignable?.id}`,
                  )
                : navigateModal(
                    `${MODAL_ROUTES.assignmentDetails}/${assignment.id}`,
                  );
            }}
          >
            <p className="line-clamp-2">
              {assignment.type === "project" &&
                `🕰️ ${assignment.assignable.name}`}
              {assignment.type === "timeOff" && "🏝️ Time Off"}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
