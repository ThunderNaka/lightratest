import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

import { validations } from "@lightit/shared";
import { useToastStore } from "@lightit/toast";
import {
  Button,
  HookedSelect,
  icons,
  Input,
  Label,
  PopupBox,
  ScrollArea,
  TextArea,
  Typography,
} from "@lightit/ui";

import {
  createAssignment,
  getAssignmentsTimeOffQuery,
} from "~/api/assignments";
import { getCoursesQuery } from "~/api/courses";
import { getEmployeesQuery } from "~/api/employees";
import { getProjectsQuery } from "~/api/projects";
import { OverlappingMessage } from "~/components";
import { ExceedingHoursMessage } from "~/components/ExceedingHoursMessage";
import { HookedRangeCalendar } from "~/components/RangeCalendar";
import { PERMISSIONS, usePermissions } from "~/hooks";
import {
  ASSIGNMENT_TYPE,
  ASSIGNMENT_TYPE_OPTIONS,
  RATE_TYPE_OPTIONS,
  ROLE_OPTIONS,
} from "~/shared.constants";
import type { RateType, Role } from "~/shared.types";
import {
  errorToast,
  formatFormDate,
  handleAxiosFieldErrors,
  searchParamToNumber,
  validateExceedingHoursError,
  validateTimeOffError,
} from "~/utils";

const baseAssignmentSchema = z.object({
  employeeId: z.number({ required_error: "Employee is required" }),
  dateRange: z.object({
    fromDate: validations.date(),
    toDate: validations.date(),
  }),
  hours: validations.integer({
    req: true,
    reqMsg: "Hours are required",
  }),
  isNotified: z.boolean().optional(),
  notes: z.string(),
  assignableId: z.number({ required_error: "Assignable is required" }),
});

const projectAssignmentSchema = z.object({
  type: z.literal("project"),
  role: z
    .string()
    .min(1, { message: "Role is required" })
    .refine(
      (role) =>
        ROLE_OPTIONS.map((option) => option.value).includes(role as Role),
      { message: "Invalid role" },
    ),
  hourlyRate: validations.number({
    req: true,
    reqMsg: "Rate is required",
  }),
  rateType: z
    .string()
    .min(1, { message: "Rate type is required" })
    .refine(
      (rateType) =>
        RATE_TYPE_OPTIONS.map((option) => option.value).includes(
          rateType as RateType,
        ),
      { message: "Invalid role" },
    ),
});

const courseAssignmentSchema = z.object({
  type: z.literal("course"),
});

const assignmentSchema = z.intersection(
  baseAssignmentSchema,
  z.discriminatedUnion("type", [
    projectAssignmentSchema,
    courseAssignmentSchema,
  ]),
);

export type AssignmentFormValues = z.infer<typeof assignmentSchema>;

