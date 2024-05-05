import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { Control, UseFormRegister } from "react-hook-form";
import { useParams } from "react-router-dom";

import { useToastStore } from "@lightit/toast";
import {
  AvatarGroup,
  Button,
  CircularAvatar,
  HookedSelect,
  icons,
  IconWrapper,
  SideModal,
  Tabs,
} from "@lightit/ui";

import {
  createProject,
  deleteProject,
  getProjectQuery,
  updateProject,
} from "~/api/projects";
import type { Project } from "~/api/projects";
import { ConfirmDelete, ScreenLoading } from "~/components/";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { PROJECT_STATUS_OPTIONS } from "~/shared.constants";
import { errorToast, formatBackendDate, handleAxiosFieldErrors } from "~/utils";
import { ProjectInfoForm } from "./ProjectInfoForm";
import type { ProjectInfoFormValues } from "./ProjectInfoForm";
import { projectSchema } from "./projectSchema";
import type { ProjectFormValues } from "./projectSchema";
import { ProjectUsefulLinksForm } from "./ProjectUsefulLinksForm";
import type { ProjectUsefulLinksFormValues } from "./ProjectUsefulLinksForm";

const TABS = ["Project Information", "Useful Links"] as const;
type ProjectFormTabs = (typeof TABS)[number];

const getDefaultValues = (project?: Project) => {
  return {
    projectId: project?.id,
    color: project?.color ?? "",
    type: project?.type,
    name: project?.name ?? "",
    clientId: project?.client.id,
    startDate: formatBackendDate(project?.startDate),
    endDate: formatBackendDate(project?.endDate),
    description: project?.description ?? "",
    accountManagerId: project?.accountManager.id,
    techLeadId: project?.techLead?.id,
    projectManagerId: project?.projectManager?.id,
    status: project?.status ?? "active",
    environment: {
      production: project?.environment?.production ?? "",
      staging: project?.environment?.staging ?? "",
      development: project?.environment?.development ?? "",
    },
    technologies:
      project?.technologies.map((p) => ({
        id: p.id,
        version: p.version ?? "",
      })) ?? [],
    utilities: project?.utilities
      ? project?.utilities.map((p) => ({
          name: p.name,
          url: p.url ?? "",
        }))
      : [],
    integrations: project?.integrations.map((p) => p.id) ?? [],
  };
};

export interface ProjectFormProps {
  onClose?: () => void;
  show: boolean;
}

export const ProjectModal = ({
  onClose = () => null,
  show,
}: ProjectFormProps) => {
  const { hasPermission } = usePermissions();
  const pushToast = useToastStore((state) => state.pushToast);

  const queryClient = useQueryClient();
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId ? parseInt(params.projectId) : null;

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [tab, setTab] = useState<ProjectFormTabs>(TABS[0]);

  const { data: project, isLoading: isLoadingProject } = useQuery({
    ...getProjectQuery(projectId),
    onError: errorToast,
  });

  const {
    formState: { errors },
    setError,
    register,
    handleSubmit,
    reset,
    control,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      ...getDefaultValues(project),
      clientId:
        hasPermission(PERMISSIONS.createClientProject) && project?.client.id
          ? project?.client.id
          : 1,
    },
    resetOptions: {
      keepDirtyValues: true, // keep dirty fields unchanged, but update defaultValues
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: createProject.mutation,
    onSuccess: ({ data: { id, name } }) => {
      reset();
      createProject.invalidates(queryClient, { projectId: id });
      void pushToast({
        type: "success",
        title: "Creation Success",
        message: `Project ${name} successfully created!`,
      });
      onClose();
    },
    onError: (err) => {
      errorToast(err);
      handleAxiosFieldErrors(err, setError);
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: updateProject.mutation,
    onSuccess: ({ data: { id, name } }) => {
      updateProject.invalidates(queryClient, { projectId: id });
      void pushToast({
        type: "success",
        title: "Update Success",
        message: `Project ${name} successfully updated!`,
      });
      onClose();
      reset();
    },
    onError: (err) => {
      errorToast(err);
      handleAxiosFieldErrors(err, setError);
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject.mutation,
    onSuccess: (_, id) => {
      onClose();
      reset();
      deleteProject.invalidates(queryClient, { projectId: id });
      void pushToast({
        type: "success",
        title: "Deletion Complete",
        message: project && `Project "${project.name}" successfully deleted!`,
      });
    },
    onError: errorToast,
  });

  return (
    <SideModal show={show} onClose={onClose} className="w-[35rem]">
      <form
        className="flex h-screen w-full flex-col overflow-hidden"
        onSubmit={(e) => {
          void handleSubmit((values) => {
            project
              ? updateProjectMutation.mutate(values)
              : createProjectMutation.mutate(values);
          })(e);
        }}
      >
        {isLoadingProject && projectId !== null ? (
          <ScreenLoading />
        ) : (
          <>
            <div className="flex h-44 flex-col justify-between border-b border-neutrals-medium-300 bg-gradient-to-t from-indigo-600 to-blue-300 px-8 pb-3 pt-5 text-white">
              <div className="flex w-full justify-end gap-3 pr-3">
                {project && (
                  <Button
                    variant="secondary"
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md bg-primary-white-50 hover:bg-secondary-50"
                    onClick={() => {
                      setConfirmDelete(true);
                    }}
                    tabIndex={-1}
                  >
                    <IconWrapper className="flex items-center">
                      <icons.TrashIcon className="h-5 w-5 text-secondary-500" />
                    </IconWrapper>
                  </Button>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {project ? project.name : "New Project"}
                </h1>
                <div className="mt-3">
                  {project && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">
                        <p>Created on {formatBackendDate(project.createdAt)}</p>
                      </div>

                      <div className="flex items-center gap-3 text-sm font-medium">
                        Project is
                        <HookedSelect
                          size="sm"
                          options={PROJECT_STATUS_OPTIONS}
                          id="status"
                          control={control}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex h-full w-full flex-col justify-center overflow-hidden">
              <Tabs
                tabs={TABS}
                className="border-b px-8"
                value={tab}
                onChange={setTab}
              />

              {tab === "Project Information" && (
                <ProjectInfoForm
                  control={control as unknown as Control<ProjectInfoFormValues>}
                  errors={errors}
                  register={
                    register as unknown as UseFormRegister<ProjectInfoFormValues>
                  }
                />
              )}

              {tab === "Useful Links" && (
                <ProjectUsefulLinksForm
                  control={
                    control as unknown as Control<ProjectUsefulLinksFormValues>
                  }
                  errors={errors}
                  register={
                    register as unknown as UseFormRegister<ProjectUsefulLinksFormValues>
                  }
                />
              )}

              <div className="flex items-center justify-end gap-4 self-stretch px-8 py-9">
                <Button onClick={onClose} variant="secondary" size="md">
                  Cancel
                </Button>
                <Button size="md" type="submit">
                  Save Project
                </Button>
              </div>
            </div>
          </>
        )}
      </form>
      {project && (
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
      )}
    </SideModal>
  );
};
