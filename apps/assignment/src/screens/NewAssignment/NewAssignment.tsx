import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { HookedSelect, ScrollArea, Select } from "@lightit/ui";

import { getCoursesQuery } from "~/api/courses";
import { getProjectsQuery } from "~/api/projects";
import { Breadcrumbs } from "~/components";
import { ROUTES } from "~/router";
import { ASSIGNMENT_TYPE_OPTIONS } from "~/shared.constants";
import type { AssignmentType } from "~/shared.types";
import { errorToast } from "~/utils";
import { NewCourseAssignment } from "./NewCourseAssignment";
import { NewProjectAssignment } from "./NewProjectAssignment";

export const assignmentSchema = z.object({
  elementId: z
    .number({ required_error: "Invalid id" })
    .nullable()
    .refine((id) => id !== null, { message: "Required" }),
});

export type AssignmentFormValues = z.infer<typeof assignmentSchema>;

export const NewAssignment = () => {
  const [assignmentType, setAssignmentType] =
    useState<AssignmentType>("project");

  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
    reset,
  } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      elementId: null,
    },
  });

  const { data: projectOptions } = useQuery({
    ...getProjectsQuery(),
    onError: errorToast,
    initialData: [],
    select: (data) =>
      data
        .filter((project) => project.status === "active")
        .map((project) => ({
          id: project.id,
          value: project.id,
          label: project.name,
          startDate: project.startDate,
          endDate: project.endDate,
        })),
  });

  const { data: courseOptions } = useQuery({
    ...getCoursesQuery({}),
    onError: errorToast,
    select: (response) =>
      response.data
        .filter((course) => course.status === "available")
        .map((course) => ({
          value: course.id,
          label: course.name,
        })),
  });

  const elementId = watch("elementId");
  const options =
    assignmentType === "project" ? projectOptions : courseOptions ?? [];

  return (
    <>
      <ScrollArea>
        <div className="flex grow flex-col gap-6 p-8">
          <header className="flex flex-col gap-4">
            <Breadcrumbs
              pages={[
                { name: "Assignments", href: ROUTES.assignments.historyView },
                { name: "History view", href: ROUTES.assignments.historyView },
                {
                  name: "New Assignment",
                  href: ROUTES.assignments.newAssignment,
                },
              ]}
            />

            <h1 className="text-3xl font-bold">New assignment</h1>
          </header>

          <section className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200">
            <h2 className="px-6 py-4 text-lg font-semibold">
              Assignment Information
            </h2>

            <div className="flex items-center gap-6 p-6">
              <Select
                id="type"
                containerClassName="w-1/2"
                label="Assignment type"
                placeholder={ASSIGNMENT_TYPE_OPTIONS[0]?.label ?? "Loading..."}
                disabled={!ASSIGNMENT_TYPE_OPTIONS.length}
                options={ASSIGNMENT_TYPE_OPTIONS}
                value={assignmentType}
                onChange={(v) => {
                  setAssignmentType(v);
                }}
              />
              <HookedSelect
                autocomplete
                id="elementId"
                containerClassName="w-1/2"
                label={
                  assignmentType === "project" ? "Project name" : "Course name"
                }
                placeholder={options[0]?.label ?? "Loading..."}
                control={control}
                disabled={!options.length}
                options={options}
                error={errors.elementId?.message}
              />
            </div>
          </section>

          {assignmentType === "project" && (
            <NewProjectAssignment
              projectId={elementId}
              projects={projectOptions}
              handleSubmitProjectId={handleSubmit}
              onAssignmentCreated={reset}
            />
          )}

          {assignmentType === "course" && (
            <NewCourseAssignment
              courseId={elementId}
              handleSubmitCourseId={handleSubmit}
              onAssignmentCreated={reset}
            />
          )}
        </div>
      </ScrollArea>
    </>
  );
};
