import * as Accordion from "@radix-ui/react-accordion";
import { Link } from "react-router-dom";

import { CircularAvatar, icons } from "@lightit/ui";

import type { AssignmentEmployee } from "~/api/assignments";
import { ROUTES } from "~/router";
import type { TimeInterval } from "~/shared.types";
import { AssignmentsGantt } from "./AssignmentsGantt";
import { EmployeeItemChip } from "./EmployeeItemChip";

export const EmployeeItem = ({
  employee,
  range,
}: {
  employee: AssignmentEmployee;
  range: TimeInterval;
}) => {
  return (
    <li>
      <Accordion.Item
        value={`${employee.id}`}
        className="divide-y overflow-hidden rounded-2xl border"
      >
        <Accordion.Trigger className="flex w-full items-center p-4 duration-300 data-[state=open]:rounded-b-none [&[data-state=closed]>div:last-child]:before:content-['Expand'] [&[data-state=open]>div:last-child>svg]:rotate-90 [&[data-state=open]>div:last-child]:before:content-['Collapse']">
          <div className="flex w-1/4 items-center gap-3 text-left">
            <CircularAvatar size="md" image={employee.avatarUrl} />
            <div className="flex min-w-0 flex-col gap-1">
              <Link
                to={`${ROUTES.employees}/${employee.id}`}
                className="underline-offset-2 hover:underline"
              >
                <h4 className="grow truncate font-semibold text-neutrals-dark-900">
                  {employee.name}
                </h4>
              </Link>
              <p className="truncate text-xs font-medium text-neutrals-dark-300">
                {employee.jobTitle}
              </p>
            </div>
          </div>

          <div className="flex grow items-center justify-center text-sm">
            <div className="relative">
              <span className="absolute right-full top-0 hidden max-w-[11rem] truncate px-4 lg:block">
                {employee.jobTitle}
              </span>
              <span className="px-4 lg:border-x">{`${employee.hours}${
                employee.hours ?? 0 > 1 ? " daily hours" : " daily hour"
              }`}</span>
              <span className="absolute left-full top-0 whitespace-nowrap px-4">
                <EmployeeItemChip range={range} employee={employee} />
              </span>
            </div>
          </div>

          <div className="flex w-1/4 items-center justify-end gap-1.5 px-4 py-2 text-sm text-nostalgia-purple-900">
            <icons.ChevronRightIcon
              className="h-4 w-4 shrink-0 stroke-[3] duration-200"
              aria-hidden="true"
            />
          </div>
        </Accordion.Trigger>
        <Accordion.Content className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <AssignmentsGantt
            assignments={employee.assignments ?? []}
            employee={{
              name: employee.name,
              hours: employee.hours,
            }}
            range={range}
          />
        </Accordion.Content>
      </Accordion.Item>
    </li>
  );
};
