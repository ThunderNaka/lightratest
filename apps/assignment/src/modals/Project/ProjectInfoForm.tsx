import React from "react";
import { useQuery } from "@tanstack/react-query";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { z } from "zod";

import { validations } from "@lightit/shared";
import {
  ColorPickerInput,
  DatePickerInput,
  HookedSelect,
  Input,
  TextArea,
} from "@lightit/ui";

import { getClientsQuery } from "~/api/clients";
import { getAllEmployeesQuery } from "~/api/employees";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { errorToast } from "~/utils";

export const projectInfoSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  clientId: z.number({ required_error: "Client is required" }),
  description: z.string().max(255),
  accountManagerId: z.number({ required_error: "Account Manager is required" }),
  techLeadId: z.number().optional().nullable(),
  projectManagerId: z.number().optional().nullable(),
  color: validations.color.min(1, { message: "Color is required" }),
  startDate: validations.date(),
  endDate: validations.date(),
  type: z.string().min(1, { message: "Project type is required" }),
});

export type ProjectInfoFormValues = z.infer<typeof projectInfoSchema>;

export interface ProjectInfoForm {
  control: Control<ProjectInfoFormValues>;
  errors: FieldErrors<ProjectInfoFormValues>;
  register: UseFormRegister<ProjectInfoFormValues>;
}

export const ProjectInfoForm = ({
  control,
  errors,
  register,
}: ProjectInfoForm) => {
  const { hasPermission } = usePermissions();
  const canCreateClientProject = hasPermission(PERMISSIONS.createClientProject);

  const { data: clientOptions } = useQuery({
    ...getClientsQuery(),
    onError: errorToast,
    enabled: canCreateClientProject,
    initialData: [],
    select: (data) =>
      data.map((client) => ({ value: client.id, label: client.name })),
  });

  const { data: employeeOptions } = useQuery({
    ...getAllEmployeesQuery(),
    onError: errorToast,
    initialData: [],
    select: (data) =>
      data.map((employee) => ({
        value: employee.id,
        label: employee.name,
        avatarUrl: employee.avatarUrl,
      })),
  });

  const projectTypes = [
    ...(hasPermission(PERMISSIONS.createClientProject)
      ? [{ label: "Client", value: "client" }]
      : []),
    ...(hasPermission(PERMISSIONS.createInternalProject)
      ? [{ label: "Internal", value: "internal" }]
      : []),
  ] as const;

  return (
    <div className="grid grow grid-cols-2 gap-x-4 gap-y-6 overflow-y-auto pb-1 pl-8 pr-6 pt-12">
      {canCreateClientProject && (
        <HookedSelect
          id="clientId"
          label="Client"
          placeholder={clientOptions[0]?.label ?? "Client id"}
          options={clientOptions}
          control={control}
          error={errors.clientId?.message}
          disabled={!clientOptions.length}
          autocomplete
        />
      )}
      <Input
        id="name"
        label="Project Name"
        placeholder="Bailey LLC"
        {...register("name")}
        error={errors.name?.message}
        containerClassName={!canCreateClientProject ? "col-span-2" : ""}
      />
      <DatePickerInput
        id="startDate"
        label="Start Date"
        placeholder="15/10/22"
        {...register("startDate")}
        control={control}
        error={errors.startDate?.message}
      />
      <DatePickerInput
        id="endDate"
        label="End Date"
        placeholder="25/06/23"
        {...register("endDate")}
        control={control}
        error={errors.endDate?.message}
      />
      <TextArea
        id="description"
        label="Description"
        placeholder="This a project description..."
        {...register("description")}
        error={errors.description?.message}
        className="h-20"
        containerClassName="col-span-2"
      />
      <HookedSelect
        id="accountManagerId"
        label="Account Manager"
        placeholder={employeeOptions[0]?.label ?? "Select Account Manager"}
        options={employeeOptions}
        control={control}
        error={errors.accountManagerId?.message}
        containerClassName="col-span-2"
        disabled={!employeeOptions.length}
        autocomplete
      />
      <HookedSelect
        id="techLeadId"
        label="Tech Lead"
        placeholder={employeeOptions[0]?.label ?? "Select Tech Lead"}
        options={employeeOptions}
        control={control}
        error={errors.techLeadId?.message}
        containerClassName="col-span-2"
        disabled={!employeeOptions.length}
        autocomplete
      />
      <HookedSelect
        id="projectManagerId"
        label="Project Manager"
        placeholder={employeeOptions[0]?.label ?? "Select Project Manager"}
        options={employeeOptions}
        control={control}
        error={errors.projectManagerId?.message}
        containerClassName="col-span-2"
        disabled={!employeeOptions.length}
        autocomplete
      />
      <ColorPickerInput
        id="color"
        label="Project color"
        containerClassName="-left-16"
        control={control}
        {...register("color")}
        error={errors.color?.message}
      />
      {projectTypes[0] && (
        <HookedSelect
          id="type"
          label="Project Type"
          placeholder={projectTypes[0].label}
          options={projectTypes}
          control={control}
          error={errors.type?.message}
        />
      )}
    </div>
  );
};
