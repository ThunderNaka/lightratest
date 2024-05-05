import { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { Chip, icons, Tooltip } from "@lightit/ui";

import type { AssignmentEmployee } from "~/api/assignments";
import { getEmployeeAvailableHours } from "~/api/employees";
import type { TimeInterval } from "~/shared.types";
import { formatFormDate, getDateRange, searchParamToDate } from "~/utils";

interface EmployeeItemChipProps {
  range: TimeInterval;
  employee: AssignmentEmployee;
}

export const EmployeeItemChip = ({
  range,
  employee,
}: EmployeeItemChipProps) => {
  const [enabled, setEnabled] = useState(false);
  const [searchParams] = useSearchParams();
  const startDate = searchParamToDate(searchParams.get("startDate"));
  const dateRange = getDateRange(range, startDate);

  const { data, isFetching } = useQuery({
    ...getEmployeeAvailableHours({
      id: employee.id,
      fromDate: formatFormDate(dateRange.start),
      toDate: formatFormDate(dateRange.end),
    }),
    enabled,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return (
    <Tooltip
      content={
        isFetching ? (
          <icons.SpinnerIcon className="h-4 w-4" />
        ) : (
          <p>Assignable hours: {data?.employeeAvailableHours ?? 0}</p>
        )
      }
      contentClassName="min-h-8 bg-gray-800 text-xs font-medium text-white"
      arrowClassName="fill-gray-800"
      onOpenChange={setEnabled}
    >
      <Chip
        size="sm"
        className={
          employee.isAssignable
            ? "bg-complementary-green-200 text-complementary-green-900"
            : "bg-complementary-red-50 text-complementary-red-600"
        }
      >
        <InformationCircleIcon className="h-4 w-4" />
        {employee.isAssignable ? "Assignable" : "Not assignable"}
      </Chip>
    </Tooltip>
  );
};
