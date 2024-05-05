import { useQuery } from "@tanstack/react-query";
import type { ColumnSort, PaginationState } from "@tanstack/react-table";
import { Link, useSearchParams } from "react-router-dom";

import { icons, Input } from "@lightit/ui";

import { getHistoryViewAssignmentsQuery } from "~/api/assignments";
import { AssignmentsNavigation, Breadcrumbs } from "~/components";
import { PERMISSIONS, usePermissions } from "~/hooks";
import useDebounce from "~/hooks/useDebounce";
import { ROUTES } from "~/router";
import { getSortingParams, searchParamToNumber } from "~/utils";
import { BambooSyncButton } from "./BambooSyncButton";
import type { FiltersValues } from "./Filters";
import { Filters } from "./Filters";
import { HistoryViewTable } from "./HistoryViewTable";

export const HistoryView = () => {
  const { hasPermission } = usePermissions();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = +(searchParams.get("page") ?? 1);
  const pageSize = +(searchParams.get("pageSize") ?? 8);
  const sort = searchParams.get("sort") ?? "-updatedAt";
  const sorting = getSortingParams(sort);
  const searchText = searchParams.get("searchText") ?? "";
  const filter: FiltersValues = {
    assignable: searchParams.get("assignable") ?? "",
    assignedById: searchParamToNumber(searchParams.get("assignedById")),
    employeeId: searchParamToNumber(searchParams.get("employeeId")),
    type: searchParams.get("type") ?? "",
    fromDate: searchParams.get("fromDate") ?? "",
    toDate: searchParams.get("toDate") ?? "",
    isNotified: searchParams.get("isNotified") ?? "",
    "employee.name": searchParams.get("searchText") ?? "",
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

  const resetPage = () => {
    handlePaginationChange({
      pageSize: pageSize || 8,
      pageIndex: 0,
    });
  };

  const { data, isLoading } = useQuery({
    ...getHistoryViewAssignmentsQuery({
      searchText: useDebounce(searchText, 500),
      page,
      pageSize,
      sort,
      filter,
      with: ["assignable", "employee", "assignedBy"],
    }),
    keepPreviousData: true,
  });

  const pagination = {
    pageSize,
    pageIndex: page - 1,
    count: data?.pagination.count ?? 0,
    total: data?.pagination.total ?? 0,
    totalPages: data?.pagination.totalPages ?? 0,
  };

  const handlePaginationChange = (params: PaginationState) => {
    setSearchParams((prev) => {
      !Number.isNaN(params.pageIndex)
        ? prev.set("page", `${params.pageIndex + 1}`)
        : prev.delete("page");
      !Number.isNaN(params.pageSize)
        ? prev.set("pageSize", `${params.pageSize}`)
        : prev.delete("pageSize");

      return prev;
    });
  };

  const handleSortingChange = (params: ColumnSort[]) => {
    const updatedSort = params[0];

    setSearchParams((prev) => {
      if (updatedSort) {
        prev.set("sort", `${updatedSort.desc ? "-" : ""}${updatedSort.id}`);
      } else {
        prev.delete("sort");
      }

      return prev;
    });
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
    resetPage();
  };

  return (
    <div className="flex grow flex-col gap-6 p-8">
      <header className="flex flex-col gap-4">
        <Breadcrumbs
          pages={[
            { name: "Assignments", href: ROUTES.assignments.historyView },
            { name: "History view", href: ROUTES.assignments.historyView },
          ]}
        />

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Assignments - History view</h1>

          <div className="flex items-center gap-2">
            <BambooSyncButton lastSyncDate={data?.lastTimeOffSync} />
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

        <AssignmentsNavigation />
      </div>

      <HistoryViewTable
        assignments={data?.data}
        isLoadingData={isLoading}
        pagination={pagination}
        sorting={sorting}
        onPaginationChange={handlePaginationChange}
        onSortingChange={handleSortingChange}
      />
    </div>
  );
};
