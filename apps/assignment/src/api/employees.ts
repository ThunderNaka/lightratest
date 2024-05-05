import type { QueryClient } from "@tanstack/react-query";

import type {
  Assignment,
  AssignmentWithAssignable,
  Employee as BaseEmployee,
  Project,
} from "~/shared.types";
import { formatFormDate } from "~/utils";
import type { RequestParams, ServiceResponse } from "./api.types";
import { getApi } from "./axios";
import { generateQueryKey, invalidateDomains } from "./config/config";
import type { Team } from "./teams";

export type RangeViewOptions = "quarter" | "month" | "week";

/**
 * @deprecated This `Employee` interface is a wildcard for endpoints when 'with something' is requested.
 * Please avoid using this interface for new features.
 * Instead, create a new interface by extending the base `Employee` from `shared.types.ts` with the corresponding props when needed.
 */
export interface Employee extends BaseEmployee {
  email: string;
  jobTitle: string;
  status?: "active" | "inactive";
  hours: number;
  availableHours: number;
  isAssignable: boolean;
  projects?: Project[];
  assignments?: Assignment[];
  salaries?: Salary[];
  teams?: Team[];
  deletedAt?: string;
  hireDate: string;
}

interface Salary {
  salary: SalarySalary;
  salaryAsCurrency: string;
  salaryAsDecimal: string;
  startDate: string;
  endDate: null;
  comments: string;
  createdAt: string;
}

interface SalarySalary {
  amount: string;
  currency: string;
}

export const getEmployeesQuery = () => ({
  queryKey: generateQueryKey("getEmployeesQuery", { domain: "employee" }),
  queryFn: async () => {
    const response =
      await getApi().get<ServiceResponse<Employee[]>>("/employees");
    return response.data.data;
  },
});

export const getAllEmployeesQuery = () => ({
  queryKey: generateQueryKey("getAllEmployeesQuery", { domain: "employee" }),
  queryFn: async () => {
    const response =
      await getApi().get<ServiceResponse<BaseEmployee[]>>("/employees/all");
    return response.data.data;
  },
});

export interface DashboardEmployee extends BaseEmployee {
  projects: Project[];
  teams: Team[];
}

export const getDashboardEmployeesQuery = (
  params: RequestParams<{
    isAssignable?: string | null;
  }>,
) => ({
  queryFn: async () => {
    const response = await getApi().get<
      ServiceResponse<DashboardEmployee[]> & { bambooLastSync: Date }
    >("/employees", {
      params: {
        with: "projects,teams",
        ...params,
      },
    });
    return response.data;
  },
});

export interface EmployeeMockup {
  id: number;
  name: string;
  position: string;
  date: Date;
  picture?: string;
  projectAssignmentHours: EmployeeProjectAssignmentHours[];
  dailyWorkingHours: number;
  assignedWorkingHours: number;
}

export interface EmployeeProjectAssignmentHours {
  id: number;
  projectName: string;
  hoursLeft: string;
  projectType: string;
}

const mockedProjectAssignmentHours: EmployeeProjectAssignmentHours[] = [
  {
    id: 1,
    projectName: "Navio",
    projectType: "Billable",
    hoursLeft: "4:00h",
  },
  {
    id: 2,
    projectName: "Lightranet",
    projectType: "Non-billable",
    hoursLeft: "4:00h",
  },
];

export const getNextAvailableEmployee = (): EmployeeMockup[] => {
  return [
    {
      id: 1,
      name: "Leslie Alexander",
      position: "UI/UX Designer",
      date: new Date("2022-01-01"),
      picture:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      projectAssignmentHours: mockedProjectAssignmentHours,
      dailyWorkingHours: 8,
      assignedWorkingHours: 4,
    },
    {
      id: 2,
      name: "Michael Foster",
      position: "UI/UX Designer",
      date: new Date("2022-02-1"),
      picture:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      projectAssignmentHours: mockedProjectAssignmentHours,
      dailyWorkingHours: 8,
      assignedWorkingHours: 4,
    },
    {
      id: 3,
      name: "Dries Vincent",
      position: "UI/UX Designer",
      date: new Date("2022-03-01"),
      picture:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      projectAssignmentHours: mockedProjectAssignmentHours,
      dailyWorkingHours: 8,
      assignedWorkingHours: 4,
    },
    {
      id: 4,
      name: "Lindsay Walton",
      position: "UI/UX Designer",
      date: new Date("2022-04-01"),
      picture:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      projectAssignmentHours: mockedProjectAssignmentHours,
      dailyWorkingHours: 8,
      assignedWorkingHours: 4,
    },
    {
      id: 5,
      name: "Courtney Henry",
      position: "UI/UX Designer",
      date: new Date("2022-05-01"),
      picture:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      projectAssignmentHours: mockedProjectAssignmentHours,
      dailyWorkingHours: 8,
      assignedWorkingHours: 4,
    },
    {
      id: 6,
      name: "Tom Cook",
      position: "UI/UX Designer",
      date: new Date("2022-06-01"),
      picture:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      projectAssignmentHours: mockedProjectAssignmentHours,
      dailyWorkingHours: 8,
      assignedWorkingHours: 4,
    },
  ];
};

