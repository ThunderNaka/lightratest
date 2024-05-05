import { useQuery } from "@tanstack/react-query";

import { getRolesAndPermissionsQuery } from "~/api/permissions";
import { PermissionsTable } from "./PermissionsTable";

export const RoleDashboard = () => {
  const { data: rolesAndPermissions } = useQuery({
    ...getRolesAndPermissionsQuery(),
  });

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {rolesAndPermissions && (
        <PermissionsTable permissions={rolesAndPermissions} />
      )}
    </div>
  );
};
