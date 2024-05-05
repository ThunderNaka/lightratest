import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isBefore, isWeekend } from "date-fns";
import { capitalize } from "lodash";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { validations } from "@lightit/shared";
import { useToastStore } from "@lightit/toast";
import {
  Button,
  CircularAvatar,
  DatePickerInput,
  HookedSelect,
  icons,
  Input,
  Label,
  PopupBox,
  ScreenLoading,
  ScrollArea,
  TextArea,
  Typography,
} from "@lightit/ui";

import type { AssignmentDetails as AssignmentDetailsType } from "~/api/assignments";
import { deleteAssignment, editAssignment } from "~/api/assignments";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { ROUTES } from "~/router";
import { RATE_TYPE, RATE_TYPE_OPTIONS } from "~/shared.constants";
import {
  errorToast,
  formatBackendDate,
  getEnumValues,
  handleAxiosFieldErrors,
  parseFormDate,
} from "~/utils";

const editAssignmentSchema = z
  .object({
    fromDate: validations.date(),
    hourlyRate: validations.money({ req: false, min: 0 }),
    hours: validations.integer({
      req: true,
      reqMsg: "Hours are required",
    }),
    notes: z.string(),
    rateType: z.enum(getEnumValues(RATE_TYPE)),
    toDate: validations.date(),
  })
  .refine(
    (data) => parseFormDate(data.toDate) >= parseFormDate(data.fromDate),
    {
      message: "End date cannot be earlier than start",
      path: ["toDate"],
    },
  )
  .refine(
    (data) => {
      return !isWeekend(parseFormDate(data.toDate));
    },
    {
      message: "End date cannot fall on weekends",
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
  );
export type EditAssignmentFormValues = z.infer<typeof editAssignmentSchema>;

export const AssignmentDetails = ({
  assignment,
  onDelete,
  onCancel,
}: {
  assignment: AssignmentDetailsType;
  onDelete: () => void;
  onCancel: () => void;
}) => {
  const { pushToast } = useToastStore();
  const { hasPermission } = usePermissions();

  const [isEditable, setIsEditable] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
  } = useForm<EditAssignmentFormValues>({
    resolver: zodResolver(editAssignmentSchema),
    defaultValues: {
      fromDate: formatBackendDate(assignment.fromDate),
      hours: `${assignment.hours}` ?? "0",
      hourlyRate: `${assignment.hourlyRate}` ?? "0",
      notes: assignment.notes ?? "",
      rateType: assignment.rateType ?? "",
      toDate: formatBackendDate(assignment.toDate),
    },
  });

  const queryClient = useQueryClient();
  const { mutate: editAssignmentMutation, isLoading } = useMutation({
    mutationFn: editAssignment.mutation,
    onSuccess: (updatedAssignment) => {
      setIsEditable(false);

      reset({
        fromDate: formatBackendDate(updatedAssignment.fromDate),
        hours: `${updatedAssignment.hours}`,
        hourlyRate: `${updatedAssignment.hourlyRate}`,
        toDate: formatBackendDate(updatedAssignment.toDate),
        rateType: updatedAssignment.rateType,
        notes: updatedAssignment.notes,
      });

      editAssignment.invalidates(queryClient, {
        id: +(updatedAssignment.id ?? -1),
        employeeId: +updatedAssignment.employeeId,
      });

      void pushToast({
        type: "success",
        title: "Update Complete",
        message: "Assignment successfully updated",
      });
    },
    onError: (err) => {
      errorToast(err), handleAxiosFieldErrors(err, setError);
    },
  });

  const { mutate: deleteAssignmentMutation, isLoading: isDeleteLoading } =
    useMutation({
      mutationFn: deleteAssignment.mutation,
      onSuccess: (_, id) => {
        onDelete();
        deleteAssignment.invalidates(queryClient, {
          assignmentId: id,
          employeeId: assignment.employeeId,
          ...(assignment.type === "project" && {
            projectId: assignment.assignableId,
          }),
          ...(assignment.type === "course" && {
            courseId: assignment.assignableId,
          }),
        });
        void pushToast({
          type: "success",
          title: "Deletion Complete",
          message: "Assignment successfully deleted",
        });
      },
      onError: errorToast,
    });

  const isTimeOff = assignment.type === "timeOff";

  const hasStarted = isBefore(new Date(), parseFormDate(assignment.fromDate));

  if (isDeleteLoading) return <ScreenLoading />;
  return (
    <form
      className="flex grow flex-col"
      onSubmit={handleSubmit((values) => {
        const newValues = {
          ...values,
          hours: +values.hours,
        };

        editAssignmentMutation({
          ...assignment,
          ...newValues,
        });
      })}
    >
      <header className="flex items-center justify-between border-b border-neutrals-medium-300 p-6">
        <h2 className="text-xl font-bold text-neutrals-dark-900">
          {isTimeOff
            ? (assignment.assignable?.type === "sick" && "Sick day") ||
              ((assignment.assignable?.type === "vacation" ||
                assignment.assignable?.type === "unpaid-vacation") &&
                "Holidays") ||
              (assignment.assignable?.type === "study-days" && "Study days")
            : "Assignment details"}
        </h2>
        <icons.XMarkIcon className="h-6 w-6 shrink-0" onClick={onCancel} />
      </header>

      <ScrollArea>
        <div className="flex grow flex-col gap-3 p-6">
          <div className="flex items-center gap-3 text-left">
            <CircularAvatar size="md" image={assignment.employee.avatarUrl} />
            <div className="flex min-w-0 flex-col gap-1">
              <Link to={`${ROUTES.employees}/${assignment.employee.id}`}>
                <h4 className="cursor-pointer truncate font-semibold text-neutrals-dark-900 hover:underline">
                  {assignment.employee.name}
                </h4>
              </Link>
              <p className="truncate text-xs font-medium text-neutrals-dark-300">
                {assignment.employee.jobTitle}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="name"
              label={isTimeOff ? "" : `${capitalize(assignment.type)} name`}
              className="text-neutrals-dark-300"
            />

            {assignment.type === "project" && (
              <Link
                to={`${ROUTES.projects.base}/${assignment.assignable?.id}`}
                id="name"
                className="py-3 text-sm font-medium text-complementary-blue-500 underline underline-offset-2"
              >
                {assignment.assignable?.name ?? "-"}
              </Link>
            )}

            {assignment.type === "course" && (
              <Link
                to={ROUTES.learningCenter.coursesList}
                id="name"
                className="py-3"
              >
                {assignment.assignable?.name ?? "-"}
              </Link>
            )}
          </div>

          {assignment.type === "project" && (
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="hourlyRate"
                label="Hourly rate (USD/h)"
                className="text-neutrals-dark-300"
              />
              <Input
                autoComplete="off"
                id="hourlyRate"
                readOnly={!isEditable && !hasStarted}
                placeholder="6"
                {...register(`hourlyRate`)}
                error={errors.hourlyRate?.message}
              />
            </div>
          )}

          {!isTimeOff && (
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="hours"
                label="Assignment hours"
                className="text-neutrals-dark-300"
              />
              <Input
                autoComplete="off"
                id="hours"
                min={0}
                type="number"
                readOnly={!isEditable && !hasStarted}
                placeholder="6"
                {...register(`hours`)}
                error={errors.hours?.message}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="employeeHours"
              label={
                isTimeOff ? "Total amount of hours" : "Total working hours"
              }
              className="text-neutrals-dark-300"
            />
            <Typography id="employeeHours" variant="small" className="py-3">
              {assignment.employee && `${assignment.employee.hours} hs`}
            </Typography>
          </div>

          {!isTimeOff && (
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="rateType"
                label="Rate Type"
                className="text-neutrals-dark-300"
              />
              <HookedSelect
                id="rateType"
                placeholder={RATE_TYPE_OPTIONS[0].label}
                options={RATE_TYPE_OPTIONS}
                control={control}
                error={errors.rateType?.message}
                onValueSelected={() => setValue(`hourlyRate`, "0")}
                readOnly={!isEditable && !hasStarted}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="fromDate"
              label="Start date"
              className="text-neutrals-dark-300"
            />
            <Typography id="fromDate" variant="small" className="py-3">
              {formatBackendDate(assignment.fromDate)}
            </Typography>
          </div>

          <DatePickerInput
            id="toDate"
            label="End Date"
            placeholder="--/--/--"
            control={control}
            left={
              !isEditable ? null : (
                <icons.CalendarIcon className=" h-5 w-5 text-primary-white-600" />
              )
            }
            readOnly={!isEditable}
            {...register("toDate")}
            error={errors.toDate?.message}
          />

          <TextArea
            id="notes"
            label="Note"
            placeholder="Add notes"
            readOnlyPlaceholder="This assignment doesn't have a note yet"
            readOnly={!isEditable}
            {...register("notes")}
            error={errors.notes?.message}
          />
        </div>
      </ScrollArea>

      {!isTimeOff && hasPermission(PERMISSIONS.updateTeamAssignment) && (
        <div className="flex items-center justify-end gap-4 p-6">
          {!isEditable && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConfirmDelete(true)}
                className="border-complementary-red-500 text-complementary-red-500 hover:border-complementary-red-500 hover:bg-complementary-red-50 hover:text-complementary-red-500 focus:ring-complementary-red-50"
              >
                Delete assignment
              </Button>
              <Button
                size="sm"
                type="button"
                onClick={() => setIsEditable(true)}
              >
                Edit assignment
              </Button>
            </>
          )}
          {isEditable && (
            <>
              <Button
                variant="tertiary-link"
                size="sm"
                onClick={() => {
                  setIsEditable(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isLoading || !isDirty}>
                Save changes
              </Button>
            </>
          )}
        </div>
      )}

      <PopupBox
        show={confirmDelete}
        boxType="confirm"
        contentType="warningRed"
        title="Deleting the project"
        message="Are you sure you want to delete the assignment?"
        onClose={() => {
          setConfirmDelete(false);
        }}
        onConfirm={() => {
          deleteAssignmentMutation(assignment.id);
        }}
        renderButtonGroup={({ onCancel, onConfirm, initialFocus }) => (
          <div className="mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:justify-end">
            <Button
              size="sm"
              onClick={onConfirm}
              variant="tertiary-link"
              className="w-full justify-center sm:w-auto"
            >
              Delete assignment
            </Button>
            <Button
              size="sm"
              onClick={onCancel}
              className="w-full justify-center sm:w-auto"
              ref={initialFocus}
            >
              Cancel
            </Button>
          </div>
        )}
      />
    </form>
  );
};
