import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";

import { ScrollArea } from "@lightit/ui";

import { getUsersWithRolesAndPermissionsQuery } from "~/api/users";
import type { User } from "~/api/users";
import { ScreenLoading } from "~/components";
import { RoleRow } from "./RoleRow";

interface RolesTableProps {
  onAssignRole: (user: User) => void;
  onEditPermissions: (user: User) => void;
  searchText: string;
}

const fuseOptions = {
  threshold: 0.4,
  keys: ["name"],
};

export const RolesTable = ({
  onAssignRole,
  onEditPermissions,
  searchText,
}: RolesTableProps) => {
  const { data: usersWithRolesAndPermissions } = useQuery({
    ...getUsersWithRolesAndPermissionsQuery(),
  });

  const filteredUsersWithRolesAndPermissions = useMemo(() => {
    if (!searchText) {
      return usersWithRolesAndPermissions;
    }

    const fuse =
      usersWithRolesAndPermissions &&
      new Fuse(usersWithRolesAndPermissions, fuseOptions);

    return fuse?.search(searchText).map((result) => result.item);
  }, [usersWithRolesAndPermissions, searchText]);

  return (
    <ScrollArea>
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="sticky top-0 border-b border-neutrals-light-200 bg-white py-6 pl-8 text-left text-sm font-medium text-primary-white-700 ">
              <div className="flex flex-row items-center space-x-2">
                <p>Name</p>
              </div>
            </th>
            <th className="sticky top-0 border-b border-neutrals-light-200 bg-white py-6 text-left text-sm font-medium text-primary-white-700">
              Email
            </th>
            <th className="sticky top-0 border-b border-neutrals-light-200 bg-white py-6 text-left text-sm font-medium text-primary-white-700">
              Role
            </th>
            <th className="sticky top-0 z-10 border-b border-neutrals-light-200 bg-white text-left text-sm text-primary-white-700"></th>
          </tr>
        </thead>
        {!filteredUsersWithRolesAndPermissions ? (
          <ScreenLoading />
        ) : (
          filteredUsersWithRolesAndPermissions.map((user) => (
            <RoleRow
              key={user.id}
              user={user}
              onAssignRole={onAssignRole}
              onEditPermissions={onEditPermissions}
            />
          ))
        )}
      </table>
    </ScrollArea>
  );
};
