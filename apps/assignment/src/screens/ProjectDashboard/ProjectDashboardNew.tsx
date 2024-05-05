import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { useSearchParams } from "react-router-dom";

import { icons, Input } from "@lightit/ui";

import { getProjectsWithEmployeesQuery } from "~/api/projects";
import { VIEW_MODE } from "~/shared.constants";
import { errorToast } from "~/utils";
import ProjectHeader from "./ProjectHeader";
import ProjectViewCard from "./ProjectViewCard";
import { ProjectViewFilters } from "./ProjectViewFilters";
import { ProjectViewMode } from "./ProjectViewMode";
import { ProjectViewTable } from "./ProjectViewTable";

const fuseOptions = {
  threshold: 0.1,
  keys: ["name"],
};

interface Filters {
  search: string;
  sortByName: boolean;
  sortByUpdatedAt: boolean;
  filterByArchived: boolean;
  filterByActive: boolean;
  filterByPaused: boolean;
}

export const ProjectDashboardNew = () => {
  const [selectedMode, setSelectedMode] = useState<
    typeof VIEW_MODE.GRID | typeof VIEW_MODE.LIST
  >("list");
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get("searchText") ?? "",
    sortByName: true,
    sortByUpdatedAt: false,
    filterByArchived: false,
    filterByActive: true,
    filterByPaused: false,
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: searchParams.get("searchText") ?? "",
    }));
  }, [searchParams]);

  const { data: projects, isLoading } = useQuery({
    ...getProjectsWithEmployeesQuery({
      sortByName: filters.sortByName,
      sortByUpdatedAt: filters.sortByUpdatedAt,
      filterByArchived: filters.filterByArchived,
      filterByActive: filters.filterByActive,
      filterByPaused: filters.filterByPaused,
    }),
    onError: errorToast,
  });

  const fuse = new Fuse(projects?.data ?? [], fuseOptions);

  const filteredProjects = filters.search
    ? fuse.search(filters.search).map((result) => result.item)
    : projects?.data;

  const handleSearchText = (text: string) => {
    setFilters((prev) => ({ ...prev, search: text }));
    setSearchParams((prev) => {
      let params = { ...Object.fromEntries(prev.entries()) };

      if (!text) {
        delete params.searchText;
      } else {
        params = { ...params, searchText: text };
      }

      return params;
    });
  };

  const pagination = {
    pageSize: 8,
    pageIndex: 1,
    count: 8,
    total: filteredProjects?.length ?? 0,
    totalPages: 3,
  };

  const sorting = [{ desc: false, id: "1" }];

  return (
    <div className="flex grow flex-col gap-6 p-8">
      <ProjectHeader />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            id="filter"
            left={<icons.MagnifyingGlassIcon />}
            onChange={(e) => handleSearchText(e.target.value)}
            value={filters.search}
            placeholder="Search project"
            size="sm"
            containerClassName="w-72"
          />
          <ProjectViewFilters />
        </div>

        <ProjectViewMode
          selectedMode={selectedMode}
          setMode={setSelectedMode}
        />
      </div>

      {selectedMode === VIEW_MODE.LIST ? (
        <ProjectViewTable
          projects={filteredProjects}
          isLoadingData={isLoading}
          pagination={pagination}
          sorting={sorting}
        />
      ) : (
        <ProjectViewCard />
      )}
    </div>
  );
};
