import React from "react";

import { tw } from "@lightit/shared";
import {
  AvatarGroup,
  CircularAvatar,
  Dropdown,
  icons,
  Typography,
} from "@lightit/ui";

import type { ProjectWithEmployees } from "~/api/projects";
import { ChipClient, ChipStatus } from "~/components";

export const ProjectRow = ({
  project,
  onDeleteProject,
}: {
  project: ProjectWithEmployees;
  onDeleteProject: () => void;
}) => {
  return (
    <tr key={project.id} className="even:bg-neutrals-medium-100">
      <td className="flex items-center gap-2 py-6 pl-8">
        <CircularAvatar size="xs" defaultToIcon={false} name={project.name} />
        <Typography variant="small" className="max-w-md truncate">
          {project.name}
        </Typography>
      </td>
      <td>
        <ChipClient client={project.client} />
      </td>
      <td>
        <AvatarGroup>
          {project.employees?.map((assignee) => (
            <CircularAvatar
              key={assignee.id}
              size="xs"
              defaultToIcon={assignee.avatarUrl ? true : false}
              image={assignee.avatarUrl}
            />
          ))}
        </AvatarGroup>
      </td>
      <td>
        <ChipStatus status={project.status} />
      </td>
      <td>
        <Dropdown
          containerClassName="w-fit"
          optionsContainerClassName="bg-primary-white-50 rounded-2xl py-4 w-32 gap-2"
          label="..."
          renderButton={({ open, onClick }) => (
            <div
              className={tw(
                "flex h-9 w-9 cursor-pointer items-center justify-center rounded-md",
                open && "bg-secondary-50",
              )}
            >
              <button onClick={onClick}>
                <icons.EllipsisVerticalIcon className="h-6 w-6 text-secondary-500" />
              </button>
            </div>
          )}
          options={[
            {
              value: "delete",
              label: "Delete",
              left: <icons.TrashIcon />,
              onClick: onDeleteProject,
            },
          ]}
        />
      </td>
    </tr>
  );
};
