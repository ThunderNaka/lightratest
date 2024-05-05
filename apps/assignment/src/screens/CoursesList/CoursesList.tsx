import { useQuery } from "@tanstack/react-query";
import type { ColumnSort, PaginationState } from "@tanstack/react-table";
import { Link, useSearchParams } from "react-router-dom";

import { icons, Input } from "@lightit/ui";

import { getCoursesQuery } from "~/api/courses";
import { Breadcrumbs } from "~/components";
import { PERMISSIONS, usePermissions } from "~/hooks";
import useDebounce from "~/hooks/useDebounce";
import { ROUTES } from "~/router";
import { getSortingParams } from "~/utils";
import { CoursesTable } from "./CoursesTable";
import type { FiltersValues } from "./Filters";
import { Filters } from "./Filters";

export const CoursesList = () => {
  const { hasPermission } = usePermissions();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = +(searchParams.get("page") ?? 1);
  const pageSize = +(searchParams.get("pageSize") ?? 8);
  const sort = searchParams.get("sort") ?? "name";
  const searchText = searchParams.get("searchText") ?? "";
  const sorting = getSortingParams(sort);

  const filter: FiltersValues = {
    status: searchParams.get("status")?.split(",") ?? [],
    topic_id:
      searchParams
        .get("topic_id")
        ?.split(",")
        .map((id: string) => +id) ?? [],
    name: searchParams.get("searchText") ?? "",
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

  const { data, isLoading } = useQuery({
    ...getCoursesQuery({
      searchText: useDebounce(searchText, 500),
      page,
      pageSize,
      sort,
      filter,
      with: ["topics", "course"],
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
    setSearchParams((prev: URLSearchParams) => {
      for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value) && value.length) {
          prev.set(key, value.join(","));
        } else {
          prev.delete(key);
        }
      }

      return prev;
    });
  };

  return (
    <div className="flex grow flex-col gap-6 p-8">
      <header className="flex flex-col gap-4">
        <Breadcrumbs
          pages={[
            { name: "Home", href: ROUTES.base },
            {
              name: "Learning Center",
              href: ROUTES.learningCenter.coursesList,
            },
          ]}
        />

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Courses List</h1>

          {hasPermission(PERMISSIONS.createCourse) && (
            <Link
              to={ROUTES.learningCenter.newCourse}
              className="flex w-fit items-center rounded-md bg-nostalgia-purple-900 px-4 py-2 text-sm font-medium text-primary-white-500"
            >
              New Course
            </Link>
          )}
        </div>
      </header>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            value={searchText}
            onChange={(e) => handleSearchTextChange(e.target.value)}
            id="search"
            placeholder="Search course"
            size="sm"
            left={<icons.MagnifyingGlassIcon />}
            containerClassName="w-72"
          />
          <Filters defaultValues={filter} onFilterApply={handleFilterApply} />
        </div>
      </div>

      <CoursesTable
        courses={data?.data}
        isLoadingData={isLoading}
        pagination={pagination}
        sorting={sorting}
        onPaginationChange={handlePaginationChange}
        onSortingChange={handleSortingChange}
      />
    </div>
  );
};
