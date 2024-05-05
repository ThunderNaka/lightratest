/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { areIntervalsOverlapping, endOfDay, startOfDay } from "date-fns";
import Fuse from "fuse.js";
import { Link, useSearchParams } from "react-router-dom";

import { Button, icons, Input, Select } from "@lightit/ui";

import { AssignmentsNavigation, Breadcrumbs } from "~/components";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { MODAL_ROUTES, ROUTES, useNavigateModal } from "~/router";
import { INTERVAL_VIEW_OPTIONS, TIME_INTERVAL } from "~/shared.constants";
import type { TimeInterval } from "~/shared.types";
import {
  errorToast,
  getDateRange,
  normalizeString,
  parseBackendDate,
  searchParamToDate,
  searchParamToNumber,
} from "~/utils";
import { getAssignmentEmployeesQuery } from "../../api/assignments";
import { EmployeeList } from "./EmployeeList";
import { EmployeeListHeader } from "./EmployeeListHeader";
import type { FiltersValues } from "./Filters";
import { Filters } from "./Filters";

const fuseOptions = {
  threshold: 0.4,
  keys: ["name"],
};

export const EmployeesView = () => {
  const { hasPermission } = usePermissions();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchText = searchParams.get("searchText") ?? "";
  const startDate = searchParamToDate(searchParams.get("startDate"));
  const navigateModal = useNavigateModal();

  const [view, setView] = useState<TimeInterval>(TIME_INTERVAL.MONTH);

  const dateRange = getDateRange(view, startDate);

  const filter: FiltersValues = {
    project:
      searchParams
        .get("project")
        ?.split(",")
        .map((id: string) => +id) ?? [],
    employee:
      searchParams
        .get("employee")
        ?.split(",")
        .map((id: string) => +id) ?? [],
    type:
      searchParams
        .get("type")
        ?.split(",")
        .map((type: string) => type) ?? [],
    client: searchParamToNumber(searchParams.get("client")) ?? null,
    position: searchParams.get("position") ?? "",
    rateType:
      searchParams
        .get("rateType")
        ?.split(",")
        .map((rateType: string) => rateType) ?? [],
    team: searchParamToNumber(searchParams.get("team")) ?? null,
    displayNonAssignable: searchParams.get("displayNonAssignable") === "true",
  };

  const handleFilterApply = (params: FiltersValues) => {
    setSearchParams((prev) => {
      for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value) && value.length) {
          prev.set(key, value.join(","));
        } else if (!Array.isArray(value) && value) {
          prev.set(key, `${value}`);
        } else {
          prev.delete(key);
        }
      }

      return prev;
    });
  };

  const handleSearchTextChange = (text: string) =>
    setSearchParams((prev) => {
      if (text) {
        prev.set("searchText", text);
      } else {
        prev.delete("searchText");
      }

      return prev;
    });

  const { displayNonAssignable, ...filterToSend } = filter;

  const { data, isLoading } = useQuery({
    ...getAssignmentEmployeesQuery({
      ...filterToSend,
      ...(displayNonAssignable ? {} : { isAssignable: true }),
    }),
    onError: errorToast,
  });

  const filteredEmployees = useMemo(() => {
    const employees = (data?.data ?? [])
      .map((employee) => ({
        ...employee,
        assignments: employee.assignments.filter((assignment) => {
          const assignmentsDatesAreOverlapping = areIntervalsOverlapping(
            {
              start: startOfDay(parseBackendDate(assignment.fromDate)),
              end: endOfDay(parseBackendDate(assignment.toDate)),
            },
            dateRange,
          );

          const projectFilter =
            !filter.project ||
            (assignment.type === "project" &&
              filter.project.some(
                (project) => project === assignment.assignableId,
              ));

          const typeFilter =
            !filter.type ||
            filter.type.some((type) => type === assignment.type);

          const positionFilter =
            !filter.position || assignment.role === filter.position;

          return (
            assignmentsDatesAreOverlapping ||
            (projectFilter && typeFilter && positionFilter)
          );
        }),
      }))
      .filter(
        (employee) =>
          (!searchText ||
            normalizeString(employee.name).includes(
              normalizeString(searchText),
            )) &&
          (!filter.team ||
            employee.teams?.map((t) => t.id).includes(filter.team)),
      );

    if (!searchText) {
      return employees;
    }

    const fuse = new Fuse(employees, fuseOptions);

    return fuse.search(searchText).map((result) => result.item);
  }, [data?.data, dateRange, searchText, filter]);

  return (
    <div className="flex grow flex-col gap-6 p-8">
      <header className="flex flex-col gap-4">
        <Breadcrumbs
          pages={[
            { name: "Assignments", href: ROUTES.assignments.historyView },
            { name: "Employees view", href: ROUTES.assignments.employeesView },
          ]}
        />

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Assignments - Employees view</h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="sm"
              className="h-11"
              right={<icons.ArrowDownTrayIcon />}
              onClick={() => navigateModal(MODAL_ROUTES.exportAvailabilityForm)}
            >
              Download Availability
            </Button>
            {hasPermission(PERMISSIONS.createTeamAssignment) && (
              <Link
                to={ROUTES.assignments.newAssignment}
                className="flex items-center gap-1.5 rounded-md bg-nostalgia-purple-900 px-4 py-2 text-sm font-medium text-primary-white-500"
              >
                New Assignment
                <icons.PlusIcon className="h-5 w-5 stroke-[3]" />
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            value={searchText}
            onChange={(e) => handleSearchTextChange(e.target.value)}
            id="search"
            placeholder="Employee Name"
            size="sm"
            left={<icons.MagnifyingGlassIcon />}
            containerClassName="w-72"
          />
          <Filters defaultValues={filter} onFilterApply={handleFilterApply} />
        </div>

        <div className="flex items-center gap-2">
          <Select
            className="max-h-[38px]"
            value={view}
            onChange={(value) => setView(value)}
            options={INTERVAL_VIEW_OPTIONS}
          />

          <AssignmentsNavigation />
        </div>
      </div>

      <div className="isolate flex min-w-[37rem] grow flex-col gap-6">
        <EmployeeListHeader range={view} />

        <EmployeeList
          range={view}
          employees={filteredEmployees}
          isLoadingEmployees={isLoading}
        />
      </div>
    </div>
  );
};
