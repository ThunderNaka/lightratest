import React from "react";

import { useToastStore } from "@lightit/toast";
import { Chip, icons } from "@lightit/ui";

import type { Employee } from "~/api/employees";
import { formatBackendDate } from "~/utils";
import { copyToClipboard } from "~/utils/utils";

interface EmployeeInfoFormProps {
  employee: Employee;
}

export const EmployeeInfo = ({ employee }: EmployeeInfoFormProps) => {
  const pushToast = useToastStore((state) => state.pushToast);

  return (
    <div className="flex flex-col gap-2">
      <div className="group flex gap-2">
        <span className="font-semibold">Email:</span>
        <button
          className="cursor-pointer"
          onClick={() => {
            copyToClipboard(employee.email);
            void pushToast({
              type: "success",
              title: "Copy Success",
              message: `"${employee.email}" copied to clipboard`,
            });
          }}
        >
          {employee.email}
        </button>
        <icons.ClipboardDocumentIcon className="w-4 text-gray-500 opacity-0 group-hover:opacity-100" />
      </div>
      <div className="flex gap-2">
        <span className="font-semibold">Current Position:</span>
        <div>{employee.jobTitle}</div>
      </div>
      <div className="flex gap-2">
        <span className="font-semibold">Hire Date:</span>
        <div>{formatBackendDate(employee.hireDate)}</div>
      </div>
      {!!employee.teams?.length && (
        <>
          <span className="font-semibold">Current Teams:</span>
          <div className="flex w-full flex-wrap items-center justify-start gap-3 pb-4">
            {employee.teams?.map((team) => (
              <Chip key={team.id} className="bg-gray-500 text-white">
                {team.name}
              </Chip>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
