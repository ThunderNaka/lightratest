import type { QueryClient } from "@tanstack/react-query";

import type { AssignmentFormValues } from "~/modals";
import type { CourseAssignmentFormValues } from "~/screens/NewAssignment/NewCourseAssignment";
import type { ProjectAssignmentFormValues } from "~/screens/NewAssignment/NewProjectAssignment";
import { ASSIGNMENT_TYPE } from "~/shared.constants";
import type {
  Assignment,
  AssignmentType,
  AssignmentWithAssignable,
  Client,
  Employee,
  Project,
  Team,
  TimeOffType,
} from "~/shared.types";
import { filterValidValues, formatFormDate } from "~/utils";
import type { RequestParams, ServiceResponse } from "./api.types";
import { getApi } from "./axios";
import { generateQueryKey, invalidateDomains } from "./config";

export type AssignmentDetails = AssignmentWithAssignable & {
  employee: Employee & { projects: Project[] };
};

export const getAssignmentDetailsQuery = (id: number | null) => ({
  enabled: id !== null,
  queryKey: generateQueryKey("getAssignmentQuery", {
    domain: "assignment",
    subDomains: "project,employee",
    params: id,
  }),
  queryFn: async () => {
    const { data } = await getApi().get<ServiceResponse<AssignmentDetails>>(
      `/assignments/${id}`,
      { params: { with: "assignable,employee" } },
    );

    return data.data;
  },
});

const parseAssignment = (assignment: AssignmentFormValues) => {
  return {
    employeeId: assignment.employeeId,
    isNotified: assignment?.isNotified,
    hours: assignment.hours,

    fromDate: assignment.dateRange?.fromDate?.includes("/")
      ? formatFormDate(assignment.dateRange.fromDate)
      : assignment?.dateRange.fromDate,
    toDate: assignment?.dateRange.toDate.includes("/")
      ? formatFormDate(assignment.dateRange.toDate)
      : assignment.dateRange.toDate,

    type: assignment.type,
    assignableId: assignment.assignableId,
    ...(assignment.type === "project"
      ? {
          hourlyRate: assignment.hourlyRate,
          role: assignment.role,
          rateType: assignment.rateType,
        }
      : {
          hourlyRate: 0,
          role: "no-apply",
          rateType: "non-billable",
        }),

    notes: assignment.notes,
  };
};

export const createAssignment = {
  mutation: async (params: AssignmentFormValues) => {
    const response = await getApi().post<ServiceResponse<Assignment>>(
      "/assignments",
      parseAssignment(params),
    );

    return response.data.data;
  },
  invalidates: (
    queryClient: QueryClient,
    {
      employeeId,
      projectId,
    }: {
      employeeId: number;
      projectId?: number | null;
    },
  ) => {
    invalidateDomains(
      queryClient,
      "assignment",
      ["project", projectId],
      ["employee", employeeId],
    );
  },
};

export const editAssignment = {
  mutation: async (params: Assignment) => {
    const response = await getApi().put<ServiceResponse<Assignment>>(
      `/assignments/${params.id}`,
      {
        ...params,
        fromDate: formatFormDate(params.fromDate),
        toDate: formatFormDate(params.toDate),
      },
    );

    return response.data.data;
  },
  invalidates: (
    queryClient: QueryClient,
    {
      id,
      employeeId,
      prevProjectId,
      prevEmployeeId,
      projectId,
    }: {
      id: number;
      employeeId: number | null;
      projectId?: number | null;
      prevProjectId?: number;
      prevEmployeeId?: number | null;
    },
  ) => {
    invalidateDomains(
      queryClient,
      ["assignment", id],
      ["project", projectId],
      ["project", prevProjectId],
      ["employee", employeeId],
      ["employee", prevEmployeeId],
    );
  },
};

export const editAssignmentIsNotified = {
  mutation: async (params: Assignment) => {
    const response = await getApi().patch<ServiceResponse<Assignment>>(
      `/assignments/${params.id}`,
      { isNotified: params.isNotified ?? false },
    );

    return response.data.data;
  },
  invalidates: (
    queryClient: QueryClient,
    {
      id,
      employeeId,
      prevProjectId,
      prevEmployeeId,
      projectId,
    }: {
      id: number;
      employeeId: number | null;
      projectId?: number | null;
      prevProjectId?: number;
      prevEmployeeId?: number | null;
    },
  ) => {
    invalidateDomains(
      queryClient,
      ["assignment", id],
      ["project", projectId],
      ["project", prevProjectId],
      ["employee", employeeId],
      ["employee", prevEmployeeId],
    );
  },
};

