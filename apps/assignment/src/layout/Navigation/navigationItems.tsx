import { icons } from "@lightit/ui";

import type { PermissionValue } from "~/hooks";
import { PERMISSIONS } from "~/hooks";
import { ROUTES } from "~/router";

export interface BaseNavigation {
  label: string;
  icon?: JSX.Element;
  path: string;
  permission?: PermissionValue | PermissionValue[];
  type: "base";
}

export interface NestedNavigation
  extends Omit<BaseNavigation, "type" | "path"> {
  children: Omit<BaseNavigation, "type" | "permission">[];
  type: "nested";
  expandedByDefault?: boolean;
}

export const NAVIGATION_ITEMS: (BaseNavigation | NestedNavigation)[] = [
  {
    label: "Home",
    path: ROUTES.dashboard,
    icon: (
      <icons.HomeIcon
        className="h-6 w-6 shrink-0 text-gray-400"
        aria-hidden="true"
      />
    ),
    type: "base",
  },
  {
    label: "Assignments",
    permission: PERMISSIONS.viewTeamAssignment,
    icon: (
      <icons.ClockIcon
        className="h-6 w-6 shrink-0 text-gray-400"
        aria-hidden="true"
      />
    ),
    type: "nested",
    expandedByDefault: true,
    children: [
      { label: "History view", path: ROUTES.assignments.historyView },
      { label: "Project view", path: ROUTES.assignments.projectView },
      { label: "Employee view", path: ROUTES.assignments.employeesView },
    ],
  },
  {
    label: "Projects",
    path: ROUTES.projects.base,
    permission: PERMISSIONS.viewProjects,
    icon: (
      <icons.FolderIcon
        className="h-6 w-6 shrink-0 text-gray-400"
        aria-hidden="true"
      />
    ),
    type: "base",
  },
  {
    label: "Employees",
    path: ROUTES.employees,
    permission: PERMISSIONS.viewEmployee,
    icon: (
      <icons.UserIcon
        className="h-6 w-6 shrink-0 text-gray-400"
        aria-hidden="true"
      />
    ),
    type: "base",
  },
  {
    label: "Clients",
    path: ROUTES.clients,
    permission: PERMISSIONS.viewClient,
    icon: (
      <icons.BriefcaseIcon
        className="h-6 w-6 shrink-0 text-gray-400"
        aria-hidden="true"
      />
    ),
    type: "base",
  },
  {
    label: "Teams",
    path: ROUTES.teams,
    permission: PERMISSIONS.viewTeam,
    icon: (
      <icons.UserGroupIcon
        className="h-6 w-6 shrink-0 text-gray-400"
        aria-hidden="true"
      />
    ),
    type: "base",
  },
  {
    label: "Security",
    permission: [PERMISSIONS.viewPermission, PERMISSIONS.viewRole],
    icon: (
      <icons.LockClosedIcon
        className="h-6 w-6 shrink-0 text-gray-400"
        aria-hidden="true"
      />
    ),
    type: "nested",
    children: [
      { label: "Tools and users", path: ROUTES.security.toolsAndUsers },
      { label: "History log", path: ROUTES.security.historyLog },
      {
        label: "Pending permissions",
        path: ROUTES.security.pendingPermissions,
      },
    ],
  },
  {
    label: "Learning center",
    path: ROUTES.learningCenter.coursesList,
    icon: (
      <icons.BookOpenIcon
        className="h-6 w-6 shrink-0 text-gray-400"
        aria-hidden="true"
      />
    ),
    type: "base",
  },
  {
    label: "Platform roles",
    path: ROUTES.platformRoles,
    permission: [PERMISSIONS.viewPermission, PERMISSIONS.viewRole],
    icon: (
      <icons.IdentificationIcon
        className="h-6 w-6 shrink-0 text-gray-400"
        aria-hidden="true"
      />
    ),
    type: "base",
  },
];
