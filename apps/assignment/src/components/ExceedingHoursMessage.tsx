import { Typography } from "@lightit/ui";

import { formatBackendDate } from "~/utils";

export const ExceedingHoursMessage = ({
  overlappingAssignments,
}: {
  overlappingAssignments: {
    assignableName: string;
    assignedFrom: string;
    assignedTo: string;
    assignedHours: number;
    employeeName?: string;
  }[];
}) => {
  return (
    <ol className="flex w-full flex-col gap-2.5 p-1.5 pb-2">
      {overlappingAssignments.map((assignment) => (
        <li
          key={`overlapping-${assignment.assignableName}`}
          className="flex grow list-decimal flex-col gap-1"
        >
          <Typography variant="small" font="semiBold">
            {assignment.employeeName && <>{`${assignment.employeeName} in `}</>}
            {`${assignment.assignableName}`}
          </Typography>

          <ol>
            <li
              key={`overlapping-from-${assignment.assignableName}`}
              className="list-inside list-disc"
            >
              <Typography variant="small" className="inline">
                <b>From:</b> {` ${formatBackendDate(assignment.assignedFrom)}`}
              </Typography>
            </li>

            <li
              className="list-inside list-disc"
              key={`overlapping-to-${assignment.assignableName}`}
            >
              <Typography variant="small" className="inline">
                <b>To:</b>
                {` ${formatBackendDate(assignment.assignedTo)}`}
              </Typography>
            </li>

            <li
              className="list-inside list-disc"
              key={`overlapping-hours-${assignment.assignableName}`}
            >
              <Typography variant="small" className="inline">
                Assigned {assignment.assignedHours}hs
              </Typography>
            </li>
          </ol>
        </li>
      ))}
    </ol>
  );
};
