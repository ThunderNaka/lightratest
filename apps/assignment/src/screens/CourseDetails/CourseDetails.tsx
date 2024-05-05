import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { ColumnSort, PaginationState } from "@tanstack/react-table";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { tw } from "@lightit/shared";
import {
  Button,
  icons,
  Loading,
  PopupBox,
  Tabs,
  Typography,
} from "@lightit/ui";

import { deleteCourse, getCourseWithAssignmentsQuery } from "~/api/courses";
import { Breadcrumbs } from "~/components";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { ROUTES } from "~/router";
import { errorToast, getSortingParams } from "~/utils";
import { AssignmentsTable } from "./AssignmentsTable";
import { CourseItem } from "./CourseItem";

const tabs = ["Assignments"] as const; // delete ["Activity", "Comments"] for the moment
type Tabs = (typeof tabs)[number];

export const CourseDetails = () => {
  const { hasPermission } = usePermissions();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeStatusFilter, setActiveStatusFilter] = useState<Tabs>(tabs[0]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = +(searchParams.get("page") ?? 1);
  const pageSize = +(searchParams.get("pageSize") ?? 8);
  const sort = searchParams.get("sort") ?? "-createdAt";
  const sorting = getSortingParams(sort);

  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId ? parseInt(params.courseId) : undefined;

  const { data, isLoading } = useQuery({
    ...getCourseWithAssignmentsQuery(courseId),
    onError: errorToast,
  });

  const { mutate: deleteCourseMutation } = useMutation({
    mutationFn: deleteCourse.mutation,
    onSuccess: () => {
      setConfirmDelete(false);
      navigate(-1);
    },
    onError: errorToast,
  });

  const course = data?.data;

  const pagination = {
    pageSize,
    pageIndex: page - 1,
    count: data?.pagination?.count ?? 0,
    total: data?.pagination?.total ?? 0,
    totalPages: data?.pagination?.totalPages ?? 0,
  };

  const handlePaginationChange = (params: PaginationState) => {
    setSearchParams((prev) => {
      !Number.isNaN(params.pageIndex)
        ? prev.set("page", `${params.pageIndex + 1}`)
        : prev.delete("page");
      !Number.isNaN(params.pageSize)
        ? prev.set("pageSize", `${params.pageSize}`)
        : prev.delete("pageSize");

      return prev;
    });
  };

  const handleSortingChange = (params: ColumnSort[]) => {
    const updatedSort = params[0];

    setSearchParams((prev) => {
      if (updatedSort) {
        prev.set("sort", `${updatedSort.desc ? "-" : ""}${updatedSort.id}`);
      } else {
        prev.delete("sort");
      }

      return prev;
    });
  };

  if (!course || isLoading) {
    return (
      <div className="relative h-full">
        <Loading />
      </div>
    );
  }
  return (
    <div className="flex grow flex-col gap-6 p-8">
      <header className="flex flex-col gap-4">
        <Breadcrumbs
          pages={[
            { name: "Home", href: ROUTES.base },
            {
              name: "Learning Center",
              href: ROUTES.learningCenter.coursesList,
            },
            {
              name: course?.description ?? "Course Details",
              href: `${ROUTES.learningCenter.coursesList}/${courseId}`,
            },
          ]}
        />

        <div className="flex items-center justify-between">
          <Typography font="bold" className="text-3xl">
            {course.name}
          </Typography>

          {hasPermission(PERMISSIONS.createTeamAssignment) && (
            <div className="flex flex-row">
              <Button
                className="mr-2 border-red-500 bg-transparent text-red-500 hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white"
                onClick={() => setConfirmDelete(true)}
              >
                Delete Course
              </Button>
              <Button
                className=""
                onClick={() => {
                  navigate(
                    `${ROUTES.learningCenter.coursesList}/${course.id}/edit`,
                  );
                }}
              >
                Edit Course
              </Button>
            </div>
          )}
        </div>
      </header>

      <CourseItem course={course} />

      <div className="mt-6">
        <div className="rounded-t-xl border-l-2 border-r-2 border-t-2 px-6 py-4">
          <Tabs
            className="gap-1"
            tabs={tabs}
            value={activeStatusFilter}
            onChange={(status) => {
              setActiveStatusFilter(status);
            }}
            renderTab={({ tab, onClick, selected }) => (
              <div
                key={tab}
                className={tw(
                  selected && "border-b-[3px] border-nostalgia-purple-900",
                )}
              >
                <Button
                  variant={selected ? "outline-white" : "tertiary-link"}
                  className={tw(
                    "border-0 px-4 py-2 text-sm text-neutrals-medium hover:bg-transparent  focus:ring-0",
                    selected && "text-nostalgia-purple-900 focus:ring-0",
                  )}
                  onClick={onClick}
                >
                  {tab}
                </Button>
              </div>
            )}
          />
        </div>
        <div className="flex items-center justify-between border-2 border-b-0 px-6 py-4">
          <Typography className="text-base font-medium text-black">
            {`Assignments (${course.assignmentsCount})`}
          </Typography>
          <Button variant="secondary" className="">
            Add Assignment
          </Button>
        </div>

        <AssignmentsTable
          assignments={course.assignments}
          isLoadingData={isLoading}
          pagination={pagination}
          sorting={sorting}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />

        <PopupBox
          show={confirmDelete}
          boxType="confirm"
          title=""
          onClose={() => {
            setConfirmDelete(false);
          }}
          onConfirm={() => {
            deleteCourseMutation(course.id);
          }}
          renderMessage={() => (
            <div className="flex flex-col items-center justify-center">
              <div className="mx-auto mb-5 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-complementary-red-50 text-alert-error-500 sm:mx-0 sm:h-10 sm:w-10">
                <icons.ExclamationTriangleIcon
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              </div>
              <Typography font="bold" variant="xlarge">
                Delete Course
              </Typography>
              {course.assignmentsCount > 0 && (
                <Typography className="mt-2.5 text-center">
                  {`This course has ${course.assignmentsCount} ${
                    course.assignmentsCount !== 1 ? "assignments" : "assignment"
                  } in progress. Do you still want to delete it?`}
                </Typography>
              )}
            </div>
          )}
          renderButtonGroup={({ onCancel, onConfirm, initialFocus }) => (
            <div className="mt-6 flex flex-row justify-center">
              <Button
                size="sm"
                onClick={onCancel}
                variant="outline"
                className="mr-2 "
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={onConfirm}
                className="ml-2"
                ref={initialFocus}
              >
                Delete
              </Button>
            </div>
          )}
        />
      </div>
    </div>
  );
};
