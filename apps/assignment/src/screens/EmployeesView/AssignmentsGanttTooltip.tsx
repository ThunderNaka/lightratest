import { tw } from "@lightit/shared";
import { icons, IconWrapper } from "@lightit/ui";

import type { ProjectViewAssignment } from "~/api/assignments";
import { ASSIGNMENT_TYPE, TIME_OFF_TYPE } from "~/shared.constants";
import type { AssignmentWithAssignable } from "~/shared.types";
import { formatBackendDateToVerbose } from "~/utils";
import type { PartialEmployee, PartialProject } from "./AssignmentsGantt";
import { ASSIGNMENT_ICON, TIME_OFF_ICON } from "./AssignmentsGanttBlock";

type AssignmentsGanttTooltip = {
  assignment: ProjectViewAssignment | AssignmentWithAssignable;
  employee: PartialEmployee;
} & (
  | {
      project: PartialProject;
      assignment: ProjectViewAssignment;
    }
  | {
      project: undefined;
      assignment: AssignmentWithAssignable;
    }
);

export const AssignmentsGanttTooltip = ({
  assignment,
  employee,
  project,
}: AssignmentsGanttTooltip) => {
  const timeOffType =
    assignment.type === ASSIGNMENT_TYPE.TIME_OFF &&
    ((project && assignment.timeOffType) ??
      (!project && assignment.assignable.type));

  const projectData =
    assignment.type === ASSIGNMENT_TYPE.PROJECT
      ? project ?? assignment.assignable
      : undefined;

  const deletedAssignable = !project && !!assignment.assignable.deletedAt;

  return (
    <div
      className={tw(
        "flex gap-4 rounded-md bg-primary-500 p-4 pb-6",
        assignment.type === ASSIGNMENT_TYPE.PROJECT && "w-96",
        assignment.type === ASSIGNMENT_TYPE.TIME_OFF && "w-64",
      )}
    >
      <IconWrapper
        size="lg"
        className="shrink-0 rounded-full bg-secondary-50 p-1"
      >
        {assignment.type === ASSIGNMENT_TYPE.PROJECT &&
          ASSIGNMENT_ICON[assignment.rateType]}

        {assignment.type === ASSIGNMENT_TYPE.COURSE &&
          ASSIGNMENT_ICON[assignment.type]}

        {assignment.type === ASSIGNMENT_TYPE.TIME_OFF &&
          timeOffType &&
          TIME_OFF_ICON[timeOffType]}
      </IconWrapper>

      <div className="flex w-5/6 flex-col gap-4 text-sm text-neutrals-medium-500">
        <header className="flex flex-col gap-2">
          <h4
            className={tw(
              "text-base font-semibold text-white",
              deletedAssignable &&
                assignment.type === ASSIGNMENT_TYPE.TIME_OFF &&
                "line-through",
            )}
          >
            {assignment.type === ASSIGNMENT_TYPE.PROJECT && "Working hours"}
            {assignment.type === ASSIGNMENT_TYPE.COURSE && "Course hours"}
            {assignment.type === ASSIGNMENT_TYPE.TIME_OFF &&
              ((timeOffType === TIME_OFF_TYPE.SICK && "Sick days") ||
                (timeOffType === TIME_OFF_TYPE.STUDY_DAYS && "Study days") ||
                ((timeOffType === TIME_OFF_TYPE.VACATION ||
                  timeOffType === TIME_OFF_TYPE.UNPAID_VACATION) &&
                  "Holidays"))}
          </h4>
          <div className="flex flex-row items-center justify-between gap-4">
            <p
              className={tw(
                "truncate font-semibold text-neutrals-medium-400",
                assignment.type === ASSIGNMENT_TYPE.PROJECT && "w-1/2",
              )}
            >
              {employee.name}
            </p>
            <div
              className={tw(
                "flex w-1/2 items-center justify-end gap-1.5 truncate",
                assignment.type !== ASSIGNMENT_TYPE.PROJECT && "hidden",
              )}
            >
              <icons.CalendarIcon className="h-3 w-3 stroke-2" />
              <p>{`${formatBackendDateToVerbose(
                assignment.fromDate,
              )} - ${formatBackendDateToVerbose(assignment.toDate)}`}</p>
            </div>
          </div>
        </header>

        {assignment.type === ASSIGNMENT_TYPE.PROJECT && projectData && (
          <div className="border border-neutrals-dark-400" />
        )}

        {/* Assignable details */}
        <div className="flex w-full flex-col gap-3">
          {assignment.type === ASSIGNMENT_TYPE.PROJECT && projectData && (
            <>
              <div className="flex items-center gap-1">
                <icons.BriefcaseIcon className="h-4 w-4 stroke-2" />
                <p className={tw(deletedAssignable && "line-through")}>
                  {projectData.name}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <icons.ClockIcon className="h-4 w-4 stroke-2" />
                  <p>{`${assignment.hours}${
                    assignment.hours > 1 ? "hs" : "h"
                  } / ${employee.hours}hs`}</p>
                </div>
                <div className="flex items-center gap-1">
                  <icons.CurrencyDollarIcon className="h-4 w-4 stroke-2" />
                  <p>{`USD ${assignment.hourlyRate}/h`}</p>
                </div>
              </div>
            </>
          )}

          {assignment.type === ASSIGNMENT_TYPE.COURSE && (
            <div className="flex items-center gap-1">
              <icons.LightBulbIcon className="h-4 w-4 stroke-2" />
              <p className={tw(deletedAssignable && "line-through")}>
                {!project && assignment.assignable.name}
              </p>
            </div>
          )}

          {(assignment.type === ASSIGNMENT_TYPE.TIME_OFF ||
            assignment.type === ASSIGNMENT_TYPE.COURSE) && (
            <div className="flex items-center gap-1.5 truncate">
              <icons.CalendarIcon className="h-3 w-3 stroke-2" />
              <p>{`${formatBackendDateToVerbose(
                assignment.fromDate,
              )} - ${formatBackendDateToVerbose(assignment.toDate)}`}</p>
            </div>
          )}

          {assignment.notes && (
            <div className="flex grow gap-1">
              <div className="pt-1">
                <icons.ChatBubbleBottomCenterTextIcon className="h-4 w-4 stroke-2" />
              </div>
              <p className="line-clamp-2 w-full text-ellipsis">
                {assignment.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
