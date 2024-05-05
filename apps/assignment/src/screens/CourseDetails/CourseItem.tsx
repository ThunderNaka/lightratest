import * as Accordion from "@radix-ui/react-accordion";
import { capitalize } from "lodash";

import { tw } from "@lightit/shared";
import { Chip, icons } from "@lightit/ui";

import type { Course } from "~/shared.types";

export const CourseItem = ({ course }: { course: Course }) => {
  return (
    <Accordion.Root type="multiple" defaultValue={["course-information"]}>
      <Accordion.Item
        value="course-information"
        className="divide-y overflow-hidden rounded-2xl border-2"
      >
        <Accordion.Trigger className="flex w-full items-center duration-300 data-[state=open]:rounded-b-none [&[data-state=open]>div:last-child>svg]:rotate-180">
          <div className="flex flex-1 items-center justify-between rounded-t-lg px-6 py-4">
            <h2 className="text-xl font-bold">Course Information</h2>
            <icons.ChevronDownIcon className="h-5 w-5 cursor-pointer stroke-nostalgia-purple-900 stroke-2" />
          </div>
        </Accordion.Trigger>
        <Accordion.Content className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <div>
            <section className="rounded-b-lg px-6">
              <div className="flex flex-row gap-6">
                <div className="flex w-1/2 flex-col py-4">
                  <section className="flex flex-col">
                    <div className="flex flex-col">
                      <span className="mb-2 font-semibold">Description</span>
                      <span>{course.description}</span>
                    </div>
                  </section>

                  <section className="mt-4 flex flex-col">
                    <div className="flex flex-col">
                      <span className="mb-2 font-semibold">Useful Links</span>
                      <div className="flex flex-row">
                        {course.urls.length > 0
                          ? course.urls.map((url, index) => (
                              <div key={course.id}>
                                <a
                                  key={url.url}
                                  href={url.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sm text-complementary-blue-600 underline"
                                >
                                  {capitalize(url.name)}
                                </a>
                                {index !== course.urls.length - 1 && (
                                  <span className="px-2 text-sm text-neutrals-dark">
                                    ,
                                  </span>
                                )}
                              </div>
                            ))
                          : "-"}
                      </div>
                    </div>
                  </section>
                </div>

                <div className="flex w-1/2 flex-col py-4">
                  <div className="flex w-1/2 flex-col">
                    <section className="flex flex-col">
                      <span className="mb-2 text-sm font-semibold">
                        Course Status
                      </span>
                      <Chip
                        size="sm"
                        className={tw(
                          "font-normal",
                          course.status === "available"
                            ? "bg-complementary-green-200 text-alert-success-800"
                            : "bg-complementary-red-50 text-complementary-red-600",
                        )}
                      >
                        {capitalize(course.status)}
                      </Chip>
                    </section>
                    <section className="mt-4 flex flex-col">
                      <span className="mb-2 text-sm font-semibold">Topics</span>
                      <span className="text-sm">
                        {course.topics?.map((topic) => topic.name).join("| ") ||
                          "-"}
                      </span>
                    </section>

                    <section className="mt-4 flex flex-col">
                      <span className="mb-2 text-sm font-semibold">
                        Sources
                      </span>
                      <span className="text-sm">
                        {course.topics.length > 0
                          ? course.urls
                              .map((source) => capitalize(source.name))
                              .join("| ")
                          : "-"}
                      </span>
                    </section>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};
