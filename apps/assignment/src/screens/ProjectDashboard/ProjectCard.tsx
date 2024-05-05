import { useState } from "react";
import type { ComponentPropsWithoutRef, FC } from "react";
import {
  FolderIcon,
  ForwardIcon,
  PauseCircleIcon,
} from "@heroicons/react/24/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { tw } from "@lightit/shared";
import { useToastStore } from "@lightit/toast";
import {
  AvatarGroup,
  Chip,
  CircularAvatar,
  Dropdown,
  icons,
  IconWrapper,
} from "@lightit/ui";

import { deleteProject } from "~/api/projects";
import type { Project } from "~/api/projects";
import { ConfirmDelete } from "~/components";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { ROUTES } from "~/router";
import { errorToast } from "~/utils";

export interface ProjectCardProps extends ComponentPropsWithoutRef<"div"> {
  project: Project;
}

const statusChip = {
  active: {
    text: "text-complementary-blue-500",
    icon: <ForwardIcon className="w-5" />,
  },
  paused: {
    text: "text-secondary-500",
    icon: <PauseCircleIcon className="w-5" />,
  },
  archived: {
    text: "text-neutrals-dark-200",
    icon: <FolderIcon className="w-5" />,
  },
} as const;

export const ProjectCard: FC<ProjectCardProps> = ({
  project,
  className,
  ...props
}) => {
  const pushToast = useToastStore((state) => state.pushToast);

  const queryClient = useQueryClient();

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject.mutation,
    onSuccess: () => {
      void pushToast({
        type: "success",
        title: "Deletion Complete",
        message: `Project "${project.name}" successfully deleted!`,
      });
      deleteProject.invalidates(queryClient, { projectId: project.id });
    },
    onError: errorToast,
  });

  const [confirmDelete, setConfirmDelete] = useState(false);

  const { hasPermission } = usePermissions();

  const dropdownOptions = [
    ...(hasPermission(PERMISSIONS.deleteProject)
      ? [
          {
            value: "delete",
            label: "Delete",
            left: <icons.TrashIcon />,
            onClick: () => {
              setConfirmDelete(true);
            },
          },
        ]
      : []),
  ];

  return (
    <div className={tw("relative", className)} {...props}>
      {dropdownOptions.length > 0 && (
        <Dropdown
          containerClassName="w-fit absolute flex items-center right-4 top-4 z-10"
          optionsContainerClassName="bg-primary-white-50 rounded-2xl py-4 w-32 gap-2"
          label="..."
          renderButton={({ open, onClick }) => (
            <IconWrapper className="flex items-center justify-center">
              <button onClick={onClick}>
                <icons.EllipsisVerticalIcon
                  className={tw(
                    "w-5 cursor-pointer stroke-2 text-secondary-500",
                    open && "text-secondary-600",
                  )}
                />
              </button>
            </IconWrapper>
          )}
          options={dropdownOptions}
        />
      )}

      <Link
        to={`${ROUTES.projects.base}/${project.id}`}
        className={tw(
          "group flex flex-col gap-8 rounded-lg border-l-4 p-4 pl-3 shadow-full transition-shadow hover:opacity-80 hover:shadow-xl",
          `border-${project.color}`,
        )}
      >
        <div className="flex flex-col gap-6">
          <div className="mr-6 flex flex-row items-center pr-2">
            <h3
              className={tw(
                "truncate text-lg font-semibold leading-normal text-neutrals-dark-900",
              )}
            >
              {project.name}
            </h3>
          </div>

          <div className="flex flex-row items-center justify-between gap-1">
            <Chip
              className="truncate bg-neutrals-light-200 text-neutrals-dark-200"
              size="lg"
            >
              {project.client.name}
            </Chip>

            <Chip className={`capitalize ${statusChip[project.status].text}`}>
              {statusChip[project.status].icon}

              {project.status}
            </Chip>
          </div>
        </div>
      </Link>
      <ConfirmDelete
        label="project"
        renderMessage={() => (
          <div className="text-sm">
            Are you sure you want to delete the &quot;
            <span className="font-bold">{project.name}</span>&quot; project?
            <AvatarGroup className="pt-3">
              {project.employees?.map((assignee) => (
                <CircularAvatar
                  key={assignee.id}
                  size="xs"
                  image={assignee.avatarUrl}
                />
              ))}
            </AvatarGroup>
          </div>
        )}
        show={confirmDelete}
        onClose={() => {
          setConfirmDelete(false);
        }}
        onConfirm={() => {
          deleteProjectMutation.mutate(project.id);
        }}
      />
    </div>
  );
};
