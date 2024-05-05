import React, { useEffect, useMemo, useState } from "react";
import {
  ChatBubbleBottomCenterTextIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SubmitHandler, UseFormHandleSubmit } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { tw, validations } from "@lightit/shared";
import { useToastStore } from "@lightit/toast";
import {
  Button,
  Checkbox,
  DropdownMenu,
  HookedSelect,
  icons,
  Input,
  PopupBox,
} from "@lightit/ui";

import {
  createProjectAssignments,
  getAssignmentsTimeOffQuery,
} from "~/api/assignments";
import { getAllEmployeesQuery } from "~/api/employees";
import { OverlappingMessage } from "~/components";
import { CreateNewNote } from "~/components/CreateNewNote";
import { HookedRangeCalendar } from "~/components/RangeCalendar";
import { RATE_TYPE_OPTIONS, ROLE_OPTIONS } from "~/shared.constants";
import {
  errorToast,
  formatFormDate,
  parseFormDate,
  validateTimeOffError,
} from "~/utils";
import type { AssignmentFormValues } from "./NewAssignment";

export const projectAssignmentSchema = z.object({
  projectId: z
    .number({ required_error: "Invalid project id" })
    .nullable()
    .refine((id) => id !== null, { message: "Project is required" }),
  assignments: z
    .array(
      z
        .object({
          notes: z.string(),
          employeeId: z
            .number({ required_error: "Invalid employee id" })
            .nullable()
            .refine((id) => id !== null, { message: "Assignee is required" }),
          role: z.string().min(1, { message: "Role is required" }),
          hours: validations.integer({
            req: true,
            reqMsg: "Hours are required",
          }),
          dateRange: z.object({
            fromDate: validations.date(),
            toDate: validations.date(),
          }),
          rateType: z.string().min(1, { message: "Rate type is required" }),
          hourlyRate: validations.money({ req: false, min: 1 }),
        })
        .refine(
          (data) =>
            parseFormDate(data.dateRange.toDate) >=
            parseFormDate(data.dateRange.fromDate),
          {
            message: "End date cannot be earlier than start",
            path: ["toDate"],
          },
        )
        .refine(
          (data) => {
            return data.rateType === "billable" ? data.hourlyRate.length : true;
          },
          {
            message: "Hourly rate is required",
            path: ["hourlyRate"],
          },
        ),
    )
    .superRefine((assignments, ctx) => {
      const employeeIds = assignments.map(
        (assignment) => assignment.employeeId,
      );

      employeeIds.forEach((id, idx) => {
        if (employeeIds.some((eId, eIdx) => eId === id && eIdx !== idx)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Repeated employee`,
            path: [idx, "employeeId"],
          });
        }
      });
    }),
});

export type ProjectAssignmentFormValues = z.infer<
  typeof projectAssignmentSchema
>;

const rowDefaultValues = {
  employeeId: null,
  notes: "",
  role: "",
  hours: "",
  dateRange: {
    fromDate: "",
    toDate: "",
  },
  rateType: "",
  hourlyRate: "",
};

interface projectOptions {
  id: number;
  value: number;
  label: string;
  startDate: string;
  endDate: string;
}

interface NewProjectAssignmentProps {
  projectId: number | null;
  projects: projectOptions[];
  handleSubmitProjectId: UseFormHandleSubmit<AssignmentFormValues, undefined>;
  onAssignmentCreated: () => void;
}

export const NewProjectAssignment = ({
  projectId,
  projects,
  handleSubmitProjectId,
  onAssignmentCreated,
}: NewProjectAssignmentProps) => {
  const [displayTimeOffWarning, setDisplayTimeOffWarning] = useState(false);

  const { pushToast } = useToastStore();

  const [noteModalAssignmentIndex, setNoteModalAssignmentIndex] = useState<
    number | null
  >(null);

  const [previousNoteValue, setPreviousNoteValue] = useState("");

  const onCreateNoteModalClose = () => {
    setNoteModalAssignmentIndex(null);
  };

  const handleDuplicate = (index: number) => {
    const rowValues = watch().assignments[index];
    rowValues && append(rowValues);
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    watch,
    reset,
    resetField,
    setValue,
    getValues,
  } = useForm<ProjectAssignmentFormValues>({
    resolver: zodResolver(projectAssignmentSchema),
    defaultValues: {
      projectId: projectId,
      assignments: [],
    },
  });

  const queryClient = useQueryClient();
  const {
    mutateAsync: createAssignmentsMutation,
    isLoading,
    isSuccess,
  } = useMutation({
    mutationFn: createProjectAssignments.mutation,
    onSuccess: (_, sentData) => {
      void pushToast({
        type: "success",
        title: "Creation Success",
        message: "Assignments successfully created!",
      });
      createProjectAssignments.invalidates(queryClient, {
        projectId: sentData.projectId,
        employeeIds: sentData.assignments.map(
          (assignment) => assignment.employeeId,
        ),
      });
      onAssignmentCreated();
    },
    onError: errorToast,
  });

  const { fields, append, remove } = useFieldArray({
    name: "assignments",
    control,
  });

  useEffect(() => {
    setValue("projectId", projectId);
  }, [setValue, projectId]);

  useEffect(() => {
    isSuccess && reset();
  }, [reset, isSuccess]);

  const { data: employeesOptions } = useQuery({
    ...getAllEmployeesQuery(),
    onError: errorToast,
    initialData: [],
    select: (data) =>
      data.map((employee) => ({
        value: employee.id,
        label: employee.name,
      })),
  });

  const [timeOffError, setTimeOffError] = useState<
    { employeeName: string; dates: string }[]
  >([]);

  const { mutateAsync: validateAssignmentsTimeOffMutation } = useMutation({
    mutationFn: getAssignmentsTimeOffQuery.mutation,
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

  const onSubmit: SubmitHandler<
    z.infer<typeof projectAssignmentSchema>
  > = async (data) => {
    const assignmentsMap = data.assignments.map((assignment) => ({
      employeeId: assignment.employeeId,
      fromDate: formatFormDate(assignment.dateRange.fromDate),
      toDate: formatFormDate(assignment.dateRange.toDate),
    }));
    try {
      await validateAssignmentsTimeOffMutation(assignmentsMap);
      await createAssignmentsMutation(getValues());
    } catch (error) {
      errorToast(error);
    }
  };

  const selectedProject = useMemo(() => {
    return projects?.find((project) => project.id === projectId);
  }, [projects, projectId]);

  useEffect(() => {
    fields.forEach((_, index) => {
      resetField(`assignments.${index}.dateRange`);
    });
  }, [projectId, fields, resetField]);

  return (
    <form
      onSubmit={(e) => {
        void handleSubmitProjectId(() => ({ elementId: projectId }))(e);
        void handleSubmit(onSubmit)(e);
      }}
      className="flex flex-col gap-6"
    >
      <PopupBox
        show={displayTimeOffWarning}
        boxType="confirm"
        contentType="information"
        title="Overlapping Assignments with Time Off"
        onClose={() => setDisplayTimeOffWarning(false)}
        onConfirm={async () => {
          const formValues = getValues();
          await createAssignmentsMutation(formValues);
        }}
        renderMessage={() => (
          <OverlappingMessage overlappingAssignments={timeOffError} />
        )}
        renderButtonGroup={({ onCancel, onConfirm, initialFocus }) => (
          <div className="mt-2 flex flex-col gap-3 sm:mt-3 sm:flex-row sm:justify-end">
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

      <section
        className={tw(
          "divide-y divide-neutral-200 rounded-2xl border border-neutral-200",
          !fields.length && "border-dashed border-neutral-300",
        )}
      >
        {!fields.length ? (
          <div className="flex flex-col items-center justify-center gap-6 p-10">
            <span className="flex items-center gap-2 text-lg font-medium text-primary-dark-200">
              <icons.UserIcon className="h-6 w-6" />
              There are no assigned employees yet.
            </span>
            <Button
              variant="secondary"
              size="sm"
              right={<icons.PlusIcon />}
              onClick={() => append(rowDefaultValues)}
            >
              Add new assignee
            </Button>
          </div>
        ) : (
          <>
            <h2 className="px-6 py-4 text-lg font-semibold">Employee</h2>

            <div className="flex flex-col gap-6 p-6">
              <div className="overflow-hidden rounded-2xl border border-neutrals-medium-200">
                <table className="w-full table-fixed text-left">
                  <colgroup>
                    <col className="w-[3.9%]" />
                    <col className="w-[13.5%]" />
                    <col className="w-[13.5%]" />
                    <col className="w-[9.3%]" />
                    <col className="w-[13.5%]" />
                    <col className="w-[13.5%]" />
                    <col className="w-[13.5%]" />
                    <col className="w-[13.5%]" />
                    <col className="w-[5.8%]" />
                  </colgroup>
                  <thead className="border-b border-neutrals-medium-200 text-sm text-black">
                    <tr className="bg-neutrals-light-200">
                      <th
                        scope="col"
                        className="flex items-center justify-center p-2 pl-4"
                      >
                        <Checkbox id="select-all" disabled />
                      </th>
                      {[
                        "Employee",
                        "Role",
                        "Hour/Day",
                        "Start date",
                        "End date",
                        "Rate type",
                        "Hourly rate",
                      ].map((header) => (
                        <th
                          scope="col"
                          key={header}
                          className="p-2 font-medium"
                        >
                          {header}
                        </th>
                      ))}
                      <th scope="col" className="p-2 pr-4">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {fields.map((field, index) => (
                      <tr
                        key={field.id}
                        className="align-top even:bg-neutrals-light-200"
                      >
                        <td className="flex justify-center p-2 pl-4 pt-5">
                          <Checkbox
                            id={`select-${index}`}
                            disabled
                            className="mx-auto"
                          />
                        </td>
                        <td className="p-2">
                          <HookedSelect
                            autocomplete
                            id={`assignments.${index}.employeeId`}
                            placeholder={
                              employeesOptions[0]?.label ?? "Loading..."
                            }
                            options={employeesOptions}
                            control={control}
                            disabled={!employeesOptions.length}
                            error={
                              errors.assignments?.[index]?.employeeId?.message
                            }
                          />
                        </td>
                        <td className="p-2">
                          <HookedSelect
                            autocomplete
                            id={`assignments.${index}.role`}
                            placeholder={ROLE_OPTIONS[0].label}
                            options={ROLE_OPTIONS}
                            control={control}
                            error={errors.assignments?.[index]?.role?.message}
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            autoComplete="off"
                            id={`assignments.${index}.hours`}
                            placeholder="6"
                            {...register(`assignments.${index}.hours`)}
                            error={errors.assignments?.[index]?.hours?.message}
                          />
                        </td>
                        <td className="p-2" colSpan={2}>
                          <HookedRangeCalendar
                            control={control}
                            id={`assignments.${index}.dateRange`}
                            error={errors.assignments?.[index]?.dateRange}
                            limitDates={{
                              min: selectedProject?.startDate,
                              max: selectedProject?.endDate,
                            }}
                          />
                        </td>
                        <td className="p-2">
                          <HookedSelect
                            id={`assignments.${index}.rateType`}
                            placeholder={RATE_TYPE_OPTIONS[0].label}
                            options={RATE_TYPE_OPTIONS}
                            control={control}
                            error={
                              errors.assignments?.[index]?.rateType?.message
                            }
                            onValueSelected={() =>
                              setValue(`assignments.${index}.hourlyRate`, "")
                            }
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            disabled={
                              watch(`assignments.${index}.rateType`) ===
                              "non-billable"
                            }
                            id="hourlyRate"
                            left={<span className="text-sm">USD</span>}
                            {...register(`assignments.${index}.hourlyRate`)}
                            error={
                              errors.assignments?.[index]?.hourlyRate?.message
                            }
                            className="pl-12"
                          />
                        </td>
                        <td className="flex justify-center p-2 pr-4 pt-4">
                          <DropdownMenu
                            options={[
                              {
                                label:
                                  getValues(`assignments.${index}.notes`)
                                    .length <= 0
                                    ? "Add note"
                                    : "View note",
                                left: (
                                  <ChatBubbleBottomCenterTextIcon className="h-5 w-5 rounded-none" />
                                ),
                                onClick: () => {
                                  setNoteModalAssignmentIndex(index);
                                  setPreviousNoteValue(
                                    getValues(`assignments.${index}.notes`),
                                  );
                                },
                              },
                              {
                                label: "Duplicate row",
                                left: (
                                  <DocumentDuplicateIcon className="h-5 w-5" />
                                ),
                                onClick: () => handleDuplicate(index),
                              },
                              {
                                label: "Delete row",
                                left: <TrashIcon className="h-5 w-5" />,
                                onClick: () => remove(index),
                              },
                            ]}
                          />
                          <CreateNewNote
                            key={field.id}
                            open={noteModalAssignmentIndex === index}
                            onClose={onCreateNoteModalClose}
                            index={index}
                            register={register}
                            onCancel={() => {
                              onCreateNoteModalClose();
                              setValue(
                                `assignments.${index}.notes`,
                                previousNoteValue,
                              );
                            }}
                            onConfirm={() => {
                              onCreateNoteModalClose();
                            }}
                            defaultValue={getValues(
                              `assignments.${index}.notes`,
                            )}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  right={<icons.PlusIcon />}
                  onClick={() => append(rowDefaultValues)}
                >
                  Add new assignee
                </Button>
              </div>
            </div>
          </>
        )}
      </section>

      {!!fields.length && (
        <div className="flex items-center justify-end gap-4 pt-2">
          <Button variant="outline" onClick={() => reset()} className="w-40">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            Create assignment
          </Button>
        </div>
      )}
    </form>
  );
};
