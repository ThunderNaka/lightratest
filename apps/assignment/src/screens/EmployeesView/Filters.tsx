import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";

import {
  Button,
  EmployeeSelectOption,
  HookedSelect,
  icons,
  IconWrapper,
  Input,
  Popover,
  ScrollArea,
} from "@lightit/ui";

import { getClientsQuery } from "~/api/clients";
import { getAllEmployeesQuery } from "~/api/employees";
import { getProjectsQuery } from "~/api/projects";
import { getTeamsQuery } from "~/api/teams";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { ROLE_OPTIONS } from "~/shared.constants";
import { errorToast } from "~/utils";

export const filtersSchema = z.object({
  project: z.array(z.number({ required_error: "Invalid project id" })),
  employee: z.array(z.number({ required_error: "Invalid employee id" })),
  type: z.array(z.string()),
  position: z.string().optional(),
  rateType: z.array(z.string()),
  team: z.number().nullable(),
  client: z.number({ required_error: "Invalid client id" }).nullable(),
  displayNonAssignable: z.boolean().nullable(),
});

export type FiltersValues = z.infer<typeof filtersSchema>;

const emptyValues: FiltersValues = {
  project: [],
  employee: [],
  type: [],
  position: "",
  rateType: [],
  team: null,
  client: null,
  displayNonAssignable: true,
};

interface FiltersProps {
  defaultValues: FiltersValues;
  onFilterApply: (values: FiltersValues) => void;
}