export const NewAssignmentForm = ({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) => {
  const { hasPermission } = usePermissions();
  const pushToast = useToastStore((state) => state.pushToast);

  const [displayTimeOffWarning, setDisplayTimeOffWarning] = useState(false);
  const [timeOffError, setTimeOffError] = useState<
    { employeeName: string; dates: string }[]
  >([]);
  const [searchParams] = useSearchParams();

  const [exceedingHoursError, setExceedingHoursError] = useState<
    {
      assignableName: string;
      assignedFrom: string;
      assignedTo: string;
      assignedHours: number;
    }[]
  >([]);

  const [displayExceedingHoursError, setDisplayExceedingHoursError] =
    useState(false);

  const employeeId = searchParamToNumber(searchParams.get("employeeId"));
  const projectId = searchParamToNumber(searchParams.get("projectId"));

  const assignableId = searchParamToNumber(searchParams.get("assignableId"));
  const assignmentType =
    ASSIGNMENT_TYPE_OPTIONS.map((assignment) => assignment.value).find(
      (e) => e === searchParams.get("type"),
    ) ?? "project";

  const isProject = assignmentType === ASSIGNMENT_TYPE.PROJECT;

  const isCourse = assignmentType === ASSIGNMENT_TYPE.COURSE;

  const canCreateAssignment =
    hasPermission(PERMISSIONS.createTeamAssignment) ||
    hasPermission(PERMISSIONS.createInternalTeamAssignment);

  const filterNonBillableProjects =
    !hasPermission(PERMISSIONS.createTeamAssignment) &&
    hasPermission(PERMISSIONS.createInternalTeamAssignment);

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    ...getProjectsQuery(
      filterNonBillableProjects ? { filter: { type: "internal" } } : undefined,
    ),
    enabled: canCreateAssignment,
    onError: errorToast,
  });

  const { data: courses } = useQuery({
    ...getCoursesQuery({}),
    onError: errorToast,
  });

  const { data: employees, isLoading: isLoadingEmployees } = useQuery({
    ...getEmployeesQuery(),
    onError: errorToast,
  });

  const activeProjects = projects?.filter((e) => e.status === "active");

  const projectOptions =
    activeProjects?.map((e) => ({
      value: e.id,
      label: e.name,
      status: e.status,
    })) ?? [];
  const courseOptions =
    courses?.data.map((e) => ({ value: e.id, label: e.name })) ?? [];
  const employeeOptions =
    employees?.map((employee) => ({
      value: employee.id,
      label: employee.name,
      avatarUrl: employee.avatarUrl,
    })) ?? [];

  const course = courseOptions.find((course) => assignableId === course.value);

  const readOnlyEmployee = employees?.find(
    (employee) => employee.id === employeeId,
  );
  const readOnlyProject = projects?.find(
    (project) => project.id === assignableId,
  );

  const {
    formState: { errors },
    register,
    handleSubmit,
    control,
    watch,
    resetField,
    getValues,
    setError,
  } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      type: assignmentType,
      ...(employeeId && { employeeId }),
      ...(isProject && projectId
        ? { assignableId: projectId, rateType: readOnlyProject?.type }
        : assignableId && { assignableId, rateType: readOnlyProject?.type }),
      ...(isCourse && assignableId && { assignableId }),
    },
  });

  const assignableIdForm = watch("assignableId");

  const selectedProject = useMemo(() => {
    return projects?.find((project) => project.id === assignableIdForm);
  }, [assignableIdForm, projects]);

  const queryClient = useQueryClient();
  const { mutate: createAssignmentMutation, isLoading } = useMutation({
    mutationFn: createAssignment.mutation,
    onSuccess: (_, sentData) => {
      createAssignment.invalidates(queryClient, {
        employeeId: sentData.employeeId,
      });

      void pushToast({
        type: "success",
        title: "Assignment Success",
        message: "Hours successfully assigned!",
      });
      onSuccess();
    },
    onError: (err) => {
      const validatedError = validateExceedingHoursError(err);
      if (
        validatedError &&
        validatedError.response.data.error.code == "exceeding_hours_error"
      ) {
        const clashingAssignments =
          validatedError.response.data.error.data.assignments;

        if (clashingAssignments) {
          setExceedingHoursError(
            clashingAssignments.map((assignment) => ({
              assignableName: assignment.assignable?.name ?? "",
              assignedFrom: assignment.fromDate,
              assignedTo: assignment.toDate,
              assignedHours: assignment.hours,
            })),
          );
          setDisplayExceedingHoursError(true);
        }
      } else {
        errorToast(err);
        handleAxiosFieldErrors(err, setError, true);
      }
    },
  });

  const { mutate: getAssignmentsTimeOffMutation, isLoading: isLoadingTimeOff } =
    useMutation({
      mutationFn: getAssignmentsTimeOffQuery.mutation,
      onSuccess: () => {
        const values = {
          ...getValues(),
          fromDate: getValues("dateRange.fromDate"),
          toDate: getValues("dateRange.toDate"),
        };
        createAssignmentMutation(values);
      },
      onError: (error) => {
        const validatedError = validateTimeOffError(error);

        if (
          validatedError &&
          validatedError.response.data.error.code == "validation_failed"
        ) {
          const employeesTimeOff = Object.entries(
            validatedError.response.data.error.fields,
          );
          if (employeesTimeOff) {
            setTimeOffError(
              employeesTimeOff.map((error) => {
                const employeeTimeOff = error[1][0]!;
                const parsedEmployee = JSON.parse(employeeTimeOff) as {
                  employee: string;
                  dates: string;
                };
                return {
                  employeeName: parsedEmployee.employee,
                  dates: parsedEmployee.dates,
                };
              }),
            );
          }
          setDisplayTimeOffWarning(true);
        } else {
          errorToast(error);
        }
      },
    });

  return (
    <form
      className="flex grow flex-col"
      onSubmit={handleSubmit((values) => {
        values.employeeId &&
          getAssignmentsTimeOffMutation([
            {
              employeeId: values.employeeId,
              fromDate: formatFormDate(values.dateRange.fromDate),
              toDate: formatFormDate(values.dateRange.toDate),
            },
          ]);
      })}
    >
      <header className="flex justify-between border-b border-neutrals-medium-300 p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-neutrals-dark-900">
            {`Add new ${assignmentType} assignment`}
          </h2>
          {employeeId && (
            <p className="neutrals-dark-400 h-5 text-sm">
              {readOnlyEmployee &&
                `Add new assignment to ${readOnlyEmployee.name}`}
            </p>
          )}
        </div>
        <icons.XMarkIcon className="h-6 w-6 shrink-0" onClick={onCancel} />
      </header>

      <ScrollArea>
        <div className="flex grow flex-col gap-6 p-6">
          {isCourse && (
            <div className="flex flex-col gap-3">
              <Label label="Course name" className="text-gray-400" />
              <Typography>{course?.label}</Typography>
            </div>
          )}

          {employeeId === null && (
            <HookedSelect
              id="employeeId"
              label="Employee"
              placeholder={
                employeeOptions[0]?.label ??
                (isLoadingEmployees ? "Loading..." : "Select employee")
              }
              options={employeeOptions}
              control={control}
              error={errors.employeeId?.message}
              disabled={isLoadingEmployees}
              autocomplete
            />
          )}

          {isProject && (
            <HookedSelect
              readOnly={assignableId !== null}
              id="assignableId"
              label="Project name"
              onValueSelected={() => resetField("dateRange")}
              placeholder={
                projectId
                  ? projectOptions.filter(
                      (project) => project.value === projectId,
                    )[0]?.label
                  : projectOptions[0]?.label ??
                    (isLoadingProjects ? "Loading..." : "Select project")
              }
              options={projectOptions}
              control={control}
              error={"assignableId" in errors && errors.assignableId?.message}
              disabled={isLoadingProjects || !!projectId}
              autocomplete
            />
          )}

          <HookedRangeCalendar
            showLabels={true}
            control={control}
            id="dateRange"
            error={errors.dateRange}
            limitDates={{
              min: selectedProject?.startDate,
              max: selectedProject?.endDate,
            }}
          />

          {isProject && (
            <HookedSelect
              id="rateType"
              label="Rate Type"
              placeholder={RATE_TYPE_OPTIONS[0].label}
              options={RATE_TYPE_OPTIONS}
              control={control}
              error={"rateType" in errors && errors.rateType?.message}
            />
          )}

          <div className="flex flex-row items-start justify-between space-x-3">
            <div className="w-full">
              <Input
                id="hours"
                label="Hours per Day"
                placeholder="6 Hours"
                type="number"
                min={0}
                right={
                  <icons.ClockIcon className="m-auto h-5 w-5 text-primary-white-600" />
                }
                {...register("hours")}
                error={errors.hours?.message}
              />
            </div>
            {isProject && (
              <div className="w-full">
                <Input
                  id="rate"
                  label="Hourly Rate"
                  placeholder="25"
                  type="number"
                  step={"0.1"}
                  min={0}
                  left={
                    <span className="m-auto text-sm text-primary-white-600">
                      $
                    </span>
                  }
                  {...register("hourlyRate")}
                  error={"hourlyRate" in errors && errors.hourlyRate?.message}
                />
              </div>
            )}
          </div>

          {isProject && (
            <HookedSelect
              id="role"
              label="Employee Role"
              placeholder={ROLE_OPTIONS[0].label}
              options={ROLE_OPTIONS}
              control={control}
              error={"role" in errors && errors.role?.message}
            />
          )}

          <TextArea
            id="notes"
            label="Note"
            placeholder="Add notes"
            {...register("notes")}
            error={errors.notes?.message}
          />
        </div>
      </ScrollArea>

      <div className="flex items-center justify-end p-6">
        <Button
          type="submit"
          size="sm"
          disabled={isLoading || isLoadingTimeOff}
        >
          Create Assignment
        </Button>
      </div>

      <PopupBox
        show={displayTimeOffWarning}
        boxType="confirm"
        contentType="information"
        title={`Overlapping Assignment with Time Off from ${getValues(
          "dateRange.fromDate",
        )} to ${getValues("dateRange.toDate")}`}
        onClose={() => setDisplayTimeOffWarning(false)}
        onConfirm={() => {
          createAssignmentMutation(getValues());
        }}
        renderMessage={() => (
          <OverlappingMessage overlappingAssignments={timeOffError} />
        )}
        renderButtonGroup={({ onCancel, onConfirm, initialFocus }) => (
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end sm:pt-3">
            <Button
              size="sm"
              onClick={onCancel}
              variant="tertiary-link"
              className="w-full justify-center sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onConfirm();
              }}
              className="w-full justify-center sm:w-auto"
              ref={initialFocus}
            >
              Continue
            </Button>
          </div>
        )}
      />
      <PopupBox
        show={displayExceedingHoursError}
        boxType="alert"
        contentType="error"
        title="Exceeding hours in assignment"
        onClose={() => setDisplayExceedingHoursError(false)}
        renderMessage={() => (
          <ExceedingHoursMessage overlappingAssignments={exceedingHoursError} />
        )}
      />
    </form>
  );
};
