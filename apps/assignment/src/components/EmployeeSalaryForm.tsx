import React, { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToastStore } from "@lightit/toast";
import {
  Button,
  HookedSelect,
  icons,
  Input,
  TextArea,
  Tooltip,
} from "@lightit/ui";

import { createSalary } from "~/api/employees";
import type { Employee } from "~/api/employees";
import { Empty } from "~/assets";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { errorToast, formatBackendDate, handleAxiosFieldErrors } from "~/utils";

export const employeeSalarySchema = z.object({
  employeeId: z.number(),
  amount: z.string().min(1, { message: "Amount is required" }),
  currency: z.string().min(1, { message: "Currency is required" }),
  comments: z.string(),
});

export type EmployeeNewSalaryFormValues = z.infer<typeof employeeSalarySchema>;

interface EmployeeSalaryFormProps {
  employee: Employee;
}

export const EmployeeSalaryForm = ({ employee }: EmployeeSalaryFormProps) => {
  const pushToast = useToastStore((state) => state.pushToast);

  const [editMode, setEditMode] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors },
  } = useForm<EmployeeNewSalaryFormValues>({
    resolver: zodResolver(employeeSalarySchema),
    defaultValues: {
      employeeId: employee.id,
      amount: "",
      currency: "USD",
      comments: "",
    },
  });

  const { mutate: createSalaryMutation } = useMutation({
    mutationFn: createSalary.mutation,
    onSuccess: () => {
      void pushToast({
        type: "success",
        title: "Creation Success",
        message: "Salary successfully created!",
      });
      setEditMode(false);
      createSalary.invalidates(queryClient, { employeeId: employee.id });
      reset();
    },
    onError: (err) => {
      errorToast(err);
      handleAxiosFieldErrors(err, setError);
    },
  });

  const { hasPermission } = usePermissions();

  return (
    <div className="flex flex-1 flex-col">
      {editMode && (
        <form
          className="flex flex-col gap-6 p-4"
          onSubmit={(e) =>
            void handleSubmit((values) => createSalaryMutation(values))(e)
          }
        >
          <Input
            id="amount"
            label="Monthly Salary"
            placeholder="$550"
            {...register("amount")}
            className="focus:border-gray-300 focus:ring-0"
            error={errors.amount?.message}
          />
          <HookedSelect
            id="currency"
            label="Currency"
            options={[
              { value: "USD", label: "USD" },
              { value: "UYU", label: "UYU" },
            ]}
            className="focus:border-gray-300 focus:ring-0"
            error={errors.currency?.message}
            control={control}
          />
          <TextArea
            id="comments"
            label="Comments"
            placeholder="This is a salary comment..."
            {...register("comments")}
            className="focus:border-gray-300 focus:ring-0"
            error={errors.comments?.message}
          />
          <div className="flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              className="mr-2"
              onClick={() => {
                setEditMode(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      )}
      {!editMode && (
        <>
          <div className="flex h-12 flex-row items-center justify-between align-middle">
            <span className="text-normal m-0 mr-3 font-semibold leading-6 text-neutrals-dark-500">
              Salary
            </span>
            {hasPermission(PERMISSIONS.createSalaryEmployee) && (
              <Button
                variant="secondary"
                size="sm"
                className="h-8 focus:ring-0"
                onClick={() => setEditMode(true)}
                left={<icons.PlusIcon />}
              >
                New Salary
              </Button>
            )}
          </div>
          {employee.salaries?.length ? (
            <table className="mt-4 w-full">
              {/* <thead className="border-y border-neutrals-light-200 text-left text-sm text-primary-white-700">
                <tr>
                  <th className="py-4 pl-2 font-medium">Date</th>
                  <th className="flex justify-end py-4 font-medium">Salary</th>
                </tr>
              </thead> */}
              <tbody className="text-primary-white-70 text-sm">
                {employee.salaries?.map((salary, index) => (
                  <tr key={index}>
                    <td className="py-4 pl-2">
                      {formatBackendDate(salary.startDate)}
                    </td>
                    <td className="flex items-center justify-end gap-2 py-4">
                      {salary.comments && (
                        <Tooltip content={salary.comments}>
                          <InformationCircleIcon className="h-6 w-6" />
                        </Tooltip>
                      )}
                      {salary.salary.currency} {salary.salaryAsDecimal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 p-6">
              <img
                src={Empty}
                alt="There's no info to show"
                className="aspect-square h-40"
              />
              <span className="text-lg text-gray-500">
                {"There's no salary info to show"}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
