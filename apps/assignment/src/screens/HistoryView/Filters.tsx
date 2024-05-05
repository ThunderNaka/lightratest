import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { validations } from "@lightit/shared";
import {
  Button,
  DatePickerInput,
  EmployeeSelectOption,
  HookedSelect,
  icons,
  IconWrapper,
  Popover,
  ScrollArea,
} from "@lightit/ui";

import { getAssignableOptions } from "~/api/assignments";
import { getAllEmployeesQuery } from "~/api/employees";
import { errorToast } from "~/utils";

export const filtersSchema = z.object({
  assignable: z.string().nullable(),
  assignedById: z.number().nullable(),
  employeeId: z.number().nullable(),
  type: z.string(),
  fromDate: validations.date(false),
  toDate: validations.date(false),
  isNotified: z.string(),
  "employee.name": z.string(),
});

export type FiltersValues = z.infer<typeof filtersSchema>;

const emptyValues: FiltersValues = {
  assignable: "",
  assignedById: null,
  employeeId: null,
  type: "",
  fromDate: "",
  toDate: "",
  isNotified: "",
  "employee.name": "",
};

const assignmentTypes = [
  { label: "Project", value: "project" },
  { label: "Course", value: "course" },
  { label: "Time Off", value: "timeOff" },
] as const;

const notifiedOptions = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
] as const;

interface FiltersProps {
  defaultValues: FiltersValues;
  onFilterApply: (values: FiltersValues) => void;
}

export const Filters = ({ defaultValues, onFilterApply }: FiltersProps) => {
  const [open, setOpen] = useState(false);

  const {
    control,
    register,
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
        label: (
          <EmployeeSelectOption
            name={employee.name}
            avatarUrl={employee.avatarUrl}
          />
        ),
      })),
  });

  const { data: assignableOptions, isLoading: isAssignableOptionsLoading } =
    useQuery({
      ...getAssignableOptions(),
      onError: errorToast,
      select: (assignable) =>
        assignable.map((assignable) => ({
          value: `${assignable.id}-${assignable.type}`,
          label: (
            <p>
              {assignable.name}
              <span className="text-xs text-gray-400">
                {" "}
                - {assignable.type}
              </span>
            </p>
          ),
        })),
    });

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
              onFilterApply(values);
              setOpen(false);
            })(e);
          }}
        >
          <ScrollArea className="h-auto">
            <div className="flex max-h-[calc(100vh-22rem)] w-[34rem] flex-col gap-6 p-4 pb-0">
              <div className="flex items-end gap-3">
                <HookedSelect
                  autocomplete
                  id="assignable"
                  label="Project - Course"
                  placeholder="Select a project or course"
                  disabled={isAssignableOptionsLoading}
                  options={assignableOptions ?? []}
                  control={control}
                  containerClassName="grow"
                  error={errors.assignedById?.message}
                />
                <IconWrapper className="pb-9">
                  <icons.XMarkIcon
                    className="h-5 w-5 cursor-pointer text-primary-300 hover:text-complementary-red-600"
                    onClick={() => setValue("assignable", "")}
                  />
                </IconWrapper>
              </div>
              <div className="flex items-end gap-3">
                <HookedSelect
                  autocomplete
                  id="assignedById"
                  label="Assigned By"
                  placeholder="Select an employee"
                  disabled={isLoading}
                  options={employees}
                  control={control}
                  containerClassName="grow"
                  error={errors.assignedById?.message}
                />
                <IconWrapper className="pb-9">
                  <icons.XMarkIcon
                    className="h-5 w-5 cursor-pointer text-primary-300 hover:text-complementary-red-600"
                    onClick={() => setValue("assignedById", null)}
                  />
                </IconWrapper>
              </div>
              <div className="flex items-end gap-3">
                <HookedSelect
                  autocomplete
                  id="employeeId"
                  label="Assignee"
                  placeholder="Select an employee"
                  disabled={isLoading}
                  options={employees}
                  control={control}
                  containerClassName="grow"
                  error={errors.employeeId?.message}
                />
                <IconWrapper className="pb-9">
                  <icons.XMarkIcon
                    className="h-5 w-5 cursor-pointer text-primary-300 hover:text-complementary-red-600"
                    onClick={() => setValue("employeeId", null)}
                  />
                </IconWrapper>
              </div>
              <div className="flex items-end gap-3">
                <HookedSelect
                  id="type"
                  label="Type of assignment"
                  placeholder="Select a type of assignation"
                  options={assignmentTypes}
                  control={control}
                  containerClassName="grow"
                  error={errors.type?.message}
                />
                <IconWrapper className="pb-9">
                  <icons.XMarkIcon
                    className="h-5 w-5 cursor-pointer text-primary-300 hover:text-complementary-red-600"
                    onClick={() => setValue("type", "")}
                  />
                </IconWrapper>
              </div>
              <div className="flex items-end gap-3">
                <div className="flex grow flex-row gap-4">
                  <DatePickerInput
                    id="fromDate"
                    label="From"
                    placeholder="mm/dd/yyyy"
                    {...register("fromDate")}
                    control={control}
                    error={errors.fromDate?.message}
                  />

                  <DatePickerInput
                    id="toDate"
                    label="To"
                    placeholder="mm/dd/yyyy"
                    {...register("toDate")}
                    control={control}
                    error={errors.toDate?.message}
                  />
                </div>

                <IconWrapper className="pb-9">
                  <icons.XMarkIcon
                    className="h-5 w-5 cursor-pointer text-primary-300 hover:text-complementary-red-600"
                    onClick={() => {
                      setValue("fromDate", "");
                      setValue("toDate", "");
                    }}
                  />
                </IconWrapper>
              </div>
              <div className="flex items-end gap-3">
                <HookedSelect
                  id="isNotified"
                  label="Notified"
                  placeholder="Yes / No"
                  options={notifiedOptions}
                  control={control}
                  containerClassName="grow"
                />
                <IconWrapper className="pb-9">
                  <icons.XMarkIcon
                    className="h-5 w-5 cursor-pointer text-primary-300 hover:text-complementary-red-600"
                    onClick={() => setValue("isNotified", "")}
                  />
                </IconWrapper>
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
