import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { tw } from "@lightit/shared";
import { useToastStore } from "@lightit/toast";
import {
  AvatarGroup,
  Button,
  Chip,
  CircularAvatar,
  Dropdown,
  icons,
  PopupBox,
} from "@lightit/ui";

import { deleteProject } from "~/api/projects";
import type { Project } from "~/api/projects";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { MODAL_ROUTES, useNavigateModal } from "~/router";
import { PROJECT_TYPE_OPTIONS } from "~/shared.constants";
import { errorToast, formatBackendDate } from "~/utils";

const statusChipColor = {
  active: {
    text: "text-alert-success-500",
    background: "bg-complementary-green-100",
  },
  paused: {
    text: "text-secondary-500",
    background: "bg-secondary-50",
  },
  archived: {
    text: "text-neutrals-dark-200",
    background: "bg-neutrals-light-200",
  },
} as const;

export const ProjectDetails = ({ project }: { project: Project }) => {
  const pushToast = useToastStore((state) => state.pushToast);

  const navigateModal = useNavigateModal();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject.mutation,
    onSuccess: () => {
      void pushToast({
        type: "success",
        title: "Deletion Complete",
        message: `Project "${project.name}" successfully deleted!`,
      });

      navigate(-1);
      deleteProject.invalidates(queryClient, { projectId: project.id });
    },
    onError: errorToast,
  });

  const [confirmDelete, setConfirmDelete] = useState(false);

  const { hasPermission } = usePermissions();

  const dropdownOptions = [
    ...(hasPermission(PERMISSIONS.updateProject)
      ? [
          {
            value: "edit",
            label: "Edit",
            left: <icons.PencilSquareIcon />,
            onClick: () => {
              navigateModal(`${MODAL_ROUTES.projectForm}/${project.id}`);
            },
          },
        ]
      : []),
    ...(hasPermission(PERMISSIONS.deleteProject)
      ? [
          {
            value: "delete",
            label: "Delete",
            left: <icons.TrashIcon />,
            onClick: () => setConfirmDelete(true),
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center justify-between border-b border-zinc-200 px-8 py-6">
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center justify-center gap-1">
            <span className="text-lg font-semibold text-neutrals-dark-500">
              {project.name}
            </span>
          </div>
          <Chip
            className={`capitalize ${statusChipColor[project.status].text} ${
              statusChipColor[project.status].background
            }`}
          >
            {project.status}
          </Chip>
        </div>

        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-gray-700">
            <label htmlFor="startDate" className="text-sm font-medium">
              Start Date
            </label>
            <div
              id="startDate"
              className="border-neutrals-300 rounded-md border bg-white px-4 py-2.5 text-sm shadow"
            >
              {project && formatBackendDate(project.startDate)}
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <label htmlFor="startDate" className="text-sm font-medium">
              End Date
            </label>
            <div
              id="startDate"
              className="border-neutrals-300 rounded-md border bg-white px-4 py-2.5 text-sm shadow"
            >
              {project && formatBackendDate(project.endDate)}
            </div>
          </div>
        </div>
        {dropdownOptions.length > 0 && (
          <Dropdown
            containerClassName="w-fit flex items-center"
            optionsContainerClassName="bg-primary-white-50 rounded-2xl py-4 w-32 gap-2 mt-0 border-0 shadow-full"
            renderButton={({ open, onClick }) => (
              <button onClick={onClick}>
                <icons.EllipsisHorizontalIcon
                  className={tw(
                    "h-6 w-6 cursor-pointer text-neutrals-dark",
                    open && "text-secondary-500",
                  )}
                />
              </button>
            )}
            options={dropdownOptions}
          />
        )}
      </div>

      <div className="flex h-72 w-full gap-4 bg-gray-50 p-8">
        <div className="flex w-1/2 flex-col pr-32">
          <div className="grow">
            <h3 className="text-sm font-semibold text-gray-700">
              Project Description
            </h3>
            <p className="mt-2 text-sm text-gray-700">{project.description}</p>
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-700">
                Account Manager
              </h3>
              <p className="text-ellipsis text-sm text-gray-700">
                {project.accountManager.name || ""}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-700">Tech Lead</h3>
              <p className="text-sm text-gray-700">{project.techLead?.name}</p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-700">
                Project Manager
              </h3>
              <p className="text-sm text-gray-700">
                {project.projectManager?.name}
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-1/2 gap-4">
          <div className="flex h-full w-1/2 flex-col justify-between gap-4 overflow-y-auto">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-700">
                Project Type
              </h3>

              <Chip className="bg-sky-500 text-white">
                {
                  PROJECT_TYPE_OPTIONS.find(
                    (option) => option.value === project.type,
                  )?.label
                }
              </Chip>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-700">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((technology) => (
                  <a
                    key={technology.id}
                    href={technology.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Chip
                      className={`text-${
                        technology.colors.text ?? "sky-500"
                      } bg-${
                        technology?.colors?.background ??
                        "complementary-blue-50"
                      }`}
                    >
                      {`${technology.name} ${
                        technology.version ? technology.version : ""
                      }`}
                    </Chip>
                  </a>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-700">
                Integrations
              </h3>
              <div className="flex gap-2">
                {project.integrations.map((integration) => (
                  <Chip
                    className={`text-${
                      integration.colors?.text ?? "sky-500"
                    } bg-${
                      integration.colors?.background ?? "complementary-blue-50"
                    }`}
                    key={integration.id}
                  >
                    {integration.name}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
          <div className="h-full w-1/2 overflow-auto">
            <div className="grow">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-gray-700">
                  Utilities
                </h3>

                <div className="flex flex-wrap gap-3">
                  {project.utilities.map((utility) => {
                    const href = !utility?.url?.includes("http")
                      ? `//${utility.url}`
                      : utility.url;

                    return (
                      <a key={utility.id} href={href} draggable="false">
                        <Chip
                          className="rounded-lg border-complementary-blue-100 bg-complementary-blue-50 capitalize text-complementary-blue-500"
                          size="sm"
                        >
                          {utility.name}
                          <icons.ArrowTopRightOnSquareIcon className="h-3 w-3" />
                        </Chip>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PopupBox
        show={confirmDelete}
        boxType="confirm"
        contentType="warningRed"
        title="Deleting the project"
        onClose={() => {
          setConfirmDelete(false);
        }}
        onConfirm={() => {
          deleteProjectMutation.mutate(project.id);
        }}
        renderMessage={() => (
          <p className="text-sm">
            Are you sure you want to delete the &quot;
            <span className="font-bold">{project.name}</span>&quot; project?
            <AvatarGroup className="pt-3">
              {project.employees?.map((assignee) => (
                <CircularAvatar
                  key={assignee.id}
                  size="xs"
                  defaultToIcon={assignee.avatarUrl ? true : false}
                  image={assignee.avatarUrl}
                />
              ))}
            </AvatarGroup>
          </p>
        )}
        renderButtonGroup={({ onCancel, onConfirm, initialFocus }) => (
          <div className="mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:justify-end">
            <Button
              size="sm"
              onClick={onConfirm}
              variant="tertiary-link"
              className="w-full justify-center sm:w-auto"
            >
              Delete project
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
    </div>
  );
};
