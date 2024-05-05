import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { SideModal, Tabs } from "@lightit/ui";

import { getEmployeeQuery } from "~/api/employees";
import { EmployeeInfo, EmployeeSalaryForm, ModalHeader } from "~/components";
import { errorToast } from "~/utils";

const tabs = ["Information", "Salary"] as const;
type Tab = (typeof tabs)[number];

interface EmployeeFormProps {
  show: boolean;
  onClose: () => void;
}

/**
 * @deprecated EmployeeModal has been replaced with the EmployeeOverview screen
 */
export const EmployeeModal = ({ show, onClose }: EmployeeFormProps) => {
  const [tab, setTab] = useState<Tab>(tabs[0]);

  const params = useParams<{ employeeId: string }>();
  const employeeId = params.employeeId ? parseInt(params.employeeId) : null;

  const { data: employee } = useQuery({
    ...getEmployeeQuery(employeeId),
    onError: errorToast,
  });

  return (
    <SideModal show={show} onClose={onClose} className="w-[35rem]">
      <ModalHeader
        avatarUrl={employee?.avatarUrl ?? ""}
        title={employee?.name ?? ""}
        className="p-8"
        allowCopy
      />

      <Tabs
        tabs={tabs}
        className="border-y border-stone-300 px-8"
        value={tab}
        onChange={setTab}
      />

      <div className="h-px w-full bg-primary-dark-100" />

      {tab === "Information" && employee && (
        <EmployeeInfo employee={employee} />
      )}

      {tab === "Salary" && employee && (
        <EmployeeSalaryForm employee={employee} />
      )}
    </SideModal>
  );
};
