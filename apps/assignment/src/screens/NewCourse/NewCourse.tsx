import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { tw } from "@lightit/shared";
import { useToastStore } from "@lightit/toast";
import {
  Button,
  HookedSelect,
  icons,
  Input,
  ScrollArea,
  TextArea,
} from "@lightit/ui";

import { createCourse, getTopicsQuery } from "~/api/courses";
import { Breadcrumbs } from "~/components";
import { ROUTES } from "~/router";
import { COURSE_STATUS, COURSE_STATUS_OPTIONS } from "~/shared.constants";
import { errorToast, handleAxiosFieldErrors } from "~/utils";

export const courseSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(255, {
      message: "The description field must not be greater than 255 characters",
    }),
  topics: z.array(z.number()).min(1, { message: "Enter at least one topic" }),
  urls: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Name is required" }),
        url: z.string().min(1, { message: "Url is required" }),
      }),
    )
    .min(1),
});

export type CourseFormValues = z.infer<typeof courseSchema>;

export const NewCourse = () => {
  const navigate = useNavigate();
  const pushToast = useToastStore((state) => state.pushToast);
  const queryClient = useQueryClient();

  const rowDefaultValues = { name: "", url: "" };

  const {
    control,
    formState: { errors },
    register,
    setError,
    handleSubmit,
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      topics: [],
      status: COURSE_STATUS.AVAILABLE,
      urls: [rowDefaultValues],
    },
  });

  const { data: topicOptions } = useQuery({
    ...getTopicsQuery(),
    onError: errorToast,
    initialData: [],
    select: (data) =>
      data.map((topic) => ({ value: topic.id, label: topic.name })),
  });

  const createCourseMutation = useMutation({
    mutationFn: createCourse.mutation,
    onSuccess: (course) => {
      void pushToast({
        type: "success",
        title: "Creation Success",
        message: `Course "${course?.name}" successfully created!`,
      });
      createCourse.invalidates(queryClient, { courseId: course.id });
      navigate(ROUTES.learningCenter.coursesList);
    },
    onError: (err) => {
      errorToast(err);
      handleAxiosFieldErrors(err, setError);
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "urls",
    control,
  });

  // Deletion of URLs is disabled if there is only one
  const hasOnlyOneURL = fields.length == 1;

  return (
    <ScrollArea>
      <div className="flex grow flex-col gap-6 p-8">
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            void handleSubmit((data) => {
              createCourseMutation.mutate(data);
            })(e);
          }}
        >
          <header className="flex flex-col gap-4">
            <Breadcrumbs
              pages={[
                { name: "Home", href: ROUTES.dashboard },
                {
                  name: "Learning Center",
                  href: ROUTES.learningCenter.coursesList,
                },
                { name: "New course", href: ROUTES.learningCenter.newCourse },
              ]}
            />

            <div className="flex flex-row items-center justify-between">
              <h1 className="text-3xl font-bold">New course</h1>

              <div className="flex items-center justify-end gap-4 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(ROUTES.learningCenter.coursesList)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Publish course
                </Button>
              </div>
            </div>
          </header>

          <section>
            <h2 className="py-4 text-xl font-bold">Main Information</h2>

            <div className="flex flex-row gap-6">
              <div className="flex w-1/2 flex-col gap-8">
                <Input
                  autoComplete="off"
                  id="name"
                  placeholder="Course Name"
                  {...register("name")}
                  error={errors?.name?.message}
                  label="Name"
                  requiredMarker
                />
                <HookedSelect
                  id="status"
                  label="Status"
                  control={control}
                  placeholder="Select Status"
                  options={COURSE_STATUS_OPTIONS}
                  error={errors.status?.message}
                  requiredMarker
                />
                <HookedSelect
                  multiple
                  id="topics"
                  label="Topics"
                  disabled={!topicOptions.length}
                  placeholder={
                    topicOptions.length > 0 ? "Add topics" : "Loading..."
                  }
                  control={control}
                  options={topicOptions}
                  error={errors.topics?.message}
                  requiredMarker
                />
              </div>
              <div className="flex w-1/2 flex-col">
                <TextArea
                  autoComplete="off"
                  id="description"
                  placeholder="Course Description"
                  className="h-full resize-none pr-8"
                  secondaryContainerClassName="h-full"
                  containerClassName="h-full"
                  {...register("description")}
                  error={errors?.description?.message}
                  label="Description"
                  requiredMarker
                  tooltipClassName="top-5 right-3"
                  maxCharacters={255}
                />
              </div>
            </div>
          </section>

          <section className="mt-4 divide-y divide-neutral-200 rounded-2xl border border-neutral-200">
            <h2 className="px-6 py-4 text-lg font-semibold">Useful Links</h2>

            <div className="flex flex-col gap-6 p-6">
              <div className="overflow-hidden rounded-2xl border border-neutrals-medium-200">
                <table className="w-full table-fixed text-left">
                  <colgroup>
                    <col className={tw(hasOnlyOneURL ? "w-1/2" : "w-[47%]")} />
                    <col className={tw(hasOnlyOneURL ? "w-1/2" : "w-[47%]")} />
                    {!hasOnlyOneURL && <col className="min-w-12 w-[6%]" />}
                  </colgroup>
                  <thead className="border-b border-neutrals-medium-200 text-sm text-black">
                    <tr className="bg-neutrals-light-200">
                      {["Name", "Url"].map((header) => (
                        <th
                          scope="col"
                          key={header}
                          className="px-4 py-2 font-medium"
                        >
                          {header}
                        </th>
                      ))}
                      {!hasOnlyOneURL && (
                        <th scope="col" className="p-2 pr-4">
                          <span className="sr-only">Delete</span>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {fields.map((field, index) => (
                      <tr
                        key={field.id}
                        className="items-center justify-center align-top even:bg-neutrals-light-200"
                      >
                        <td className="py-3 pl-4">
                          <Input
                            autoComplete="off"
                            id={`urls.${index}.name`}
                            {...register(`urls.${index}.name`)}
                            error={errors.urls?.[index]?.name?.message}
                          />
                        </td>
                        <td
                          className={tw("py-3 pl-4", hasOnlyOneURL && "pr-4")}
                        >
                          <Input
                            autoComplete="off"
                            id={`urls.${index}.url`}
                            {...register(`urls.${index}.url`)}
                            error={errors.urls?.[index]?.url?.message}
                          />
                        </td>
                        {!hasOnlyOneURL && (
                          <td className="mt-4 flex h-full items-center justify-center">
                            <button
                              aria-label="Delete"
                              onClick={() => remove(index)}
                              className="rounded-lg border border-complementary-red-500 p-2 text-complementary-red-500 hover:border-complementary-red-300 hover:text-complementary-red-300"
                            >
                              <icons.TrashIcon
                                className="h-4 w-4"
                                strokeWidth={2}
                              />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  right={<icons.PlusIcon />}
                  onClick={() => append(rowDefaultValues)}
                >
                  Add useful link
                </Button>
              </div>
            </div>
          </section>
        </form>
      </div>
    </ScrollArea>
  );
};
