import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { tw, validations } from "@lightit/shared";
import { useToastStore } from "@lightit/toast";
import {
  Button,
  Chip,
  CircularAvatar,
  Dropdown,
  HookedSelect,
  icons,
  Input,
  Select,
  Typography,
} from "@lightit/ui";

import { getEmployeesQuery } from "~/api/employees";
import { createTeam, updateTeam } from "~/api/teams";
import type { Team } from "~/api/teams";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { ROUTES } from "~/router";
import { errorToast, handleAxiosFieldErrors } from "~/utils";

const newTeamSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  leaderId: validations.integer({ req: true, reqMsg: "Leader is required" }),
  memberIds: z.array(
    validations.integer({ req: true, reqMsg: "Member is required" }),
  ),
});

export type NewTeamFormValues = z.infer<typeof newTeamSchema>;

export const TeamForm = ({
  team,
  defaultValues,
  onClose,
}: {
  team?: Team;
  defaultValues: NewTeamFormValues;
  onClose: () => void;
}) => {
  const pushToast = useToastStore((state) => state.pushToast);

  const queryClient = useQueryClient();
  const createTeamMutation = useMutation({
    mutationFn: createTeam.mutation,
    onSuccess: (data) => {
      void pushToast({
        type: "success",
        title: "Creation Success",
        message: `Team "${team?.name}" successfully created!`,
      });
      createTeam.invalidates(queryClient, { teamId: data.data.id });
      onClose();
    },
    onError: (err) => {
      errorToast(err);
      handleAxiosFieldErrors(err, setError);
    },
  });

  const { hasPermission } = usePermissions();

  const [addMembers, setAddMembers] = useState(false);

  const [selectedMember, setSelectedMember] = useState<string>();

  const { data: employeesResponse } = useQuery({
    ...getEmployeesQuery(),
    onError: errorToast,
  });

  const updateTeamMutation = useMutation({
    mutationFn: updateTeam.mutation,
    onSuccess: (data, variables) => {
      void pushToast({
        type: "success",
        title: "Update Success",
        message: `Team "${team?.name}" successfully updated!`,
      });

      updateTeam.invalidates(queryClient, { teamId: variables.id });

      onClose();
    },
    onError: (err) => {
      errorToast(err);
      handleAxiosFieldErrors(err, setError);
    },
  });

  const {
    formState: { errors, isDirty },
    register,
    setError,
    handleSubmit,
    setValue,
    watch,
    control,
  } = useForm<NewTeamFormValues>({
    resolver: zodResolver(newTeamSchema),
    defaultValues,
  });

  const members = watch("memberIds") || [];
  const leaderId = watch("leaderId") || "";

  const employeeOptions =
    employeesResponse?.map((e) => ({
      value: `${e.id}`,
      label: e.name,
      avatarUrl: e.avatarUrl,
      disabled: members?.some(
        (memberId) => memberId === `${e.id}` || leaderId === `${e.id}`,
      ),
    })) ?? [];

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit((data) => {
          team
            ? updateTeamMutation.mutate({
                id: team.id,
                name: data.name,
                leaderId: data.leaderId,
                memberIds: data.memberIds,
              })
            : createTeamMutation.mutate(data);
        })(e);
      }}
      className="flex h-full flex-col overflow-hidden"
    >
      <div className="flex grow flex-col gap-y-2 overflow-y-auto px-8 pt-12">
        <Input
          id="name"
          label="Team Name"
          placeholder="QA"
          {...register("name")}
          error={errors.name?.message}
          disabled={!hasPermission(PERMISSIONS.updateTeam)}
        />
        <HookedSelect
          id="leaderId"
          label="Team Leader"
          placeholder={employeeOptions[0]?.label ?? "Select a Leader"}
          options={employeeOptions}
          control={control}
          error={errors.leaderId?.message}
          className="col-span-2 h-11"
          disabled={
            !hasPermission(PERMISSIONS.updateTeam) || !employeeOptions.length
          }
          autocomplete
        />

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex flex-row items-center justify-between">
              <title className="flex h-[38px] items-center text-sm font-medium text-neutrals-dark-900">
                Team Members
              </title>
              {!addMembers && hasPermission(PERMISSIONS.updateTeam) && (
                <Button
                  variant="secondary"
                  size="sm"
                  right={<icons.PlusIcon />}
                  onClick={() => setAddMembers(true)}
                >
                  Add member
                </Button>
              )}
            </div>

            {addMembers && (
              <div className="flex items-center justify-center gap-4">
                <Select
                  id="members"
                  placeholder={employeeOptions[0]?.label ?? "Employee Name"}
                  options={employeeOptions}
                  className="w-full"
                  value={selectedMember ?? ""}
                  onChange={(value) => {
                    setSelectedMember(value);
                  }}
                  autocomplete
                />

                <Button
                  variant="secondary"
                  size="sm"
                  className="h-11"
                  right={<icons.CheckIcon />}
                  onClick={() => {
                    if (selectedMember) {
                      setValue("memberIds", [...members, selectedMember], {
                        shouldDirty: true,
                      });
                    }
                    setSelectedMember(undefined);
                    setAddMembers(false);
                  }}
                >
                  Confirm
                </Button>
              </div>
            )}
          </div>

          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                {["name", "position"].map((col) => (
                  <th
                    key={col}
                    className="border-y border-stone-300 bg-white py-4 text-left text-sm font-medium capitalize text-primary-white-700 first:pl-6 last:pr-6"
                  >
                    {col}
                  </th>
                ))}
                <th className="border-y border-stone-300 bg-white py-4 text-left text-sm font-medium text-primary-white-700 first:pl-6 last:pr-6" />
              </tr>
            </thead>
            <tbody className="text-sm">
              {members?.map((memberId) => {
                const employee = employeesResponse?.find(
                  (employee) => employee.id === +memberId,
                );
                return (
                  employee && (
                    <tr key={employee.id}>
                      <td className="flex items-center truncate border-b p-6 py-4">
                        <CircularAvatar
                          size="md"
                          defaultToIcon={employee.avatarUrl ? true : false}
                          image={employee.avatarUrl}
                          name={employee.name}
                        />
                        <Link to={`${ROUTES.employees}/${employee?.id}`}>
                          <Typography className="ml-2 cursor-pointer hover:underline">
                            {employee.name}
                          </Typography>
                        </Link>
                      </td>
                      <td className="border-b">
                        {employee.jobTitle && (
                          <Chip
                            className="bg-neutrals-light-200 text-neutrals-dark-200"
                            size="lg"
                          >
                            {employee.jobTitle}
                          </Chip>
                        )}
                      </td>
                      <td className="border-b">
                        {hasPermission(PERMISSIONS.updateTeam) && (
                          <Dropdown
                            containerClassName="w-fit"
                            optionsContainerClassName="bg-primary-white-50 rounded-2xl py-4 w-32 gap-2"
                            label="..."
                            renderButton={({ open, onClick }) => (
                              <div
                                className={tw(
                                  "flex h-9 w-9 cursor-pointer items-center justify-center rounded-md bg-primary-white-50",
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
                                value: "delete",
                                label: "Remove",
                                left: <icons.TrashIcon />,
                                onClick: () => {
                                  setValue(
                                    "memberIds",
                                    members.filter((m) => m !== memberId),
                                    { shouldDirty: true },
                                  );
                                },
                              },
                            ]}
                          />
                        )}
                      </td>
                    </tr>
                  )
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {hasPermission(PERMISSIONS.updateTeam) && (
        <div className="flex justify-end gap-5 p-8 pb-9">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="primary" size="sm" type="submit" disabled={!isDirty}>
            Save Team
          </Button>
        </div>
      )}
    </form>
  );
};
