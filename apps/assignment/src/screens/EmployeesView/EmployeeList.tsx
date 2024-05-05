import * as Accordion from "@radix-ui/react-accordion";

import { ScrollArea } from "@lightit/ui";

import type { AssignmentEmployee } from "~/api/assignments";
import { EmployeeItem } from "./EmployeeItem";
import { EmployeeItemSkeleton } from "./EmployeeItemSkeleton";

export const EmployeeList = ({
  employees,
  isLoadingEmployees,
  range,
}: {
  employees: AssignmentEmployee[];
  isLoadingEmployees: boolean;
  range: "quarter" | "month" | "week";
}) => {
  return (
    <ScrollArea className="-mx-8 grow">
      <Accordion.Root type="multiple">
        <ul className="flex flex-col gap-6 px-8">
          {isLoadingEmployees
            ? Array.from({ length: 5 }, (_, idx) => (
                <EmployeeItemSkeleton key={idx} />
              ))
            : employees.map((employee) => (
                <EmployeeItem
                  key={employee.id}
                  employee={employee}
                  range={range}
                />
              ))}
        </ul>
      </Accordion.Root>
    </ScrollArea>
  );
};
