import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToastStore } from "@lightit/toast";
import { Button, HookedSelect, Modal, Typography } from "@lightit/ui";

import type { Role } from "~/api/permissions";
import { updateUserRole } from "~/api/users";
import { errorToast } from "~/utils";

const userRoleSchema = z.object({
  role: z.string().min(1, { message: "Role is required" }),
});
type UserRoleFormValues = z.infer<typeof userRoleSchema>;

interface AssignRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles?: Role[];
  userId: number;
  userName: string;
}

// Is this a formModal? it's a form and a modal but you don't navigate to it
export const AssignRolesModal = ({
  isOpen,
  onClose,
  roles,
  userId,
  userName,
}: AssignRolesModalProps) => {
  const pushToast = useToastStore((state) => state.pushToast);
  const queryClient = useQueryClient();
  const options =
    roles?.map(({ name }) => ({ label: name, value: name })) ?? [];

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<UserRoleFormValues>({
    resolver: zodResolver(userRoleSchema),
  });
  const { mutate } = useMutation({
    mutationFn: updateUserRole.mutation,
    onSuccess: () => {
      onClose();
      void pushToast({
        type: "success",
        title: "Success",
        message: "User Role successfully updated!",
      });
      updateUserRole.invalidates(queryClient);
    },
    onError: (err) => {
      errorToast(err);
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="rounded-md bg-white">
        <Typography className="w-full border-b p-4 text-left" variant="large">
          Assign Roles
        </Typography>
        <form
          className="space-y-4 p-4"
          onSubmit={(e) =>
            void handleSubmit((data) =>
              mutate({
                userId: userId,
                roles: [data.role],
              }),
            )(e)
          }
        >
          <Typography className="text-left" font="regular">
            Setting the roles for <Typography as="span">{userName}</Typography>
          </Typography>
          <HookedSelect
            options={options}
            id="role"
            placeholder="Select a Role"
            className="capitalize"
            control={control}
            error={errors.role?.message}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="tertiary-link"
              size="sm"
              className="text-neutrals-dark-500"
              onClick={() => {
                onClose();
                reset();
              }}
            >
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Save
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
