import { Typography } from "@lightit/ui";

import { formatBackendDate } from "~/utils";

export const OverlappingMessage = ({
  overlappingAssignments,
}: {
  overlappingAssignments: {
    employeeName: string;
    dates: string;
  }[];
}) => {
  return (
    <ol className="flex w-full flex-col gap-2.5 p-1.5 pb-2">
      {overlappingAssignments.map((assignment) => (
        <li
          key={`overlapping-${assignment.employeeName}`}
          className="flex grow list-decimal flex-col gap-1"
        >
          <Typography variant="small" font="semiBold">
            {`${assignment.employeeName}`}
          </Typography>
          <ol className="grid grid-cols-2">
            {assignment.dates.split(",").map((date, idx) => (
              <li
                key={`overlapping-list-${assignment.employeeName}-${idx}`}
                className="list-inside odd:list-disc"
              >
                <Typography variant="small" className="inline">
                  {`${date.trim().split(" ")[0]}`}
                  {` ${formatBackendDate(date.trim().split(" ")[1])}`}
                </Typography>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
};
