import React, { useEffect, useState } from "react";
import {
  ChatBubbleBottomCenterTextIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import type { SubmitHandler, UseFormHandleSubmit } from "react-hook-form";
import { z } from "zod";

import { tw, validations } from "@lightit/shared";
import { useToastStore } from "@lightit/toast";
import {
  Button,
  Checkbox,
  DropdownMenu,
  HookedSelect,
  icons,
  PopupBox,
} from "@lightit/ui";

import {
  createCourseAssignments,
  getAssignmentsTimeOffQuery,
} from "~/api/assignments";
import { getAllEmployeesQuery } from "~/api/employees";
import { OverlappingMessage } from "~/components";
import { CreateNewNote } from "~/components/CreateNewNote";
import { HookedRangeCalendar } from "~/components/RangeCalendar";
import {
  errorToast,
  formatFormDate,
  parseFormDate,
  validateTimeOffError,
} from "~/utils";
import { AddGroupCourseAssignment } from "./AddGroupCourseAssignment";
import { AddSingleCourseAssignment } from "./AddSingleCourseAssignment";
import type { AssignmentFormValues } from "./NewAssignment";

export const courseAssignmentSchema = z.object({
  assignableId: z
    .number({ required_error: "Invalid course id" })
    .nullable()
    .refine((id) => id !== null, { message: "Course is required" }),
  assignments: z
    .array(
      z
        .object({
          employeeId: z
            .number({ required_error: "Invalid employee id" })
            .nullable()
            .refine((id) => id !== null, { message: "Assignee is required" }),
          dateRange: z.object({
            fromDate: validations.date(),
            toDate: validations.date(),
          }),
          hours: validations.integer({
            req: true,
            reqMsg: "Hours are required",
          }),
          notes: z.string(),
          role: z.string().nullable(),
          rateType: z.string().nullable(),
          hourlyRate: z.number().nullable(),
        })
        .refine(
          (data) =>
            parseFormDate(data.dateRange.toDate) >=
            parseFormDate(data.dateRange.fromDate),
          {
            message: "End date cannot be earlier than start",
            path: ["toDate"],
          },
        ),
    )
    .superRefine((assignments, ctx) => {
      const assignee = assignments.map((assignment) => assignment.employeeId);

      assignee.forEach((id, idx) => {
        if (assignee.some((eId, eIdx) => eId === id && eIdx !== idx)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Repeated employee`,
            path: [idx, "employeeId"],
          });
        }
      });
    }),
});

export type CourseAssignmentFormValues = z.infer<typeof courseAssignmentSchema>;

const rowDefaultValues = {
  employeeId: null,
  targetArea: "",
  dateRange: {
    fromDate: "",
    toDate: "",
  },
  hours: "",
  notes: "",
  hourlyRate: 0,
  rateType: "non-billable",
  role: "developer",
};

interface NewCourseAssignmentProps {
  courseId: number | null;
  handleSubmitCourseId: UseFormHandleSubmit<AssignmentFormValues, undefined>;
  onAssignmentCreated: () => void;
}

export const NewCourseAssignment = ({
  courseId,
  handleSubmitCourseId,
  onAssignmentCreated,
}: NewCourseAssignmentProps) => {
  const { pushToast } = useToastStore();
  const [displayTimeOffWarning, setDisplayTimeOffWarning] = useState(false);
  const [newAssignmentOpenedModalType, setNewAssignmentOpenedModalType] =
    useState<null | "single" | "group">(null);

  const [noteModalAssignmentIndex, setNoteModalAssignmentIndex] = useState<
    number | null
  >(null);

  const [previousNoteValue, setPreviousNoteValue] = useState("");

  const [timeOffError, setTimeOffError] = useState<
    { employeeName: string; dates: string }[]
  >([]);

  const onCreateNoteModalClose = () => {
    setNoteModalAssignmentIndex(null);
  };

  const onAssignmentModalClose = () => {
    setNewAssignmentOpenedModalType(null);
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
    setValue,
    getValues,
  } = useForm<CourseAssignmentFormValues>({
    resolver: zodResolver(courseAssignmentSchema),
    defaultValues: {
      assignableId: courseId,
      assignments: [],
    },
  });

  const { data: employees } = useQuery({
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

  const queryClient = useQueryClient();
  const {
    mutateAsync: createAssignmentsMutation,
    isLoading,
    isSuccess,
  } = useMutation({
    mutationFn: createCourseAssignments.mutation,
    onSuccess: (_, sentData) => {
      void pushToast({
        type: "success",
        title: "Creation Success",
        message: "Assignments successfully created!",
      });
      createCourseAssignments.invalidates(queryClient, {
        courseId: sentData.assignableId,
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
    setValue("assignableId", courseId);
  }, [setValue, courseId]);

  useEffect(() => {
    isSuccess && reset();
  }, [reset, isSuccess]);

  const hourOptions = [
    { label: "0", value: "0" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
  ];

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

  const onModalConfirm = (ids: string[]) => {
    const employeesToAdd = ids.filter(
      (id) => !fields.some((field) => field.employeeId === parseInt(id)),
    );
    employeesToAdd.forEach((id) =>
      append({ ...rowDefaultValues, employeeId: parseInt(id) }),
    );
    onAssignmentModalClose();
  };

  const onSubmit: SubmitHandler<
    z.infer<typeof courseAssignmentSchema>
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

  return (
    <form
      onSubmit={(e) => {
        void handleSubmitCourseId(() => ({ elementId: courseId }))(e);
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
            <div className="flex justify-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                right={<icons.UserIcon />}
                onClick={() => setNewAssignmentOpenedModalType("single")}
              >
                Add single assignment
              </Button>
            </div>
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
                    <col className="w-[13.5%]" />
                    <col className="w-[13.5%]" />
                    <col className="w-[9.5%]" />
                    <col className="w-[5.5%]" />
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
                        "Target area",
                        "Assignee",
                        "Start date",
                        "End date",
                        "Hours",
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
                        <td className="p-2 align-middle	">
                          <p>Individual Assignment</p>
                        </td>
                        <td className="p-2 align-middle	">
                          <p>
                            {
                              employees.find(
                                (employee) =>
                                  employee.value === field.employeeId,
                              )?.label
                            }
                          </p>
                        </td>
                        <td className="p-2" colSpan={2}>
                          <HookedRangeCalendar
                            control={control}
                            id={`assignments.${index}.dateRange`}
                            error={errors.assignments?.[index]?.dateRange}
                          />
                        </td>
                        <td className="p-2">
                          <HookedSelect
                            autoComplete="off"
                            id={`assignments.${index}.hours`}
                            {...register(`assignments.${index}.hours`)}
                            error={errors.assignments?.[index]?.hours?.message}
                            placeholder="0"
                            options={hourOptions}
                            control={control}
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

              <div className="flex justify-center gap-4">
                <Button
                  variant="secondary"
                  size="sm"
                  right={<icons.UserIcon />}
                  onClick={() => setNewAssignmentOpenedModalType("single")}
                >
                  Add single assignment
                </Button>
              </div>
            </div>
          </>
        )}
      </section>

      <AddSingleCourseAssignment
        open={newAssignmentOpenedModalType === "single"}
        onClose={onAssignmentModalClose}
        onCancel={() => {
          onAssignmentModalClose();
        }}
        onConfirm={onModalConfirm}
      />
      <AddGroupCourseAssignment
        open={newAssignmentOpenedModalType === "group"}
        onClose={onAssignmentModalClose}
        onCancel={() => {
          onAssignmentModalClose();
        }}
        onConfirm={onAssignmentModalClose}
      />

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
