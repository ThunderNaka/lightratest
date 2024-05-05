import * as Tooltip from "@radix-ui/react-tooltip";
import {
  add,
  addMinutes,
  eachDayOfInterval,
  getDaysInMonth,
  isAfter,
  isBefore,
  isWeekend,
  startOfMonth,
} from "date-fns";
import { useSearchParams } from "react-router-dom";

import { tw } from "@lightit/shared";

import type { ProjectViewAssignment } from "~/api/assignments";
import { ASSIGNMENT_TYPE } from "~/shared.constants";
import type {
  AssignmentWithAssignable,
  Employee,
  Project,
  TimeInterval,
} from "~/shared.types";
import { getDateRange, getWeeks, searchParamToDate } from "~/utils";
import { AssignmentsGanttBlock } from "./AssignmentsGanttBlock";

export type PartialProject = Pick<Project, "name" | "type">;
export type PartialEmployee = Pick<Employee, "name" | "hours">;

type AssignmentsGanttProps = {
  employee: PartialEmployee;
  range: TimeInterval;
} & (
  | { project: PartialProject; assignments: ProjectViewAssignment[] }
  | { project?: undefined; assignments: AssignmentWithAssignable[] }
);

// TODO: Move it to the component folder
export const AssignmentsGantt = ({
  employee,
  assignments,
  range,
  project,
}: AssignmentsGanttProps) => {
  const [searchParams] = useSearchParams();
  const startDate = searchParamToDate(searchParams.get("startDate"));

  const dateRange = getDateRange(range, startDate);
  const days = eachDayOfInterval(dateRange);
  const weeks = getWeeks(days);

  const totalColumns =
    (range === "quarter" && weeks.length * 7) ||
    (range === "week" && 5) ||
    getDaysInMonth(startDate);

  const rangeDivision = range === "quarter" ? 7 : 1;
  const assignmentsWithinRange = assignments.filter(
    (assignment) =>
      !isAfter(
        getDateWithoutTimezoneOffset(new Date(assignment.fromDate)),
        dateRange.end,
      ) &&
      !isBefore(
        getDateWithoutTimezoneOffset(new Date(assignment.toDate)),
        dateRange.start,
      ),
  );

  function getDateWithoutTimezoneOffset(date: Date): Date {
    return addMinutes(date, date.getTimezoneOffset());
  }

  const timeOffs = assignmentsWithinRange.filter(
    (assignment) => assignment.type === "timeOff",
  );
  const projects = assignmentsWithinRange.filter(
    (assignment) => assignment.type === "project",
  );
  const courses = assignmentsWithinRange.filter(
    (assignment) => assignment.type === "course",
  );

  const getRowsAmount = project
    ? courses.length > 0 && projects.length > 0 // Condition only for AS
      ? 2 // Place project assignment in second row if there are other types of assignments
      : 1 // Place project assignment in a single row if there are no other types of assignments
    : assignments.length + 2;

  return (
    <div className={`grid grid-cols-1 grid-rows-1 ${!!project && "flex-1"}`}>
      {/* Columns */}
      <div
        className="col-start-1 col-end-2 row-start-1 grid grid-rows-1 divide-x"
        style={{
          gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({
          length: totalColumns / rangeDivision,
        }).map((_, idx) => (
          <div
            key={idx}
            className={tw(
              "flex items-center justify-center bg-white p-2 text-sm text-neutrals-medium-300",
              range === "month" &&
                isWeekend(add(startOfMonth(startDate), { days: idx })) &&
                "bg-neutrals-light-200",
            )}
            style={{
              gridColumn: `${idx * rangeDivision + 1} / span ${rangeDivision}`,
            }}
          />
        ))}
      </div>

      {/* Events */}
      <Tooltip.Provider delayDuration={100}>
        <ol
          className="col-start-1 col-end-2 row-start-1 grid gap-y-1"
          style={{
            gridTemplateRows: `repeat(${getRowsAmount}, minmax(2rem, 1fr))`,
            gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))`,
          }}
        >
          {assignmentsWithinRange.map((assignment, index) => {
            const props = project
              ? { project, assignment: assignment as ProjectViewAssignment }
              : { assignment: assignment as AssignmentWithAssignable };
            return (
              <AssignmentsGanttBlock
                timeInterval={range}
                key={assignment.id}
                employee={employee}
                index={index}
                days={days}
                totalColumns={totalColumns}
                isNotAlone={
                  assignment.type === ASSIGNMENT_TYPE.TIME_OFF
                    ? !!projects.length
                    : !!timeOffs.length
                }
                {...props}
              />
            );
          })}
        </ol>
      </Tooltip.Provider>
    </div>
  );
};
