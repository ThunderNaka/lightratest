import { useQuery } from "@tanstack/react-query";

import { getUserPermissionsQuery } from "~/api/users";
import { useUserStore } from "~/stores";

export const PERMISSIONS = {
  createTeamAssignment: "create team assignment",
  deleteTeamAssignment: "delete team assignment",
  updateTeamAssignment: "update team assignment",
  viewTeamAssignment: "view team assignment",
  createClientProject: "create client project",
  createInternalProject: "create internal project",
  deleteProject: "delete project",
  updateProject: "update project",
  updateProjectStatus: "update project status",
  viewProjects: "view projects",
  createClient: "create client",
  viewClient: "view client",
  updateClient: "update client",
  createSalaryEmployee: "create salary employee",
  createTeamEmployee: "create team employee",
  updateTeamEmployee: "update team employee",
  deleteEmployee: "delete employee",
  deleteTeamEmployee: "delete team employee",
  viewEmployee: "view employee",
  updateEmployeeHours: "update employee hours",
  createTeam: "create team",
  updateTeam: "update team",
  deleteTeam: "delete team",
  viewTeam: "view team",
  createRole: "create role",
  updateRole: "update role",
  deleteRole: "delete role",
  viewRole: "view role",
  viewPermission: "view permission",
  createCourse: "create course",
  deleteCourse: "delete course",
  updateCourse: "update course",
  viewCourses: "view courses",
  createInternalTeamAssignment: "create internal team assignment",
} as const;
export type PermissionValue = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const usePermissions = () => {
  const userState = useUserStore((state) =>
    state.token ? "loggedIn" : "loggedOut",
  );

  const { data, isLoading } = useQuery({
    ...getUserPermissionsQuery(),
    enabled: userState === "loggedIn",
    staleTime: 60 * 60 * 1000 * 24,
    cacheTime: 60 * 60 * 1000 * 24,
  });

  const userPermissions = data?.permissions;

  const hasPermission = (expected: PermissionValue | PermissionValue[]) => {
    if (!Array.isArray(expected)) {
      expected = [expected];
    }

    return !!(
      userPermissions &&
      expected.every((permission) =>
        userPermissions.some(
          (userPermission) => userPermission.name === permission,
        ),
      )
    );
  };

  return { hasPermission, isLoading };
};
