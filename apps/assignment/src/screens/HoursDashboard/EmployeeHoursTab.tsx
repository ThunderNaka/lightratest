import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { add, format, isSunday, parse, previousSunday } from "date-fns";
import Fuse from "fuse.js";

import { ScrollArea } from "@lightit/ui";

import type { EmployeeWithAssignments } from "~/api/employees";
import { getEmployeesWithAssignmentsQuery } from "~/api/employees";
import { ScreenLoading } from "~/components";
import { errorToast } from "~/utils";
import { EmployeeHeader, EmployeeHours } from "./HourCalendar";

const fuseOptions = {
  threshold: 0.4,
  keys: ["name"],
};

export const parseDate = (dateString?: string) => {
  if (!dateString) {
    dateString = new Date().toISOString().substr(0, 10);
  }
  return parse(dateString, "yyyy-MM-dd", new Date());
};

// TODO: review this entire function, it's a little bit on the complex and odd side
export const getEmployees = (
  startDate: Date,
  endDate: Date,
  employees?: EmployeeWithAssignments[],
) => {
  if (!employees) {
    return [];
  }
  // Get projects, with the employees and their assignments
  // filter assignments that match the given dates
  return employees
    .map((e) => ({
      ...e,
      assignments: e.assignments
        ?.filter((a) => {
          const fromDate = parseDate(a.fromDate);
          const toDate = parseDate(a.toDate);

          return (
            (fromDate >= startDate && fromDate <= endDate) ||
            (toDate >= startDate && toDate <= endDate) ||
            (fromDate <= startDate && toDate >= endDate)
          );
        })
        .map((a) => ({
          ...a,
          fromDate:
            parseDate(a.fromDate) < startDate
              ? format(startDate, "yyyy-MM-dd")
              : a.fromDate,
          toDate:
            !!a.toDate && parseDate(a.toDate) < endDate
              ? a.toDate
              : format(endDate, "yyyy-MM-dd"),
        })),
    }))
    .sort((a, b) =>
      a.assignments?.length ?? 0 < (b.assignments?.length ?? 0) ? -1 : 1,
    );
};

export interface EmployeeHoursTabProps {
  date: Date;
  searchText: string;
  onEmployeeSelected: (employee: EmployeeWithAssignments) => void;
}

export const EmployeeHoursTab = ({
  date,
  searchText,
  onEmployeeSelected,
}: EmployeeHoursTabProps) => {
  const startDate = isSunday(date) ? date : previousSunday(date);
  const endDate = add(startDate, { days: 6 });

  const { data, isLoading: getEmployeesLoading } = useQuery({
    ...getEmployeesWithAssignmentsQuery(),
    onError: errorToast,
  });

  const filteredEmployees = useMemo(() => {
    const employees = getEmployees(startDate, endDate, data?.data);

    if (!searchText) {
      return employees;
    }

    const fuse = new Fuse(employees, fuseOptions);

    return fuse.search(searchText).map((result) => result.item);
  }, [data, searchText, startDate, endDate]);

  return (
    <section className="flex h-full w-full min-w-[50rem] flex-grow  flex-col overflow-hidden">
      <EmployeeHeader startDate={startDate} endDate={endDate} />
      <ScrollArea>
        {filteredEmployees.map((employee) => (
          <EmployeeHours
            key={employee.id}
            startDate={startDate}
            endDate={endDate}
            employee={employee}
            onEmployeeSelected={onEmployeeSelected}
          />
        ))}

        {getEmployeesLoading && <ScreenLoading />}

        {!filteredEmployees.length && !getEmployeesLoading && (
          <div className="flex items-center justify-center py-44 text-center text-xl">
            No assignments found for the given period
          </div>
        )}
      </ScrollArea>
    </section>
  );
};
