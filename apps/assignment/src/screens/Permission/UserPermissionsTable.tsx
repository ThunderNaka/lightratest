import React from "react";

import { tw } from "@lightit/shared";
import { Switch, Typography } from "@lightit/ui";

import type { User } from "~/api/users";

interface UserPermissionsTableProps {
  user?: User;
}
export const UserPermissionsTable = ({ user }: UserPermissionsTableProps) => {
  return (
    <div className="h-full w-full overflow-y-scroll">
      <table className="w-full ">
        <thead>
          <tr className="sticky top-0 z-10 bg-white shadow-sm">
            <th
              className={tw("border border-b-0 border-t-0 px-8 py-6 text-left")}
            >
              <Typography font="regular" className="text-neutrals-dark-200">
                Actions
              </Typography>
            </th>
            {user?.roles?.map((role) => (
              <th
                className={tw("w-1/6 border border-b-0 border-t-0")}
                key={role.id}
              >
                <Typography
                  font="regular"
                  className="capitalize text-neutrals-dark-200"
                >
                  {role.name}
                </Typography>
              </th>
            ))}
            <th className={tw("w-1/6 border border-b-0 border-t-0")}>
              <Typography
                font="regular"
                className="capitalize text-neutrals-dark-200"
              >
                {user?.name}
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {user?.permissions?.map((permission) => (
            <tr key={permission.id}>
              <td className="border border-t-0 px-8 py-7">
                <Typography variant="large" className="capitalize">
                  {permission.name}
                </Typography>
                <Typography
                  variant="small"
                  font="regular"
                  className="text-primary-300"
                >
                  {permission.description}
                </Typography>
              </td>

              {user?.roles?.map((role) => (
                <td key={role.id} className="border border-t-0">
                  <div className="flex justify-center">
                    {role.permissions.includes(permission.name) ? (
                      <Switch checked={true} />
                    ) : (
                      <Switch checked={false} />
                    )}
                  </div>
                </td>
              ))}
              <td className="border border-t-0">
                <div className="flex justify-center">
                  {user.permissions?.some(
                    (userPermission) => userPermission.id === permission.id,
                  ) ? (
                    <Switch checked={true} />
                  ) : (
                    <Switch checked={false} />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
