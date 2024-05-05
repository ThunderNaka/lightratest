import React, { useMemo } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { useQuery } from "@tanstack/react-query";
import { isAfter, isBefore } from "date-fns";
import Fuse from "fuse.js";
import { Link } from "react-router-dom";

import { tw } from "@lightit/shared";
import { Chip, icons, ScrollArea } from "@lightit/ui";

import { getProjectViewProjectsQuery } from "~/api/assignments";
import { Empty } from "~/assets";
import { ScreenLoading } from "~/components";
import { MODAL_ROUTES, ROUTES, useNavigateModal } from "~/router";
import { PROJECT_TYPE } from "~/shared.constants";
import { errorToast, getDateRange } from "~/utils";
import { AssignmentsGantt } from "../EmployeesView/AssignmentsGantt";
import type { FiltersValues } from "./Filters";

const fuseOptions = {
  threshold: 0.1,
  keys: ["name"],
};

interface ProjectHoursTabProps {
  date: Date;
  searchText: string;
  filter: FiltersValues;
  range: "quarter" | "month" | "week";
}

export const ProjectHoursTab = ({
  date,
  searchText,
  filter,
  range,
}: ProjectHoursTabProps) => {
  const navigateModal = useNavigateModal();
  const { start: startDate, end: endDate } = getDateRange(range, date);
  const { project, projectType, client, employee, rateType, projectStatus } =
    filter;

  const { data, isLoading } = useQuery({
    ...getProjectViewProjectsQuery({
      project,
      client,
      employee,
      projectType,
      rateType,
      projectStatus,
    }),
    onError: errorToast,
  });

  const { projects, filteredProjects } = useMemo(() => {
    const projects = data?.data.filter(
      (project) =>
        ((isBefore(new Date(project.startDate), startDate) &&
          !project.endDate) ||
          !isBefore(new Date(project.endDate), startDate)) &&
        project.employees?.length > 0,
    );

    if (projects) {
      const visibleProjects = projects
        .map((p) => ({
          ...p,
          employees: [
            ...p.employees
              .map((e) => {
                const newAssignments = [
                  ...e.assignments.filter((a, index, self) => {
                    return (
                      !(
                        isAfter(new Date(a.fromDate), endDate) ||
                        isBefore(new Date(a.toDate), startDate)
                      ) && self.findIndex((v) => v.id === a.id) === index
                    );
                  }),
                ];

                const hasProjectAssignments = newAssignments.find(
                  (e) => e.type === "project",
                );

                if (hasProjectAssignments) {
                  return {
                    ...e,
                    assignments: newAssignments,
                  };
                }

                return {
                  ...e,
                  assignments: [],
                };
              })
              .filter((e) => e.assignments.length > 0),
          ],
        }))
        .filter((p) => p.employees.length > 0);

      const fuse = new Fuse(visibleProjects, fuseOptions);

      return {
        projects,
        filteredProjects: searchText
          ? fuse.search(searchText).map((result) => result.item)
          : visibleProjects,
      };
    }
    return { projects: [], filteredProjects: [] };
  }, [searchText, startDate, endDate, data]);

  return (
    <section className="h-full w-full flex-grow overflow-hidden">
      <div className="flex h-full flex-col overflow-hidden">
        <ScrollArea>
          <Accordion.Root type="multiple">
            <ul className="flex flex-col gap-6">
              {!isLoading && filteredProjects.length === 0 && (
                <div className="mt-16 flex w-full flex-col items-center justify-center gap-8">
                  <img
                    alt="There are no projects with assignments for this time range"
                    src={Empty}
                    className="aspect-square h-40"
                  />
                  <span className="text-xl">
                    There are no projects with assignments for this time range
                  </span>
                </div>
              )}
              {!isLoading &&
                filteredProjects.map((project) => (
                  <li key={project.id}>
                    <Accordion.Item
                      value={`${project.id}`}
                      className="divide-y overflow-hidden rounded-2xl border"
                    >
                      <Accordion.Trigger className="flex w-full items-center p-4 duration-300 data-[state=open]:rounded-b-none [&[data-state=open]>div:last-child>svg]:rotate-90">
                        <div className="flex w-1/3 items-center gap-3 text-left">
                          <div className="flex flex-col gap-1">
                            <Link
                              to={`${ROUTES.projects.base}/${project.id}`}
                              className="w-fit underline-offset-2 hover:underline"
                            >
                              <h4 className="flex grow items-center gap-2 font-semibold text-neutrals-dark-900">
                                <div
                                  className={tw(
                                    "aspect-square h-2 rounded-full",
                                    project.status === "archived" &&
                                      "bg-complementary-red-500",
                                    project.status === "paused" &&
                                      "bg-complementary-yellow-500",
                                    project.status === "active" &&
                                      "bg-complementary-green-500",
                                  )}
                                />
                                <span className="truncate">{project.name}</span>
                                <Chip
                                  className={tw(
                                    "min-w-fit capitalize",
                                    project.type === PROJECT_TYPE.INTERNAL &&
                                      `bg-secondary-100 text-secondary-600`,
                                    project.type === PROJECT_TYPE.CLIENT &&
                                      `bg-complementary-blue-100 text-complementary-blue-600`,
                                  )}
                                >
                                  {project.type}
                                </Chip>
                              </h4>
                            </Link>
                          </div>
                        </div>

                        <div className="flex flex-1 items-center justify-center text-xs font-medium">
                          <div className="relative">
                            <div className="hidden items-center gap-1 capitalize lg:flex">
                              <button
                                className="flex items-center gap-1 text-complementary-blue-500 hover:text-complementary-blue-500/90 hover:underline"
                                onClick={() =>
                                  navigateModal(
                                    `${MODAL_ROUTES.clientForm}/${project.client.id}`,
                                  )
                                }
                              >
                                <icons.LinkIcon className="h-4 w-4" />
                                {project.client?.name}
                              </button>
                              {project.endDate && (
                                <span>| End date: {project.endDate}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-nostalgia-secondary-900 flex w-1/4 items-center justify-end gap-1.5 px-4 py-2 text-sm">
                          <icons.ChevronRightIcon
                            className="h-4 w-4 shrink-0 stroke-[3] duration-200"
                            aria-hidden="true"
                          />
                        </div>
                      </Accordion.Trigger>
                      <Accordion.Content className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                        {project.employees.map((employee) => (
                          <div
                            className="flex even:border-y even:bg-neutrals-light-200"
                            key={employee.id}
                          >
                            <div className="w-44 border-r p-4">
                              <Link
                                to={`${ROUTES.employees}/${employee.id}`}
                                className="underline-offset-2 hover:underline"
                              >
                                <h4 className="grow truncate text-neutrals-dark-900">
                                  {employee?.name}
                                </h4>
                              </Link>
                            </div>
                            <AssignmentsGantt
                              assignments={employee.assignments ?? []}
                              range={range}
                              employee={{
                                name: employee.name,
                                hours: employee.hours,
                              }}
                              project={{
                                name: project.name,
                                type: project.type,
                              }}
                            />
                          </div>
                        ))}
                      </Accordion.Content>
                    </Accordion.Item>
                  </li>
                ))}
            </ul>
          </Accordion.Root>
          {isLoading && <ScreenLoading />}

          {!projects.length && !isLoading && (
            <div className="flex items-center justify-center py-44 text-center text-xl">
              No assignments found for the given period
            </div>
          )}
        </ScrollArea>
      </div>
    </section>
  );
};