export const deleteAssignment = {
  mutation: async (id: number) => {
    const response = await getApi().delete<ServiceResponse<Assignment>>(
      `/assignments/${id}`,
    );
    return response.data.data;
  },
  invalidates: (
    queryClient: QueryClient,
    {
      projectId,
      assignmentId,
      employeeId,
      courseId,
    }: {
      assignmentId: number;
      employeeId?: number;
      projectId?: number | null;
      courseId?: number;
    },
  ) => {
    invalidateDomains(
      queryClient,
      ["project", projectId],
      ["project", courseId],
      ["assignment", assignmentId],
      ["employee", employeeId],
    );
  },
};

const parseProjectAssignments = (params: ProjectAssignmentFormValues) => {
  return params.assignments.map((assignment) => ({
    ...assignment,
    type: ASSIGNMENT_TYPE.PROJECT,
    fromDate: formatFormDate(assignment.dateRange.fromDate),
    toDate: formatFormDate(assignment.dateRange.toDate),
    hourlyRate:
      assignment.rateType === "non-billable" ? 0 : assignment.hourlyRate,
  }));
};

export const createProjectAssignments = {
  mutation: async (params: ProjectAssignmentFormValues) => {
    const assignments = parseProjectAssignments(params);
    const response = await getApi().post<ServiceResponse<Assignment>>(
      "/assignments/bulk",
      {
        assignableId: params.projectId,
        type: ASSIGNMENT_TYPE.PROJECT,
        assignments,
      },
    );

    return response.data.data;
  },
  invalidates: (
    queryClient: QueryClient,
    {
      employeeIds,
      projectId,
    }: {
      employeeIds: (number | null)[];
      projectId: number | null;
    },
  ) => {
    invalidateDomains(queryClient, "assignment", ["project", projectId]);
    employeeIds.forEach((id) =>
      invalidateDomains(queryClient, ["employee", id]),
    );
  },
};

const parseCourseAssignments = (params: CourseAssignmentFormValues) =>
  params.assignments.map((assignment) => ({
    ...assignment,
    fromDate: formatFormDate(assignment.dateRange.fromDate),
    toDate: formatFormDate(assignment.dateRange.toDate),
  }));

export const createCourseAssignments = {
  mutation: async (params: CourseAssignmentFormValues) => {
    const assignments = parseCourseAssignments(params);
    const response = await getApi().post<ServiceResponse<Assignment>>(
      "/assignments/bulk",
      {
        assignableId: params.assignableId,
        type: ASSIGNMENT_TYPE.COURSE,
        assignments,
      },
    );

    return response.data.data;
  },
  invalidates: (
    queryClient: QueryClient,
    {
      employeeIds,
      courseId,
    }: {
      employeeIds: (number | null)[];
      courseId: number | null;
    },
  ) => {
    invalidateDomains(queryClient, "assignment", ["course", courseId]);
    employeeIds.forEach((id) =>
      invalidateDomains(queryClient, ["employee", id]),
    );
  },
};

export type HistoryViewAssignment = AssignmentWithAssignable & {
  employee: Employee;
  assignedBy: Employee;
};

export const getHistoryViewAssignmentsQuery = (
  params: RequestParams<{
    assignable?: string | null;
    assignedById?: number | null;
    employeeId?: number | null;
    type?: string | null;
    fromDate?: string | null | Date;
    toDate?: string | null | Date;
    isNotified?: string | null;
    projectId?: number | null;
    "project.type"?: string | null;
    "project.clientId"?: number | null;
  }>,
) => {
  const [assignableId, assignableType] =
    params.filter?.assignable?.split("-") ?? [];

  const formattedParams = {
    ...params,
    searchText: params.searchText ? params.searchText : null,
    filter: {
      ...filterValidValues(params.filter),
      fromDate: params.filter?.fromDate
        ? formatFormDate(params.filter.fromDate)
        : null,
      toDate: params.filter?.toDate
        ? formatFormDate(params.filter.toDate)
        : null,
      assignableId: assignableId ?? undefined,
      type: assignableType ?? undefined,
      assignable: undefined,
    },
    with: ["assignable", "employee", "assignedBy"],
  };

  return {
    queryKey: generateQueryKey("getHistoryViewAssignmentsQuery", {
      domain: "assignment",
      subDomains: "project,employee",
      params: formattedParams,
    }),
    queryFn: async () => {
      const { data } = await getApi().get<
        ServiceResponse<HistoryViewAssignment[]> & { lastTimeOffSync: Date }
      >(`/assignments`, {
        params: {
          ...formattedParams,
        },
      });
      return data;
    },
  };
};

