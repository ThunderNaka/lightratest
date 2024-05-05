import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { icons, Input } from "@lightit/ui";

import { getRolesAndPermissionsQuery } from "~/api/permissions";
import type { User } from "~/api/users";
import { Breadcrumbs } from "~/components";
import { ROUTES } from "~/router";
import { AssignRolesModal } from "./AssignRolesModal";
import { RolesTable } from "./RolesTable";

export const PermissionDashboard = () => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignUserRole, setAssignUserRole] = useState<User>();
  const [, setEditUserPermission] = useState<User | null>(null);
  const [searchText, setSearchText] = useState("");

  const { data: rolesAndPermissions } = useQuery({
    ...getRolesAndPermissionsQuery(),
  });

  return (
    <div className="flex h-full w-full flex-col overflow-hidden p-8">
      <Breadcrumbs
        pages={[
          {
            name: "Platform roles",
            href: ROUTES.platformRoles,
          },
        ]}
      />
      <div className="my-4 flex items-center px-8">
        <Input
          className="w-64"
          id="id"
          left={<icons.MagnifyingGlassIcon />}
          placeholder="Search..."
          onChange={(event) => setSearchText(event.target.value)}
        />
      </div>

      <RolesTable
        onEditPermissions={(user) => {
          setEditUserPermission(user);
        }}
        onAssignRole={(user) => {
          setShowAssignModal(true);
          setAssignUserRole(user);
        }}
        searchText={searchText}
      />
      <AssignRolesModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        roles={rolesAndPermissions?.roles}
        userId={assignUserRole?.id ?? 0}
        userName={assignUserRole?.name ?? "Name"}
      />
      {/** TODO: Edit permissions modal goes here */}
    </div>
  );
};
