import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Button,
  HookedSelect,
  icons,
  IconWrapper,
  Popover,
  ScrollArea,
} from "@lightit/ui";

import { getClientsQuery } from "~/api/clients";
import { getAllEmployeesQuery } from "~/api/employees";
import { getProjectsQuery } from "~/api/projects";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { errorToast } from "~/utils";

export const filtersSchema = z.object({
  project: z.number({ required_error: "Invalid project id" }).nullable(),
  projectType: z.string(),
  client: z.number({ required_error: "Invalid client id" }).nullable(),
  employee: z.number().nullable(),
  rateType: z.string(),
  projectStatus: z.string(),
});

export type FiltersValues = z.infer<typeof filtersSchema>;

interface ProjectTypeCheckbox {
  client: boolean;
  internal: boolean;
}

interface ProjectStatusCheckbox {
  active: boolean;
  inactive: boolean;
  paused: boolean;
}

interface RateTypeCheckbox {
  billable: boolean;
  nonBillable: boolean;
  substitution: boolean;
  overServicing: boolean;
}

interface TrafficLightCheckbox {
  moderateRisk: boolean;
  onTrack: boolean;
  offTrack: boolean;
}

const emptyValues: FiltersValues = {
  project: null,
  projectType: "",
  client: null,
  employee: null,
  rateType: "",
  projectStatus: "",
};

interface FiltersProps {
  defaultValues: FiltersValues;
  onFilterApply: (values: FiltersValues) => void;
}