type AssignmentWithEmployee = Assignment & { employee: Employee };

export const getProjectAssignmentsQuery = (projectId: number) => ({
  queryKey: generateQueryKey("getProjectAssignmentsQuery", {
    domain: "assignment",
    subDomains: "employee",
    id: projectId,
  }),
  queryFn: async () => {
    const response = await getApi().get<
      ServiceResponse<AssignmentWithEmployee[]>
    >(`/assignments`, {
      params: {
        filter: {
          projectId,
        },
        with: "employee",
        pageSize: 1000,
      } as RequestParams<{ projectId: number }>,
    });

    return response.data;
  },
});

interface Filter {
  project: number | null;
  client: number | null;
  employee: number | null;
  projectType: string;
  rateType: string;
  projectStatus: string;
}

interface EmployeeFilter {
  project: number[];
  employee: number[];
  rateType: string[];
  position?: string;
  isAssignable?: boolean;
  type: string[];
  client: number | null;
  team: number | null;
}

export type ProjectViewAssignment = Assignment &
  (
    | { type: Exclude<AssignmentType, "timeOff"> }
    | {
        type: typeof ASSIGNMENT_TYPE.TIME_OFF;
        timeOffType: TimeOffType;
      }
  );
interface ProjectViewEmployee extends Employee {
  assignments: ProjectViewAssignment[];
}

interface ProjectViewProject extends Project {
  employees: ProjectViewEmployee[];
  client: Client;
}

export const getProjectViewProjectsQuery = (filter: Filter) => ({
  queryKey: [
    generateQueryKey("getAssignmentsQuery", {
      domain: "assignment",
      subDomains: "project",
    }),
    filter,
  ],
  queryFn: async () => {
    const response = await getApi().get<ServiceResponse<ProjectViewProject[]>>(
      "/assignments/projects",
      { params: { filter, with: "employee", pageSize: 1000 } },
    );

    return response.data;
  },
});

export interface AssignmentEmployee extends Employee {
  assignments: AssignmentWithAssignable[];
  teams: Team[];
}

export const getAssignmentEmployeesQuery = (filter: EmployeeFilter) => ({
  queryKey: [
    ...generateQueryKey("getAssignmentsQuery", {
      domain: "assignment",
      subDomains: "employee",
    }),
    filter,
  ],
  queryFn: async () => {
    const response = await getApi().get<ServiceResponse<AssignmentEmployee[]>>(
      "/assignments/employees",
      {
        params: { filter, with: "assignable,project", pageSize: 1000 },
      },
    );

    return response.data;
  },
});

export const getAssignmentsTimeOffQuery = {
  mutation: async (
    assignments: {
      employeeId: number | null;
      fromDate: string;
      toDate: string;
    }[],
  ) => {
    const response = await getApi().post<ServiceResponse<Assignment>>(
      `/assignments/time-off`,
      assignments,
    );

    return response.data.data;
  },
};

export const syncBambooTimeOff = {
  mutation: async () => {
    const { data } = await getApi().post<
      ServiceResponse<{ message: string; bambooLastSync: Date }>
    >(`/assignments/time-off/sync`);
    return data.data;
  },
  invalidates: (queryClient: QueryClient) => {
    invalidateDomains(queryClient, "assignment");
  },
};

interface AssignableOptions {
  id: number;
  name: string;
  type: AssignmentType;
}

export const getAssignableOptions = () => ({
  queryKey: [...generateQueryKey("getAssignableOptions")],
  queryFn: async () => {
    const response = await getApi().get<ServiceResponse<AssignableOptions[]>>(
      "assignments/options",
    );
    return response.data.data;
  },
});
