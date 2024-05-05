import type { QueryClient } from "@tanstack/react-query";

import type { ServiceResponse } from "./api.types";
import { getApi } from "./axios";
import { generateQueryKey, invalidateDomains } from "./config/config";
import type { Permission, Role } from "./permissions";

export interface User {
  id: number;
  name: string;
  email: string;
  roles?: Role[];
  permissions?: Permission[];
}

export interface UserWithRoleParams {
  userId: number;
  roles: string[];
}

export const getUsersWithRolesAndPermissionsQuery = () => ({
  queryKey: generateQueryKey("getUsersWithRolesAndPermissionsQuery", {
    domain: "user",
    subDomains: "permission",
  }),
  queryFn: async () => {
    const response = await getApi().get<ServiceResponse<User[]>>("users", {
      params: { with: "roles,permissions" },
    });
    return response.data.data;
  },
});

export const getUserPermissionsQuery = () => ({
  queryKey: generateQueryKey("getUserPermissionsQuery", {
    domain: "user",
    subDomains: "permission",
  }),
  queryFn: async () => {
    const response = await getApi().get<ServiceResponse<User>>("users/me", {
      params: { with: "permissions" },
    });
    return response.data.data;
  },
});

export const updateUserRole = {
  mutation: async (userWithRole: UserWithRoleParams) => {
    const response = await getApi().post<ServiceResponse<User>>(
      `/users/roles`,
      userWithRole,
    );
    return response.data;
  },
  invalidates: (queryClient: QueryClient) => {
    invalidateDomains(queryClient, "permission", "user");
  },
};