export const Filters = ({ defaultValues, onFilterApply }: FiltersProps) => {
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    register,
    setValue,
    formState: { errors },
  } = useForm<FiltersValues>({
    resolver: zodResolver(filtersSchema),
    defaultValues,
  });

  const { data: employees, isLoading } = useQuery({
    ...getAllEmployeesQuery(),
    onError: errorToast,
    initialData: [],
    select: (data) =>
      data.map((employee) => ({
        value: employee.id,
        label: (
          <EmployeeSelectOption
            name={employee.name}
            avatarUrl={employee.avatarUrl}
          />
        ),
        selectedLabel: employee.name,
      })),
  });

  const { hasPermission } = usePermissions();
  const canCreateBillableProject = hasPermission(
    PERMISSIONS.createClientProject,
  );
  const canViewTeams = hasPermission(PERMISSIONS.viewTeam);

  const { data: teamOptions } = useQuery({
    ...getTeamsQuery(),
    onError: errorToast,
    enabled: !!canViewTeams,
    initialData: [],
    select: (data) =>
      data.map((team) => ({ value: +team.id, label: team.name })),
  });

  const { data: clientOptions } = useQuery({
    ...getClientsQuery(),
    onError: errorToast,
    enabled: canCreateBillableProject,
    initialData: [],
    select: (data) =>
      data.map((client) => ({ value: client.id, label: client.name })),
  });

  const { data: projectOptions } = useQuery({
    ...getProjectsQuery(),
    onError: errorToast,
    initialData: [],
    select: (data) =>
      data.map((project) => ({ value: project.id, label: project.name })),
  });

  const onSubmit: SubmitHandler<z.infer<typeof filtersSchema>> = (values) => {
    onFilterApply(values);
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        !!value && reset(defaultValues);
      }}
      trigger={
        <Button variant="secondary" size="sm" right={<icons.FunnelIcon />}>
          Filter
        </Button>
      }
      content={
        <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
          <ScrollArea className="h-auto">
            <div className="flex max-h-[calc(100vh-22rem)] w-[34rem] flex-col gap-6 p-4 pb-0">
              <div className="flex items-end gap-3">
                <HookedSelect
                  autocomplete
                  multiple
                  id="project"
                  containerClassName="w-full"
                  label="Project name"
                  placeholder="Select a project"
                  control={control}
                  disabled={!projectOptions.length}
                  options={projectOptions}
                  error={errors.project?.message}
                />
                <IconWrapper className="pb-9">
                  <icons.XMarkIcon
                    className="h-5 w-5 cursor-pointer text-primary-300 hover:text-complementary-red-600"
                    onClick={() => setValue("project", [])}
                  />
                </IconWrapper>
              </div>
              <div className="flex items-end gap-3">
                <Input
                  id="available-hours"
                  containerClassName="w-full"
                  label="Available Hours"
                  placeholder="Select a project"
                  onChange={() => setValue("project", [])}
                />
                <IconWrapper className="pb-9">
                  <icons.XMarkIcon
                    className="h-5 w-5 cursor-pointer text-primary-300 hover:text-complementary-red-600"
                    onClick={() => setValue("project", [2, 3])}
                  />
                </IconWrapper>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-sm">Rate type</h2>
                <div className="flex items-center gap-8">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="billable"
                      {...register("rateType")}
                      className="cursor-pointer rounded checked:bg-nostalgia-purple-900 hover:checked:bg-nostalgia-purple-700 focus:ring-nostalgia-purple-900 focus:checked:bg-nostalgia-purple-900"
                    />
                    Billable
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="non-billable"
                      {...register("rateType")}
                      className="cursor-pointer rounded checked:bg-nostalgia-purple-900 hover:checked:bg-nostalgia-purple-700 focus:ring-nostalgia-purple-900 focus:checked:bg-nostalgia-purple-900"
                    />
                    Non-Billable
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="substitution"
                      {...register("rateType")}
                      className="cursor-pointer rounded checked:bg-nostalgia-purple-900 hover:checked:bg-nostalgia-purple-700 focus:ring-nostalgia-purple-900 focus:checked:bg-nostalgia-purple-900"
                    />
                    Substitution
                  </label>
                </div>
              </div>

              <div className="flex items-end gap-3">
                <HookedSelect
                  autocomplete
                  id="client"
                  containerClassName="w-full"
                  label="Client name"
                  placeholder="Select a client"
                  options={clientOptions}
                  control={control}
                  error={errors.client?.message}
                  disabled={!clientOptions.length}
                />
                <IconWrapper className="pb-9">
                  <icons.XMarkIcon
                    className="h-5 w-5 cursor-pointer text-primary-300 hover:text-complementary-red-600"
                    onClick={() => setValue("client", null)}
                  />
                </IconWrapper>
              </div>

              <div className="flex items-end gap-3">
                <HookedSelect
                  autocomplete
                  multiple
                  id="employee"
                  label="Assignee"
                  placeholder="Select an employee"
                  disabled={isLoading}
                  options={employees}
                  control={control}
                  containerClassName="grow"
                  error={errors.employee?.message}
                />
                <IconWrapper className="pb-9">
                  <icons.XMarkIcon
                    className="h-5 w-5 cursor-pointer text-primary-300 hover:text-complementary-red-600"
                    onClick={() => setValue("employee", [])}
                  />
                </IconWrapper>
              </div>

              <div className="flex items-end gap-3">
                <HookedSelect
                  autocomplete
                  id="position"
                  label="Position"
                  placeholder="Select the employee role"
                  options={ROLE_OPTIONS}
                  control={control}
                  containerClassName="grow"
                  error={errors.position?.message}
                />
                <IconWrapper className="pb-9">
                  <icons.XMarkIcon
                    className="h-5 w-5 cursor-pointer text-primary-300 hover:text-complementary-red-600"
                    onClick={() => setValue("position", "")}
                  />
                </IconWrapper>
              </div>

              <div className="flex items-end gap-3">
                <HookedSelect
                  autocomplete
                  id="team"
                  label="Team"
                  placeholder="Select a team"
                  options={teamOptions}
                  control={control}
                  containerClassName="grow"
                  error={errors.team?.message}
                />
                <IconWrapper className="pb-9">
                  <icons.XMarkIcon
                    className="h-5 w-5 cursor-pointer text-primary-300 hover:text-complementary-red-600"
                    onClick={() => setValue("team", null)}
                  />
                </IconWrapper>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-sm">Assignment type</h2>
                <div className="flex items-center gap-8">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="project"
                      {...register("type")}
                      className="cursor-pointer rounded checked:bg-nostalgia-purple-900 hover:checked:bg-nostalgia-purple-700 focus:ring-nostalgia-purple-900 focus:checked:bg-nostalgia-purple-900"
                    />
                    Project
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="course"
                      {...register("type")}
                      className="cursor-pointer rounded checked:bg-nostalgia-purple-900 hover:checked:bg-nostalgia-purple-700 focus:ring-nostalgia-purple-900 focus:checked:bg-nostalgia-purple-900"
                    />
                    Course
                  </label>
                </div>
              </div>

              <div className="flex items-end gap-3">
                <label className="relative flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="displayNonAssignable"
                    {...register("displayNonAssignable")}
                    className="peer sr-only cursor-pointer rounded checked:bg-nostalgia-purple-900 hover:checked:bg-nostalgia-purple-700 focus:ring-nostalgia-purple-900 focus:checked:bg-nostalgia-purple-900"
                  />
                  <div className="block h-5 w-8 rounded-full border bg-gray-400 peer-checked:bg-secondary-900"></div>
                  <div className="dot absolute left-1 top-1.5 h-3 w-3 rounded-full bg-white transition peer-checked:translate-x-full"></div>
                  Display non-assignable employees
                </label>
              </div>
            </div>
          </ScrollArea>

          <div className="flex flex-row justify-end gap-4 p-4 pt-0">
            <Button
              onClick={() => {
                onFilterApply(emptyValues);
                setOpen(false);
              }}
              size="sm"
              variant="outline"
              className="w-32"
            >
              Clear Filters
            </Button>
            <Button type="submit" size="sm" className="w-32">
              Apply
            </Button>
          </div>
        </form>
      }
    />
  );
};
