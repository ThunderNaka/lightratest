import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { tw } from "@lightit/shared";
import { Button, icons, Input, ScrollArea, Tabs } from "@lightit/ui";

import {
  getProjectsStatsQuery,
  getProjectsWithEmployeesQuery,
} from "~/api/projects";
import type { Stats } from "~/api/projects";
import { Breadcrumbs, ScreenLoading } from "~/components";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { MODAL_ROUTES, ROUTES, useNavigateModal } from "~/router";
import { errorToast } from "~/utils";
import { ProjectCard } from "./ProjectCard";

interface Filters {
  search: string;
  sortByName: boolean;
  sortByUpdatedAt: boolean;
  filterByArchived: boolean;
  filterByActive: boolean;
  filterByPaused: boolean;
}

const tabs = ["All", "Recent", "Active", "Paused", "Archived"] as const;
type Tabs = (typeof tabs)[number];

const getTabStats = (tab: Tabs, stats?: Stats) => {
  if (!stats) {
    return "";
  }
  switch (tab) {
    case "Active":
      return `(${stats.activeProjectsCount})`;
    case "Archived":
      return `(${stats.archivedProjectsCount})`;
    case "Paused":
      return `(${stats.pausedProjectsCount})`;
    case "All":
      return "";
    case "Recent":
      return "";
  }
};

export const ProjectDashboard = () => {
  const navigateModal = useNavigateModal();
  const [activeStatusFilter, setActiveStatusFilter] = useState<Tabs>(tabs[2]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get("query") ?? "",
    sortByName: true,
    sortByUpdatedAt: false,
    filterByArchived: false,
    filterByActive: true,
    filterByPaused: false,
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: searchParams.get("query") ?? "",
    }));
  }, [searchParams]);

  const { data: projects } = useQuery({
    ...getProjectsWithEmployeesQuery({
      sortByName: filters.sortByName,
      sortByUpdatedAt: filters.sortByUpdatedAt,
      filterByArchived: filters.filterByArchived,
      filterByActive: filters.filterByActive,
      filterByPaused: filters.filterByPaused,
    }),
    onError: errorToast,
  });

  const { data: stats } = useQuery({
    ...getProjectsStatsQuery(),
    onError: errorToast,
  });

  const filteredProjects = projects?.data.filter(
    (project) =>
      !filters.search ||
      project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      project.client.name.toLowerCase().includes(filters.search.toLowerCase()),
  );

  const { hasPermission } = usePermissions();
  const canCreateProject =
    hasPermission(PERMISSIONS.createClientProject) ||
    hasPermission(PERMISSIONS.createInternalProject);
  return (
    <div className="flex h-full w-full flex-col overflow-hidden p-8">
      <Breadcrumbs pages={[{ name: "Projects", href: ROUTES.projects.base }]} />

      <div className="my-4 flex flex-row justify-between px-8">
        <div className="flex flex-wrap items-center gap-4">
          <Input
            id="filter"
            left={<icons.MagnifyingGlassIcon width={16} />}
            onChange={(event) => {
              setFilters((prev) => ({ ...prev, search: event.target.value }));
              setSearchParams((prev) => {
                let params = { ...Object.fromEntries(prev.entries()) };

                if (!event.target.value) {
                  delete params.query;
                } else {
                  params = { ...params, query: event.target.value };
                }

                return params;
              });
            }}
            value={filters.search}
            placeholder="Clients and Projects..."
          />

          <Tabs
            className="gap-1"
            tabs={tabs}
            value={activeStatusFilter}
            onChange={(status) => {
              setActiveStatusFilter(status);

              setFilters((prev) => ({
                ...prev,
                sortByUpdatedAt: status === "Recent",
                filterByArchived: status === "Archived",
                filterByActive: status === "Active",
                filterByPaused: status === "Paused",
              }));
            }}
            renderTab={({ tab, onClick, selected }) => (
              <Button
                key={tab}
                variant={selected ? "secondary" : "tertiary-link"}
                className={tw(
                  "border-0 px-4 py-2 text-sm text-neutrals-medium",
                  selected && "text-secondary-500",
                )}
                onClick={onClick}
              >
                {tab}
                {getTabStats(tab, stats)}
              </Button>
            )}
          />
        </div>

        {canCreateProject && (
          <Button
            variant="secondary"
            size="sm"
            className="h-9 min-w-max"
            right={<icons.PlusCircleIcon />}
            onClick={() => navigateModal(MODAL_ROUTES.projectForm)}
          >
            Add New
          </Button>
        )}
      </div>

      {!filteredProjects || !stats ? (
        <ScreenLoading />
      ) : (
        <ScrollArea className="grow px-6">
          <div className="grid grid-cols-1 gap-x-5 gap-y-4 py-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProjects?.map((project) => (
              <div key={project.id} className="min-w-[200px] max-w-[300px]">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
