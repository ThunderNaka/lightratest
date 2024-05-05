import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { icons, Input, Select } from "@lightit/ui";

import { AssignmentsNavigation, Breadcrumbs } from "~/components";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { ROUTES } from "~/router";
import { INTERVAL_VIEW_OPTIONS, TIME_INTERVAL } from "~/shared.constants";
import type { TimeInterval } from "~/shared.types";
import { formatFormDate, parseBackendDate, searchParamToNumber } from "~/utils";
import { EmployeeListHeader as ProjectListHeader } from "../EmployeesView/EmployeeListHeader";
import type { FiltersValues } from "./Filters";
import { Filters } from "./Filters";
import { ProjectHoursTab } from "./ProjectHoursTab";

export const ProjectHoursDashboard = () => {
  const { hasPermission } = usePermissions();
  const [startDate, setStartDate] = useState(new Date());
  const [searchText, setSearchText] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<TimeInterval>(TIME_INTERVAL.MONTH);

  const filter: FiltersValues = {
    project: searchParamToNumber(searchParams.get("project")),
    projectType: searchParams.get("projectType") ?? "",
    client: searchParamToNumber(searchParams.get("client")),
    employee: searchParamToNumber(searchParams.get("employee")),
    rateType: searchParams.get("rateType") ?? "",
    projectStatus: searchParams.get("projectStatus") ?? "",
  };

  const handleFilterApply = (params: FiltersValues) => {
    setSearchParams((prev) => {
      for (const [key, value] of Object.entries(params)) {
        if (value) {
          prev.set(key, `${value}`);
        } else {
          prev.delete(key);
        }
      }

      return prev;
    });
  };

  useEffect(() => {
    const startDateParam = parseBackendDate(
      searchParams.get("startDate") ?? formatFormDate(new Date()),
    );
    setStartDate(startDateParam);

    const queryParam = searchParams.get("query") ?? "";
    setSearchText(queryParam);
  }, [searchParams]);

  return (
    <div className="flex h-full w-full flex-col gap-6 overflow-hidden p-8">
      <header className="flex flex-col gap-4">
        <Breadcrumbs
          pages={[
            {
              name: "Assignments",
              href: ROUTES.assignments.historyView,
            },
            {
              name: "Project view",
              href: ROUTES.assignments.projectView,
            },
          ]}
        />
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Assignments - Project view</h1>

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
      </header>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            className="w-72"
            size="sm"
            id="id"
            left={<icons.MagnifyingGlassIcon />}
            placeholder="Projects..."
            value={searchText}
            onChange={(event) => {
              const inputValue = event.target.value;
              setSearchText(() => inputValue);

              setSearchParams((prev) => {
                let params = { ...Object.fromEntries(prev.entries()) };

                if (!inputValue) {
                  delete params.query;
                } else {
                  params = { ...params, query: inputValue };
                }

                return params;
              });
            }}
          />
          <Filters defaultValues={filter} onFilterApply={handleFilterApply} />
        </div>
        <div className="flex gap-2">
          <Select
            className="max-h-[38px]"
            value={view}
            onChange={(value) => setView(value)}
            options={INTERVAL_VIEW_OPTIONS}
          />
          <AssignmentsNavigation />
        </div>
      </div>

      <ProjectListHeader range={view} isProjectView />
      <ProjectHoursTab
        date={startDate}
        searchText={searchText}
        filter={filter}
        range={view}
      />
    </div>
  );
};