export const Filters = ({ defaultValues, onFilterApply }: FiltersProps) => {
  const [open, setOpen] = useState(false);

  const [projectType, setProjectType] = useState({
    client: true,
    internal: true,
  });

  const [projectStatus, setProjectStatus] = useState({
    active: true,
    inactive: true,
    paused: true,
  });

  const [rateType, setRateType] = useState({
    billable: true,
    nonBillable: true,
    substitution: true,
    overServicing: true,
  });

  const [trafficLight, setTrafficLight] = useState({
    moderateRisk: true,
    onTrack: true,
    offTrack: true,
  });

  const {
    control,
    handleSubmit,
    reset,
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
        label: employee.name,
        avatarUrl: employee.avatarUrl,
      })),
  });

  const { hasPermission } = usePermissions();
  const canCreateBillableProject = hasPermission(
    PERMISSIONS.createClientProject,
  );

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

  const handleProjectTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, checked } = event.target;
    setProjectType((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleProjectStatusChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, checked } = event.target;
    setProjectStatus((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleRateTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setRateType((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleTrafficLightChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, checked } = event.target;
    setTrafficLight((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
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
        <form
          className="flex flex-col gap-8"
          onSubmit={(e) => {
            void handleSubmit((values) => {
              const selectedProjectType = Object.keys(projectType)
                .filter((key) => projectType[key as keyof ProjectTypeCheckbox])
                .join(",");

              const selectedProjectStatus = Object.keys(projectStatus)
                .filter(
                  (key) => projectStatus[key as keyof ProjectStatusCheckbox],
                )
                .join(",");

              const selectedRateType = Object.keys(rateType)
                .filter((key) => rateType[key as keyof RateTypeCheckbox])
                .join(",");

              const selectedTrafficLight = Object.keys(trafficLight)
                .filter(
                  (key) => trafficLight[key as keyof TrafficLightCheckbox],
                )
                .join(",");

              const filtersToSend = {
                ...values,
                projectType: selectedProjectType,
                projectStatus: selectedProjectStatus,
                rateType: selectedRateType,
                trafficLight: selectedTrafficLight,
              };

              onFilterApply(filtersToSend);
              setOpen(false);
            })(e);
          }}
        >
          <ScrollArea className="h-auto">
            <div className="flex max-h-[calc(100vh-22rem)] w-[38rem] flex-col gap-6 p-4 pb-0">
              <div className="flex items-end gap-3">
                <HookedSelect
                  autocomplete
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
                    onClick={() => setValue("project", null)}
                  />
                </IconWrapper>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-sm">Project Type</h2>
                <div className="flex items-center gap-8">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="client"
                      checked={projectType.client}
                      onChange={handleProjectTypeChange}
                      className="cursor-pointer rounded checked:bg-nostalgia-purple-900 hover:checked:bg-nostalgia-purple-700 focus:ring-nostalgia-purple-900 focus:checked:bg-nostalgia-purple-900"
                    />
                    Client
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="internal"
                      checked={projectType.internal}
                      onChange={handleProjectTypeChange}
                      className="cursor-pointer rounded checked:bg-nostalgia-purple-900 hover:checked:bg-nostalgia-purple-700 focus:ring-nostalgia-purple-900 focus:checked:bg-nostalgia-purple-900"
                    />
                    Internal
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-sm">Project Status</h2>
                <div className="flex items-center gap-8">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="active"
                      checked={projectStatus.active}
                      onChange={handleProjectStatusChange}
                      className="cursor-pointer rounded checked:bg-nostalgia-purple-900 hover:checked:bg-nostalgia-purple-700 focus:ring-nostalgia-purple-900 focus:checked:bg-nostalgia-purple-900"
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="inactive"
                      checked={projectStatus.inactive}
                      onChange={handleProjectStatusChange}
                      className="cursor-pointer rounded checked:bg-nostalgia-purple-900 hover:checked:bg-nostalgia-purple-700 focus:ring-nostalgia-purple-900 focus:checked:bg-nostalgia-purple-900"
                    />
                    Inactive
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="paused"
                      checked={projectStatus.paused}
                      onChange={handleProjectStatusChange}
                      className="cursor-pointer rounded checked:bg-nostalgia-purple-900 hover:checked:bg-nostalgia-purple-700 focus:ring-nostalgia-purple-900 focus:checked:bg-nostalgia-purple-900"
                    />
                    Paused
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-sm">Rate Type</h2>
                <div className="flex items-center gap-8">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="billable"
                      checked={rateType.billable}
                      onChange={handleRateTypeChange}
                      className="cursor-pointer rounded checked:bg-nostalgia-purple-900 hover:checked:bg-nostalgia-purple-700 focus:ring-nostalgia-purple-900 focus:checked:bg-nostalgia-purple-900"
                    />
                    Billable
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="nonBillable"
                      checked={rateType.nonBillable}
                      onChange={handleRateTypeChange}
                      className="cursor-pointer rounded checked:bg-nostalgia-purple-900 hover:checked:bg-nostalgia-purple-700 focus:ring-nostalgia-purple-900 focus:checked:bg-nostalgia-purple-900"
                    />
                    Non-Billable
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="substitution"
                      checked={rateType.substitution}
                      onChange={handleRateTypeChange}
                      className="cursor-pointer rounded checked:bg-nostalgia-purple-900 hover:checked:bg-nostalgia-purple-700 focus:ring-nostalgia-purple-900 focus:checked:bg-nostalgia-purple-900"
                    />
                    Substitution
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="over-servicing"
                      checked={rateType.overServicing}
                      onChange={handleRateTypeChange}
                      className="cursor-pointer rounded checked:bg-nostalgia-purple-900 hover:checked:bg-nostalgia-purple-700 focus:ring-nostalgia-purple-900 focus:checked:bg-nostalgia-purple-900"
                    />
                    Over-servicing
                  </label>
                </div>
              </div>

              <div className="flex items-end gap-3">
                <HookedSelect
                  id="client"
                  containerClassName="w-full"
                  label="Client name"
                  placeholder="Select a client"
                  options={clientOptions}
                  control={control}
                  error={errors.client?.message}
                  disabled={!clientOptions.length}
                  autocomplete
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
                  id="employee"
                  label="Employee name"
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
                    onClick={() => setValue("employee", null)}
                  />
                </IconWrapper>
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-sm">Traffic Light Status</h2>
                <div className="flex items-center gap-8">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="moderateRisk"
                      checked={trafficLight.moderateRisk}
                      onChange={handleTrafficLightChange}
                      className="cursor-pointer rounded checked:bg-nostalgia-purple-900 hover:checked:bg-nostalgia-purple-700 focus:ring-nostalgia-purple-900 focus:checked:bg-nostalgia-purple-900"
                    />
                    Moderate Risk
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="onTrack"
                      checked={trafficLight.onTrack}
                      onChange={handleTrafficLightChange}
                      className="cursor-pointer rounded checked:bg-nostalgia-purple-900 hover:checked:bg-nostalgia-purple-700 focus:ring-nostalgia-purple-900 focus:checked:bg-nostalgia-purple-900"
                    />
                    On Track
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="offTrack"
                      checked={trafficLight.offTrack}
                      onChange={handleTrafficLightChange}
                      className="cursor-pointer rounded checked:bg-nostalgia-purple-900 hover:checked:bg-nostalgia-purple-700 focus:ring-nostalgia-purple-900 focus:checked:bg-nostalgia-purple-900"
                    />
                    Off Track
                  </label>
                </div>
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
