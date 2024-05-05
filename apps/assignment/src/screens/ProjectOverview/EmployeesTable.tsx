import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { tw } from "@lightit/shared";
import {
  Button,
  Chip,
  CircularAvatar,
  Dropdown,
  icons,
  Input,
  Typography,
} from "@lightit/ui";

import { getProjectAssignmentsQuery } from "~/api/assignments";
import type { Project } from "~/api/projects";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { MODAL_ROUTES, ROUTES, useNavigateModal } from "~/router";
import { PROJECT_TYPE } from "~/shared.constants";
import { formatBackendDate } from "~/utils";

export const EmployeesTable = ({ project }: { project: Project }) => {
  const { hasPermission } = usePermissions();
  const [search, setSearch] = useState("");
  const navigateModal = useNavigateModal();

  const { data } = useQuery(getProjectAssignmentsQuery(project.id));

  const filteredAssignments =
    search === ""
      ? data?.data ?? []
      : data?.data?.filter(
          (assignment) =>
            assignment?.employee?.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(search.toLowerCase().replace(/\s+/g, "")),
        ) ?? [];

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-8 py-6">
        <h2 className="text-base font-medium text-neutrals-dark-500">
          Employee History
        </h2>
        <div className="flex gap-4">
          <Input
            className="w-64"
            id="id"
            left={<icons.MagnifyingGlassIcon />}
            placeholder="Search employee"
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
          {(project.type === PROJECT_TYPE.INTERNAL
            ? hasPermission(PERMISSIONS.createInternalProject)
            : hasPermission(PERMISSIONS.createClientProject)) && (
            <Button
              variant="secondary"
              size="sm"
              className="h-8"
              onClick={() =>
                navigateModal(
                  `${MODAL_ROUTES.newAssignmentForm}/?type=project&projectId=${project.id}`,
                )
              }
              left={<icons.PlusIcon />}
            >
              New Assignment
            </Button>
          )}
        </div>
      </div>

      <div>
        <table className="h-full w-full border-separate border-spacing-0">
          <thead>
            <tr>
              {["employee name", "role", "time period", "status", ""].map(
                (header) => (
                  <th
                    key={header}
                    className="sticky top-0 z-10 border-y border-neutrals-light-200 bg-white py-4 text-left text-sm font-medium capitalize text-neutrals-dark-200 first:pl-8 last:pr-8"
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody className="text-sm text-neutrals-dark">
            {filteredAssignments.map((assignment) => {
              const employee = assignment.employee;

              return (
                <tr
                  key={assignment.id}
                  className="odd:bg-gray-50 even:bg-white"
                >
                  <td className="w-1/4 px-8 py-6">
                    <div className="flex items-center">
                      <CircularAvatar
                        size="xs"
                        image={employee?.avatarUrl}
                        name={employee?.name}
                      />
                      <Link to={`${ROUTES.employees}/${employee?.id}`}>
                        <Typography className="ml-2 cursor-pointer hover:underline">
                          {employee?.name}
                        </Typography>
                      </Link>
                    </div>
                  </td>

                  <td className="w-1/4">
                    {employee?.jobTitle && (
                      <Chip
                        className="bg-neutrals-light-200 text-neutrals-dark-200"
                        size="lg"
                      >
                        {employee.jobTitle}
                      </Chip>
                    )}
                  </td>

                  {/* TODO: add assigned to project period */}
                  <td className="w-1/4">
                    <Typography variant="small" font="normal">
                      {`From ${
                        assignment?.fromDate ??
                        formatBackendDate(project.startDate)
                      } to ${
                        assignment?.toDate ?? formatBackendDate(project.endDate)
                      }`}
                    </Typography>
                  </td>

                  <td className="w-1/8">
                    {employee &&
                      hasPermission(PERMISSIONS.updateTeamAssignment) && (
                        <Dropdown
                          containerClassName="w-fit flex items-center"
                          optionsContainerClassName="bg-primary-white-50 rounded-2xl py-4 w-32 gap-2 mt-0 border-0 shadow-full"
                          renderButton={({ open, onClick }) => (
                            <button onClick={onClick}>
                              <icons.EllipsisVerticalIcon
                                className={tw(
                                  "h-6 w-6 cursor-pointer text-neutrals-dark",
                                  open && "text-secondary-500",
                                )}
                              />
                            </button>
                          )}
                          options={[
                            {
                              value: "edit",
                              label: "Edit",
                              left: <icons.PencilSquareIcon />,
                              onClick: () =>
                                navigateModal(
                                  `${MODAL_ROUTES.assignmentDetails}/${assignment?.id}`,
                                ),
                            },
                          ]}
                        />
                      )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
