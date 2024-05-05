import React from "react";

import { tw } from "@lightit/shared";
import { CircularAvatar, Dropdown, icons, Typography } from "@lightit/ui";

import type { User } from "~/api/users";

export interface RoleRowProps {
  user: User;
  onAssignRole: (user: User) => void;
  onEditPermissions: (user: User) => void;
}

export const RoleRow = ({
  user,
  onAssignRole,
  onEditPermissions,
}: RoleRowProps) => {
  return (
    <tr className="even:bg-primary-white-500">
      <td className="flex items-center gap-2 py-6 pl-8">
        <CircularAvatar size="xs" defaultToIcon={false} name={user.name} />
        <Typography variant="small" className="cursor-pointer hover:underline">
          {user.name}
        </Typography>
      </td>
      <td>
        <Typography variant="small">{user.email}</Typography>
      </td>
      <td className="flex gap-2">
        {user.roles?.map((role) => (
          <span
            key={role.id}
            className={tw(
              "truncate rounded bg-primary-100 px-2 py-1 text-xs capitalize text-white",
              role.name === "admin"
                ? "bg-secondary-600"
                : "bg-complementary-blue-500",
            )}
          >
            {role.name}
          </span>
        ))}
      </td>
      <td>
        <Dropdown
          containerClassName="w-fit"
          optionsContainerClassName="bg-primary-white-50 rounded-2xl py-4 w-48 gap-2"
          label="..."
          renderButton={({ open, onClick }) => (
            <div
              className={tw(
                "flex h-9 w-9 cursor-pointer items-center justify-center rounded-md",
                open && "bg-secondary-50",
              )}
            >
              <button onClick={onClick}>
                <icons.EllipsisVerticalIcon className="h-6 w-6 text-secondary-500" />
              </button>
            </div>
          )}
          options={[
            {
              value: "assignRoles",
              label: "Assign Roles",
              left: <icons.UserIcon />,
              onClick: () => onAssignRole(user),
            },
            {
              value: "setPermissions",
              label: "Set Permissions",
              left: <icons.LockOpenIcon />,
              disabled: true,
              onClick: () => onEditPermissions(user),
            },
          ]}
        />
      </td>
    </tr>
  );
};
