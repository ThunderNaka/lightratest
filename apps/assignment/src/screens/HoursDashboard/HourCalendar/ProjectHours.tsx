import React, { useState } from "react";
import { differenceInDays, eachWeekOfInterval, endOfWeek } from "date-fns";

import { tw } from "@lightit/shared";
import { CircularAvatar, icons, Typography } from "@lightit/ui";

import type { Employee } from "~/api/employees";
import type { Project } from "~/api/projects";
import { ChipProject } from "~/components";
import { MODAL_ROUTES, useNavigateModal } from "~/router";
import { PROJECT_TYPE } from "~/shared.constants";
import { formatFormDate, getDateRangeAsWeeks, parseBackendDate } from "~/utils";

const rowClassName =
  "flex items-center justify-center gap-y-2 h-14 even:bg-neutrals-medium-0 odd:bg-neutrals-medium-100";

const getAssignmentGridStyle = (
  startDate: Date,
  weekStart: Date,
  weekEnd: Date,
) =>
  `${Math.max(differenceInDays(weekStart, startDate), 0) + 1}/ span ${
    differenceInDays(weekEnd, weekStart) + 1
  }`;

const getWeekBorderGridStyle = (
  startDate: Date,
  endDate: Date,
  weekStart: Date,
) =>
  `${Math.max(differenceInDays(weekStart, startDate), 0) + 1} / span ${
    differenceInDays(
      endDate < endOfWeek(weekStart) ? endDate : endOfWeek(weekStart),
      weekStart < startDate ? startDate : weekStart,
    ) + 1
  }`;

const EMPLOYEES_TO_SHOW_BY_DEFAULT = 3;

interface ProjectHoursProps {
  project: Project;
  startDate: Date;
  endDate: Date;
  onEmployeeSelected: (employee: Employee) => void;
}

export const ProjectHours = ({
  startDate,
  endDate,
  project,
  onEmployeeSelected,
}: ProjectHoursProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const canExpand =
    (project.employees?.length ?? 0) > EMPLOYEES_TO_SHOW_BY_DEFAULT + 1;

  const employeesToShow =
    isExpanded || !canExpand
      ? project.employees ?? []
      : project.employees?.slice(0, EMPLOYEES_TO_SHOW_BY_DEFAULT) ?? [];

  const totalDaysColumns = differenceInDays(endDate, startDate) + 1;

  const navigateModal = useNavigateModal();

  return (
    <div className="grid grid-cols-6 items-center  border border-t-0 border-neutrals-medium-300 bg-primary-50">
      {/* Project Name and Employees */}
      <div
        className={tw(
          "grid grid-cols-1 flex-col border-l-8 border-r border-neutrals-medium-300",
          `border-${project.color}`,
        )}
      >
        <div className={tw(rowClassName, "justify-start gap-4 px-4")}>
          <ChipProject project={project} />
          {project.type === PROJECT_TYPE.CLIENT && (
            <span className="rounded bg-complementary-blue-300 px-2 py-1 text-sm text-primary-500">
              $
            </span>
          )}
        </div>
        {employeesToShow.map((employee) => (
          <button
            key={employee.id}
            className={tw(
              rowClassName,
              "cursor-pointer justify-start gap-4 px-4 text-xs",
            )}
            onClick={() => onEmployeeSelected(employee)}
          >
            <div className="flex items-center">
              <CircularAvatar
                size="xs"
                defaultToIcon={employee.avatarUrl ? true : false}
                name={employee.name}
                image={employee.avatarUrl}
              />
              <Typography className="ml-2">{employee.name}</Typography>
            </div>
          </button>
        ))}
        {canExpand && (
          <div
            className={tw(
              rowClassName,
              "text-secondary-purple-500 justify-center px-4 text-center text-xs",
            )}
          >
            <button
              className="flex h-full w-full items-center justify-center gap-2 text-secondary-500"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {!isExpanded && (
                <>
                  View{" "}
                  {(project.employees?.length ?? 0) -
                    EMPLOYEES_TO_SHOW_BY_DEFAULT}{" "}
                  more <icons.ChevronDownIcon className="h-4 w-4" />
                </>
              )}
              {isExpanded && (
                <>
                  View less <icons.ChevronUpIcon className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
      <div className="relative col-span-5 flex h-full flex-grow flex-col justify-start">
        <span className="h-14 bg-neutrals-medium-100"></span>
        {/* Each Employee Hours row */}
        {employeesToShow.map((employee) => (
          <div
            key={employee.id}
            className="grid h-14 items-center justify-center gap-y-1 odd:bg-neutrals-medium-100 even:bg-neutrals-medium-0"
            style={{
              gridTemplateColumns: `repeat(${totalDaysColumns}, minmax(0, 1fr))`,
            }}
          >
            {employee.assignments?.map((assignment) =>
              getDateRangeAsWeeks(
                parseBackendDate(assignment.fromDate),
                parseBackendDate(assignment.toDate ?? formatFormDate(endDate)),
              ).map((week) => (
                <button
                  key={`${assignment.id} - ${week.start.toISOString()}`}
                  id={`${assignment.id} - ${week.start.toISOString()}`}
                  className={tw(
                    "group flex h-6 cursor-pointer items-center justify-center bg-opacity-50 transition-all duration-100 hover:z-10 hover:bg-opacity-100",
                    `bg-${project.color} hover:shadow-lg`,
                  )}
                  style={{
                    gridColumn: getAssignmentGridStyle(
                      startDate,
                      week.start,
                      week.end,
                    ),
                  }}
                  onClick={() => {
                    navigateModal(
                      `${MODAL_ROUTES.assignmentDetails}/${assignment.id}`,
                    );
                  }}
                ></button>
              )),
            )}
          </div>
        ))}
        {canExpand && <span className={rowClassName}></span>}

        {/* Week borders */}
        <div
          className={tw(
            rowClassName,
            "pointer-events-none absolute left-0 top-0 grid h-full w-full items-center gap-0 gap-x-0 !bg-transparent",
          )}
          style={{
            gridTemplateColumns: `repeat(${totalDaysColumns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${
              employeesToShow.length + (canExpand ? 2 : 1)
            }, minmax(0, 1fr))`,
          }}
        >
          {eachWeekOfInterval({ start: startDate, end: endDate }).map(
            (date) => (
              <div
                key={date.toISOString()}
                className="m-auto h-full w-full border border-l-0 border-neutrals-medium-300 text-center"
                style={{
                  gridColumn: getWeekBorderGridStyle(startDate, endDate, date),
                  gridRow: `2 / span ${employeesToShow.length}`,
                }}
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
};
