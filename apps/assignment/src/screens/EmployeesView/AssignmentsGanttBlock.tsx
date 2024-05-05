import * as Tooltip from "@radix-ui/react-tooltip";

import { tw } from "@lightit/shared";
import { Button, icons, IconWrapper } from "@lightit/ui";

import type { ProjectViewAssignment } from "~/api/assignments";
import { MODAL_ROUTES, useNavigateModal } from "~/router";
import {
  ASSIGNMENT_TYPE,
  RATE_TYPE,
  TIME_INTERVAL,
  TIME_OFF_TYPE,
} from "~/shared.constants";
import type { AssignmentWithAssignable, TimeInterval } from "~/shared.types";
import { formatBackendDateToVerbose, searchParamToDate } from "~/utils";
import { AssignmentGanttBarContent } from "./AssignmentGanttBarContent";
import type { PartialEmployee, PartialProject } from "./AssignmentsGantt";
import { AssignmentsGanttTooltip } from "./AssignmentsGanttTooltip";

export const ASSIGNMENT_ICON = {
  [ASSIGNMENT_TYPE.COURSE]: <icons.Course />,
  [RATE_TYPE.BILLABLE]: <icons.Billable />,
  [RATE_TYPE.NON_BILLABLE]: <icons.NonBillable />,
  [RATE_TYPE.OVER_SERVICING]: <icons.OverServicing />,
  [RATE_TYPE.SUBSTITUTION]: <icons.Substitution />,
} as const;

export const TIME_OFF_ICON = {
  [TIME_OFF_TYPE.SICK]: <icons.TimeOffSickDay />,
  [TIME_OFF_TYPE.VACATION]: <icons.TimeOffVacation />,
  [TIME_OFF_TYPE.STUDY_DAYS]: <icons.TimeOffStudyDay />,
  [TIME_OFF_TYPE.UNPAID_VACATION]: <icons.TimeOffVacation />,
} as const;

type AssignmentsGanttBlockProps = {
  employee: PartialEmployee;
  days: Date[];
  totalColumns: number;
  index: number;
  timeInterval: TimeInterval;
  isNotAlone?: boolean;
} & (
  | {
      project: PartialProject;
      assignment: ProjectViewAssignment;
    }
  | {
      project?: undefined;
      assignment: AssignmentWithAssignable;
    }
);

