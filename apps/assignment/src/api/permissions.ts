import type { QueryClient } from "@tanstack/react-query";

import type { ServiceResponse } from "./api.types";
import { getApi } from "./axios";
import { generateQueryKey, invalidateDomains } from "./config/config";

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface Role {
  id: number;
  name: RoleName;
  permissions: string[];
}
export type RoleName = (typeof ROLE_NAMES)[number];

export const ROLE_NAMES = ["admin", "leader", "viewer"] as const;

export interface RolesAndPermissions {
  permissions: Permission[];
  roles: Role[];
}

export const getRolesAndPermissionsQuery = () => ({
  queryKey: generateQueryKey("getRolesAndPermissionsQuery", {
    domain: "permission",
    subDomains: "user",
  }),
  queryFn: async () => {
    const response =
      await getApi().get<ServiceResponse<RolesAndPermissions>>("permissions");
    return response.data.data;
  },
});

export const updateRolesPermissions = {
  mutation: async (data: Omit<Role, "name">[]) => {
    const body = {
      roles: data,
    };
    const response = await getApi().put<ServiceResponse<null>>("roles", body);
    return response.data.data;
  },
  invalidates: (queryClient: QueryClient) => {
    invalidateDomains(queryClient, "permission");
  },
};
