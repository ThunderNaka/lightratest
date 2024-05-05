import type { QueryClient } from "@tanstack/react-query";

import type { ProjectFormValues } from "~/modals";
import type { Project as BaseProject } from "~/shared.types";
import type { ServiceResponse } from "./api.types";
import { getApi } from "./axios";
import type { Client } from "./clients";
import { generateQueryKey } from "./config";
import { invalidateDomains } from "./config/config";
import type { Employee } from "./employees";
import type { Integration } from "./integrations";
import type { Technology } from "./technologies";

interface Statistics {
  date: string;
  hours: number;
}

/**
 * @deprecated This interface was used for the old dashboard
 */
export interface ProjectStatistics {
  projectName: string;
  projectId: number;
  statistics: Statistics[];
  totalHours: number;
  billableHours: number;
  nonBillableHours: number;
}

export interface DeleteProjectResponse {
  status: number;
  success: boolean;
  data: null;
}

export const getProjectStatistics = (): ProjectStatistics[] => {
  return [
    {
      projectName: "Enabled Health",
      projectId: 1,
      statistics: [
        {
          date: "2022-01",
          hours: 10,
        },
      ],
      totalHours: 12,
      billableHours: 2,
      nonBillableHours: 10,
    },
  ];
};

export interface Environment {
  production: string;
  staging: string;
  development: string;
}

export interface Utility {
  id: number;
  name: string;
  url?: string;
}

/**
 * @deprecated This `Project` interface is a wildcard for endpoints when 'with something' is requested.
 * Please avoid using this interface for new features.
 * Instead, create a new interface by extending the base `Project` from `shared.types.ts` with the corresponding props when needed.
 */
export interface Project extends BaseProject {
  client: Client;
  employees?: Employee[];
  thumbnail?: string;
  accountManager: Employee;
  technologies: Technology[];
  integrations: Integration[];
  techLead?: Employee;
  projectManager?: Employee;
  environment?: Environment;
  utilities: Utility[];
}

export interface ProjectWithEmployees extends Project {
  employees: Employee[];
}

export interface Stats {
  activeProjectsCount: number;
  pausedProjectsCount: number;
  archivedProjectsCount: number;
}

export const createProject = {
  mutation: async (params: ProjectFormValues) => {
    const values = {
      name: params.name,
      clientId: params.clientId,
      thumbnail: "", // TODO: wasn't this deleted?
      description: params.description,
      accountManagerId: params.accountManagerId,
      techLeadId: params.techLeadId,
      projectManagerId: params.projectManagerId,
      color: params.color,
      type: params.type,
      // TODO: refactor this date parsing to use date-fns
      startDate: `20${params.startDate.split("/").reverse().join("-")}`,
      endDate: `20${params.endDate.split("/").reverse().join("-")}`,
      environment: params.environment,
      technologies: params.technologies,
      integrations: params.integrations,
      utilities: params.utilities,
      status: params.status,
    };

    const response = await getApi().post<ServiceResponse<Project>>(
      "/projects",
      values,
    );
    return response.data;
  },
  invalidates: (
    queryClient: QueryClient,
    {
      projectId,
    }: {
      projectId: number;
    },
  ) => {
    invalidateDomains(
      queryClient,
      ["project", projectId],
      "client",
      "employee",
    );
  },
};

export const updateProject = {
  mutation: async (params: ProjectFormValues) => {
    const values = {
      name: params.name,
      clientId: params.clientId,
      thumbnail: "", // TODO: wasn't this deleted?
      description: params.description,
      accountManagerId: params.accountManagerId,
      techLeadId: params.techLeadId,
      projectManagerId: params.projectManagerId,
      color: params.color,
      type: params.type,
      // TODO: refactor this date parsing to use date-fns
      startDate: `20${params.startDate.split("/").reverse().join("-")}`,
      endDate: `20${params.endDate.split("/").reverse().join("-")}`,
      environment: params.environment,
      technologies: params.technologies,
      status: params.status,
      integrations: params.integrations,
      utilities: params.utilities,
    };
    const response = await getApi().put<ServiceResponse<Project>>(
      `/projects/${params.projectId}`,
      values,
    );
    return response.data;
  },
  invalidates: (
    queryClient: QueryClient,
    {
      projectId,
    }: {
      projectId: number;
    },
  ) => {
    invalidateDomains(
      queryClient,
      ["project", projectId],
      "client",
      "employee",
    );
  },
};

export const deleteProject = {
  mutation: async (id: number) => {
    const response = await getApi().delete<DeleteProjectResponse>(
      `/projects/${id}`,
    );
    return response;
  },
  invalidates: (
    queryClient: QueryClient,
    { projectId }: { projectId: number | null },
  ) => {
    invalidateDomains(
      queryClient,
      ["project", projectId],
      "client",
      "employee",
    );
  },
};

export const getProjectsQuery = (params?: { filter?: { type: string } }) => ({
  queryKey: generateQueryKey("getProjectsQuery", {
    domain: "project",
    subDomains: "client,employee",
  }),
  queryFn: async () => {
    const response = await getApi().get<ServiceResponse<Project[]>>(
      "/projects",
      { params },
    );
    return response.data.data;
  },
});

interface GetProjectWithEmployeesParams {
  sortByName: boolean;
  sortByUpdatedAt: boolean;
  filterByArchived: boolean;
  filterByActive: boolean;
  filterByPaused: boolean;
}

const keys = [
  "employees",
  "client",
  "accountManager",
  "techLead",
  "projectManager",
  "technologies",
  "integrations",
  "utilities",
].join(",");

export const getProjectsWithEmployeesQuery = ({
  sortByName = false,
  sortByUpdatedAt = false,
  filterByArchived = false,
  filterByActive = false,
  filterByPaused = false,
}: GetProjectWithEmployeesParams) => ({
  queryKey: generateQueryKey("getProjectsWithEmployeesQuery", {
    domain: "project",
    subDomains: "client,employee",
    params: [
      sortByName,
      sortByUpdatedAt,
      filterByArchived,
      filterByActive,
      filterByPaused,
    ],
  }),
  queryFn: async () => {
    const sortParams = [sortByName && "name", sortByUpdatedAt && "updated_at"]
      .filter(Boolean)
      .join(",");

    const filter = filterByArchived
      ? "archived"
      : filterByActive
      ? "active"
      : filterByPaused
      ? "paused"
      : null;

    const params = {
      sort: sortParams || null,
      "filter[status]": filter,
      with: keys,
    };

    const response = await getApi().get<
      ServiceResponse<ProjectWithEmployees[]>
    >("/projects", { params });
    return response.data;
  },
});

export const getProjectQuery = (id?: number | null) => ({
  enabled: typeof id === "number",
  queryKey: generateQueryKey("getProjectQuery", {
    domain: "project",
    subDomains: "client,employee",
    id,
  }),
  queryFn: async () => {
    const response = await getApi().get<ServiceResponse<Project>>(
      `/projects/${id}`,
      {
        params: {
          with: keys,
        },
      },
    );
    return response.data.data;
  },
});

export const getProjectsStatsQuery = () => ({
  queryKey: generateQueryKey("getProjectsStatsQuery", { domain: "project" }),
  queryFn: async () => {
    const response =
      await getApi().get<ServiceResponse<Stats>>("/projects/stats");
    return response.data.data;
  },
});