export const AssignmentsGanttBlock = ({
  employee,
  days,
  assignment,
  totalColumns,
  index,
  timeInterval,
  isNotAlone,
  project,
}: AssignmentsGanttBlockProps) => {
  const navigateModal = useNavigateModal();

  const getColStart = (date: string) => {
    const colIndex = days.findIndex(
      (day) => day.valueOf() === searchParamToDate(date).valueOf(),
    );

    return colIndex === -1 ? 1 : colIndex + 1;
  };

  const getColEnd = (date: string) => {
    const colIndex = days.findIndex(
      (day) => day.valueOf() === searchParamToDate(date).valueOf(),
    );

    return colIndex === -1 ? totalColumns + 2 : colIndex + 2;
  };

  const getRowCalc = () => {
    if (project) {
      if (assignment.type === "timeOff") {
        return `1 / span ${isNotAlone ? 1 : 1}`;
      }
      return isNotAlone ? 1 : 1;
    }
    return index + 2;
  };

  const getBarData = () => {
    if (assignment.type === ASSIGNMENT_TYPE.TIME_OFF) {
      return `${formatBackendDateToVerbose(
        assignment.fromDate,
      )} - ${formatBackendDateToVerbose(assignment.toDate)}`;
    }

    if (project) {
      // ProjectView
      return `${assignment.hours}hs/${employee.hours}hs`;
    } else {
      // EmployeeView
      return `${assignment.assignable.name} - ${assignment.hours}hs/${employee.hours}hs`;
    }
  };

  const getAssignmentIcon = () => {
    if (assignment.type === ASSIGNMENT_TYPE.TIME_OFF) {
      return TIME_OFF_ICON[
        project ? assignment.timeOffType : assignment.assignable.type
      ];
    }

    return ASSIGNMENT_ICON[
      assignment.type === ASSIGNMENT_TYPE.COURSE
        ? assignment.type
        : assignment.rateType
    ];
  };

  const columnStart = getColStart(assignment.fromDate);
  const columnEnd = getColEnd(assignment.toDate);

  const totalColumnsUsed = columnEnd - columnStart;

  const tooltipProps = project
    ? { project, assignment, employee }
    : { assignment, employee };

  const compactBarContent =
    timeInterval === TIME_INTERVAL.QUARTER
      ? totalColumnsUsed <= 3
      : timeInterval !== TIME_INTERVAL.WEEK && totalColumnsUsed === 1;

  const hideBarContent =
    timeInterval === TIME_INTERVAL.QUARTER && totalColumnsUsed <= 1;

  const compactNotes =
    timeInterval === TIME_INTERVAL.QUARTER
      ? totalColumnsUsed <= 5
      : totalColumnsUsed <= 3;

  const deletedAssignable = !project && !!assignment.assignable.deletedAt;

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <li
          className={tw(
            "relative flex py-2 hover:z-20",
            assignment.type === "timeOff" && "z-10",
          )}
          style={{
            gridRow: getRowCalc(),
            gridColumnStart: columnStart,
            gridColumnEnd: columnEnd,
          }}
        >
          {!!assignment.notes && compactNotes && (
            <div
              className={tw(
                "absolute right-2 top-1/2 isolate z-10 h-7 w-7 -translate-y-1/2 rounded-full bg-complementary-blue-600 p-2",
                totalColumnsUsed < 3 &&
                  "right-0 top-0 h-3 w-3 translate-x-1/2 translate-y-0",
                assignment.type === ASSIGNMENT_TYPE.PROJECT &&
                  (project?.type === "client" ||
                  (!project && assignment.assignable?.type === "client")
                    ? "bg-complementary-blue-600"
                    : "bg-secondary-900"),
              )}
            />
          )}
          <Button
            onClick={() =>
              navigateModal(
                `${MODAL_ROUTES.assignmentDetails}/${assignment?.id}`,
              )
            }
            className={tw(
              "group flex-1 cursor-pointer truncate rounded-none border px-0 py-1 text-sm transition-all hover:shadow-full focus:border-neutrals-dark-200 focus:bg-neutrals-dark-500 focus:text-white",
              assignment.type === ASSIGNMENT_TYPE.PROJECT &&
                (project?.type === "client" ||
                (!project && assignment.assignable?.type === "client")
                  ? "border-complementary-blue-600 bg-complementary-blue-100 text-complementary-blue-600 hover:bg-complementary-blue-300"
                  : "border-secondary-600 bg-secondary-100 text-secondary-600 hover:bg-secondary-300"),
              assignment.type === "timeOff" &&
                "border-gray-800 bg-gray-100 bg-opacity-80 text-black hover:bg-gray-50",
              assignment.type === "course" &&
                "border-yellow-700 bg-yellow-300 bg-opacity-80 text-black hover:bg-yellow-500",
              assignment.type === "timeOff" &&
                isNotAlone &&
                "backdrop-blur-[1px] hover:backdrop-blur-sm",
            )}
          >
            {!hideBarContent && (
              <AssignmentGanttBarContent
                deleted={deletedAssignable}
                icon={getAssignmentIcon()}
                data={getBarData()}
                compact={compactBarContent}
                notesIcon={
                  !!assignment.notes &&
                  !compactNotes && (
                    <IconWrapper
                      className={tw(
                        "rounded-full bg-complementary-blue-600 p-1.5",
                        project?.type === "client"
                          ? "bg-complementary-blue-600"
                          : "bg-secondary-600",
                      )}
                    >
                      <icons.DocumentIcon className="shrink-0 stroke-2 text-white" />
                    </IconWrapper>
                  )
                }
              />
            )}
          </Button>
        </li>
      </Tooltip.Trigger>
      <Tooltip.Content className="z-50 rounded-lg shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
        <AssignmentsGanttTooltip {...tooltipProps} />
        <Tooltip.Arrow className="fill-primary-500" />
      </Tooltip.Content>
    </Tooltip.Root>
  );
};