export const getEmployeeQuery = (
  employeeId: number | null,
  startDate?: Date,
) => ({
  enabled: employeeId !== null,
  queryKey: generateQueryKey("getEmployeeQuery", {
    domain: "employee",
    subDomains: "project,assignment",
    id: employeeId,
    params: [startDate],
  }),
  queryFn: async () => {
    const response = await getApi().get<ServiceResponse<Employee>>(
      `/employees/${employeeId}?with=projects,assignments.timeOff,salaries`,
      {
        params: startDate ? { start_date: formatFormDate(startDate) } : {},
      },
    );
    return response.data.data;
  },
});

export interface EmployeeWithAssignments extends BaseEmployee {
  assignments: AssignmentWithAssignable[];
}

export const getEmployeesWithAssignmentsQuery = () => ({
  queryKey: generateQueryKey("getEmployeesWithAssignmentsQuery", {
    domain: "employee",
    subDomains: "assignment",
  }),
  queryFn: async () => {
    const response = await getApi().get<
      ServiceResponse<EmployeeWithAssignments[]>
    >("/employees?with=assignments.project&page_size=1000");
    return response.data;
  },
});

export const createSalary = {
  mutation: async ({
    employeeId,
    ...params
  }: {
    amount: string;
    currency: string;
    comments: string;
    employeeId: number;
  }) => {
    const response = await getApi().post<ServiceResponse<Salary>>(
      `/employees/${employeeId}/salary`,
      params,
    );
    return response.data;
  },
  invalidates: (
    queryClient: QueryClient,
    {
      employeeId,
    }: {
      employeeId: number;
    },
  ) => {
    invalidateDomains(queryClient, ["employee", employeeId]);
  },
};

export const saveEmployeeInfo = {
  mutation: async ({
    hours,
    isAssignable,
    employeeId,
  }: {
    hours: string;
    isAssignable: boolean;
    employeeId: number;
  }) => {
    const response = await getApi().put<ServiceResponse<Employee>>(
      `/employees/${employeeId}/`,
      { hours: parseInt(hours, 10), isAssignable },
    );
    return response.data;
  },
  invalidates: (
    queryClient: QueryClient,
    { employeeId }: { employeeId: number },
  ) => {
    invalidateDomains(queryClient, ["employee", employeeId]);
  },
};

export const SWITCHES = {
  availabilities: "availabilities",
  internal: "internalAssignments",
  nonBillable: "nonBillableAssignments",
} as const;

export const exportEmployeeAvailability = {
  mutation: async ({
    fromDate,
    toDate,
    employees,
    sheets,
  }: {
    fromDate: string;
    toDate: string;
    employees: string[];
    sheets: (typeof SWITCHES)[keyof typeof SWITCHES][];
  }) => {
    const response = await getApi().post(
      `/employees/export`,
      {
        fromDate,
        toDate,
        employees,
        sheets,
      },
      {
        responseType: "blob",
      },
    );
    return response;
  },
  invalidates: (
    queryClient: QueryClient,
    { employeeId }: { employeeId: number },
  ) => {
    invalidateDomains(queryClient, ["employee", employeeId]);
  },
};

export const syncBambooEmployees = {
  mutation: async () => {
    const { data } =
      await getApi().post<
        ServiceResponse<{ message: string; bambooLastSync: Date }>
      >(`/employees/sync`);
    return data.data;
  },
  invalidates: (queryClient: QueryClient) => {
    invalidateDomains(queryClient, "employee");
  },
};

interface GetEmployeeAvailableHoursParams {
  id: number;
  fromDate: string;
  toDate: string;
}

export const getEmployeeAvailableHours = (
  params: GetEmployeeAvailableHoursParams,
) => ({
  queryKey: generateQueryKey("getEmployeeAvailableHours", {
    domain: "employee",
    id: params.id,
    params: { fromDate: params.fromDate, toDate: params.toDate },
  }),
  queryFn: async () => {
    const { data } = await getApi().get<
      ServiceResponse<{ employeeAvailableHours: number }>
    >(`/employees/${params.id}/available-hours`, {
      params: { fromDate: params.fromDate, toDate: params.toDate },
    });
    return data.data;
  },
});
