import React from "react";
import { useQuery } from "@tanstack/react-query";
import { generatePath, useParams } from "react-router-dom";

import { tw } from "@lightit/shared";
import { CircularAvatar, Loading, Typography } from "@lightit/ui";

import { getEmployeeQuery } from "~/api/employees";
import { Breadcrumbs, EmployeeInfo, EmployeeSalaryForm } from "~/components";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { ROUTES } from "~/router";
import { errorToast } from "~/utils";
import { EmployeeHoursForm } from "./EmployeeHoursForm";
import { EmployeeHoursGraph } from "./EmployeeHoursGraph";

const cardStyle =
  "flex flex-1 flex-col rounded-2xl border border-gray-300 bg-primary-white-300 p-4";

export const EmployeeOverview = () => {
  const { hasPermission } = usePermissions();
  const params = useParams();
  const employeeId = params.employeeId ? parseInt(params.employeeId) : null;

  const { data: employee } = useQuery({
    ...getEmployeeQuery(employeeId),
    onError: errorToast,
  });

  if (!employee) {
    return (
      <div className="relative h-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-y-auto p-8">
      <Breadcrumbs
        pages={[
          {
            name: "Employees",
            href: ROUTES.employees,
          },
          {
            name: employee.name,
            href: generatePath("/employees/:id", {
              id: employee.id.toString(),
            }),
          },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 px-4">
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-300 bg-primary-white-300 px-6 py-4">
            <CircularAvatar
              size="2xl"
              image={employee.avatarUrl}
              name={employee.name}
              className="mr-2 justify-self-start"
              defaultToIcon={employee.avatarUrl ? true : false}
            />
            <Typography font="semiBold" className="text-3xl">
              {employee.name}
            </Typography>
            <EmployeeInfo employee={employee} />
          </div>
          <div className={cardStyle}>
            <EmployeeHoursForm employee={employee} />
          </div>
          <div className={tw(cardStyle, "py-2")}>
            <EmployeeSalaryForm employee={employee} />
          </div>
        </div>
        {hasPermission(PERMISSIONS.viewTeamAssignment) && (
          <div className={cardStyle}>
            <EmployeeHoursGraph employee={employee} />
          </div>
        )}
      </div>
    </div>
  );
};
