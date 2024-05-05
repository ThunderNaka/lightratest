/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Button, icons, Modal, Select } from "@lightit/ui";

import { getAllEmployeesQuery } from "~/api/employees";
import { errorToast } from "~/utils";

interface AddSingleCourseAssignmentProps {
  open: boolean;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: (value: string[]) => void;
}

export const AddSingleCourseAssignment = ({
  open,
  onClose,
  onCancel,
  onConfirm,
}: AddSingleCourseAssignmentProps) => {
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

  const [ids, setIds] = useState<string[]>([]);

  const handleSelect = (value: string[]) => {
    onConfirm(value);
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="flex flex-col gap-6 rounded-xl bg-white p-7">
        <div className="flex flex-col">
          <button onClick={onCancel} className="h-5 w-5 self-end text-gray-500">
            <icons.XMarkIcon />
          </button>
          <h1 className="text-xl font-bold">New individual assignment</h1>
          <p>Choose the employee(s) for the assignment.</p>
        </div>

        <Select
          autocomplete
          multiple
          id="assignments"
          label="Employee"
          placeholder="Select an employee"
          disabled={isLoading}
          options={employees}
          value={ids}
          onChange={(value: any) => {
            setIds(value);
          }}
          containerClassName="grow"
        />

        <div className="flex justify-center gap-5">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>

          <Button onClick={() => handleSelect(ids)}>Save</Button>
        </div>
      </div>
    </Modal>
  );
};
