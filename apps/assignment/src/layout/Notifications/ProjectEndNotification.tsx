import React from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";

import { tw } from "@lightit/shared";
import { CircularAvatar, Typography } from "@lightit/ui";

import type { Notification } from "~/api/notifications";
import { ROUTES } from "~/router";

interface ProjectEndNotificationProps {
  notification: Notification;
}
export const ProjectEndNotification = ({
  notification,
}: ProjectEndNotificationProps) => {
  const {
    notificationData: { projectName: projectName, employees },
  } = notification;

  const getEmployeesLabel = () => {
    const maxEmployeesToShow = 3;
    const remainingEmployeesCount = employees.length - maxEmployeesToShow;

    const employeeLabels = employees
      .slice(0, maxEmployeesToShow)
      .map((employee) => employee.name);

    let label = employeeLabels.join(", ");

    if (remainingEmployeesCount > 0 && remainingEmployeesCount <= 1)
      label += `and ${remainingEmployeesCount} more employee`;
    else if (remainingEmployeesCount > 1)
      label += ` and ${remainingEmployeesCount} more employees`;

    return label;
  };

  return (
    <div
      className={tw(
        "relative flex items-start gap-4 p-4 pl-6",
        !notification.readAt && "bg-complementary-blue-50",
      )}
    >
      <span
        className={tw(
          "absolute left-2 top-10 block h-2 w-2 rounded-full bg-complementary-blue-500",
          notification.readAt && "hidden",
        )}
      />

      <CircularAvatar size="lg" defaultToIcon={false} name={projectName} />

      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
        <div className="flex flex-col gap-2">
          <p className="break-words text-sm font-medium text-gray-900">
            <span className="text-complementary-orange-500">{projectName}</span>{" "}
            project is about to end.
          </p>
          <Typography variant="detail" className="text-neutrals-dark-500">
            Assign new hours for {getEmployeesLabel() || "assigned employees"}.
          </Typography>
        </div>

        <NavLink
          to={ROUTES.projects.base}
          className="mt-2 flex items-center gap-1 text-xs text-complementary-blue-500"
        >
          Administrate hours
          <ArrowTopRightOnSquareIcon aria-hidden="true" className="h-4 w-4" />
        </NavLink>
      </div>
    </div>
  );
};
