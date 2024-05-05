import type { QueryClient } from "@tanstack/react-query";

import type { CourseFormValues } from "~/screens";
import type { FiltersValues } from "~/screens/CoursesList/Filters";
import type { PutCourseFormValues } from "~/screens/EditCourse";
import type { Assignment, Course, Employee, Topic } from "~/shared.types";
import { filterValidValues } from "~/utils";
import type { ServiceResponse } from "./api.types";
import { getApi } from "./axios";
import { generateQueryKey, invalidateDomains } from "./config";

interface RequestParams<T> {
  searchText?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  filter?: T;
  with?: string[];
}

export const getCoursesQuery = (params: RequestParams<FiltersValues>) => {
  const formattedParams = {
    ...params,
    searchText: params.searchText ? params.searchText : null,
    filter: {
      ...filterValidValues(params.filter),
    },
    with: params.with?.length ? params.with.join(",") : "assignments",
  };

  return {
    queryKey: generateQueryKey("getCoursesQuery", {
      domain: "course",
      subDomains: "employee",
      params: formattedParams,
    }),
    queryFn: async () => {
      const { data } = await getApi().get<ServiceResponse<Course[]>>(
        `/courses`,
        {
          params: {
            ...formattedParams,
          },
        },
      );
      return data;
    },
  };
};

export const getCourseQuery = (id?: number) => {
  return {
    enabled: !!id,
    queryKey: generateQueryKey("getCourseQuery", {
      domain: "course",
      id: id,
    }),
    queryFn: async () => {
      const { data } = await getApi().get<ServiceResponse<Course>>(
        `/courses/${id}`,
      );
      return data;
    },
  };
};

export type AssignmentsWithEmployee = Assignment & { employee: Employee };

export type CourseWithAssignments = Course & {
  assignments: AssignmentsWithEmployee[];
};

export const getCourseWithAssignmentsQuery = (id?: number) => {
  return {
    enabled: id !== undefined,
    queryKey: generateQueryKey("getCourseWithAssignmentsQuery", {
      domain: "course",
      id: id,
    }),
    queryFn: async () => {
      const { data } = await getApi().get<
        ServiceResponse<CourseWithAssignments>
      >(`/courses/${id}`, {
        params: {
          with: "assignments.employee",
        },
      });
      return data;
    },
  };
};

export const getTopicsQuery = () => {
  return {
    queryKey: generateQueryKey("getTopicsQuery", {
      domain: "course",
    }),
    queryFn: async () => {
      const { data } = await getApi().get<ServiceResponse<Topic[]>>(`/topics`);
      return data.data;
    },
  };
};

export const createCourse = {
  mutation: async (params: CourseFormValues) => {
    const response = await getApi().post<ServiceResponse<Course>>(
      "/courses",
      params,
    );

    return response.data.data;
  },
  invalidates: (
    queryClient: QueryClient,
    { courseId }: { courseId: number },
  ) => {
    invalidateDomains(queryClient, ["course", courseId]);
  },
};

export const editCourse = {
  mutation: async (course: PutCourseFormValues) => {
    const response = await getApi().put<ServiceResponse<PutCourseFormValues>>(
      `/courses/${course.id}`,
      course,
    );

    return response.data.data;
  },
  invalidates: (
    queryClient: QueryClient,
    { courseId }: { courseId: number },
  ) => {
    invalidateDomains(queryClient, ["course", courseId]);
  },
};

export const deleteCourse = {
  mutation: async (id: number) => {
    const response = await getApi().delete<ServiceResponse<Course>>(
      `/courses/${id}`,
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
