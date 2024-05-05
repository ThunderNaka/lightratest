import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";

import { tw } from "@lightit/shared";
import { useToastStore } from "@lightit/toast";
import {
  Button,
  Checkbox,
  icons,
  IconWrapper,
  Input,
  Typography,
} from "@lightit/ui";

import { updateRolesPermissions } from "~/api/permissions";
import type { Role, RolesAndPermissions } from "~/api/permissions";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { errorToast } from "~/utils";

const fuseOptions = {
  threshold: 0.4,
  keys: ["name"],
};

const formatData = (permissionFields: FieldValues) => {
  const formattedData: Omit<Role, "name">[] = [];
  Object.entries(permissionFields).forEach(([key, hasPermission]) => {
    const [roleId, permissionId] = key.split("-") as [string, string];
    const currentRoleIndex = formattedData.findIndex(
      (role) => role.id === Number(roleId),
    );
    if (currentRoleIndex === -1) {
      formattedData.push({
        id: Number(roleId),
        permissions: hasPermission ? [permissionId] : [],
      });
    } else {
      if (hasPermission)
        formattedData[currentRoleIndex]?.permissions.push(permissionId);
    }
  });
  return formattedData;
};

const getDefaultValues = ({ roles, permissions }: RolesAndPermissions) => {
  const defaultValues: Record<string, boolean> = {};
  roles.forEach((role) =>
    permissions.forEach(
      (permission) =>
        (defaultValues[`${role.id}-${permission.id}`] =
          role.permissions.includes(permission.name)),
    ),
  );
  return defaultValues;
};

export const PermissionsTable = ({
  permissions,
}: {
  permissions: RolesAndPermissions;
}) => {
  const pushToast = useToastStore((state) => state.pushToast);
  const { hasPermission } = usePermissions();
  const [editMode, setEditMode] = useState(false);
  const [searchText, setSearchText] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: getDefaultValues(permissions),
  });

  // TODO: this is a code smell, let's refactor these useEffects
  useEffect(() => {
    reset(getDefaultValues(permissions));
  }, [permissions, reset]);

  useEffect(() => {
    if (!editMode) reset();
  }, [editMode, reset]);

  const queryClient = useQueryClient();

  const handleSuccess = () => {
    void pushToast({
      type: "success",
      title: "Update Success",
      message: "Permissions successfully updated!",
    });
    updateRolesPermissions.invalidates(queryClient);
    setEditMode(false);
  };

  const { mutate } = useMutation({
    mutationFn: updateRolesPermissions.mutation,
    onSuccess: handleSuccess,
    onError: (err) => {
      errorToast(err);
    },
  });

  const filteredPermissions = useMemo(() => {
    if (!searchText) {
      return permissions.permissions;
    }

    const fuse = new Fuse(permissions.permissions, fuseOptions);

    return fuse.search(searchText).map((result) => result.item);
  }, [permissions.permissions, searchText]);

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit((data) => {
          mutate(formatData(data));
        })(e);
      }}
      className="h-full w-full overflow-y-auto p-8"
    >
      <div className="my-4 flex items-center justify-between px-8">
        <Input
          className="w-64"
          id="id"
          left={<icons.MagnifyingGlassIcon />}
          placeholder="Search..."
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />

        <div className="flex items-center gap-2">
          {editMode ? (
            <>
              <Button
                className="h-9"
                size="sm"
                variant="secondary"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
              <Button
                className="h-9"
                size="sm"
                variant="primary"
                right={<icons.CheckIcon />}
                type="submit"
                disabled={!isDirty}
              >
                Save Permissions
              </Button>
            </>
          ) : (
            hasPermission(PERMISSIONS.updateRole) && (
              <Button
                className="h-9"
                size="sm"
                variant="secondary"
                right={<icons.PencilIcon />}
                onClick={() => setEditMode(true)}
              >
                Edit Roles
              </Button>
            )
          )}
        </div>
      </div>
      <table className="w-full">
        <thead className="sticky">
          <tr className="sticky top-0 z-10 bg-white shadow-sm">
            <th
              className={tw(
                "sticky border border-b-0 border-t-0 px-8 py-6 text-left",
              )}
            >
              <Typography font="regular" className="text-neutrals-dark-200">
                Actions
              </Typography>
            </th>
            {permissions?.roles.map((role) => (
              <th
                className={tw("sticky border border-b-0 border-t-0 px-8 py-6")}
                key={role.id}
              >
                <Typography
                  font="regular"
                  className="text-center capitalize text-neutrals-dark-200"
                >
                  {role.name}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredPermissions.map((permission) => (
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
              {permissions?.roles.map((role) => (
                <td key={role.id} className="border border-t-0">
                  <div className="flex justify-center">
                    {editMode ? (
                      <Checkbox
                        id={`${role.id}-${permission.id}`}
                        {...register(`${role.id}-${permission.id}`)}
                      />
                    ) : (
                      <IconWrapper size="md">
                        {role.permissions.includes(permission.name) ? (
                          <icons.CheckIcon className="text-alert-success-500" />
                        ) : (
                          <icons.XMarkIcon className="text-complementary-red-500" />
                        )}
                      </IconWrapper>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </form>
  );
};
