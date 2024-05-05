import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { capitalize } from "lodash";
import { Link, useNavigate } from "react-router-dom";

import { tw } from "@lightit/shared";
import {
  Chip,
  DropdownMenu,
  icons,
  Pagination,
  ScrollArea,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
  Typography,
} from "@lightit/ui";

import { MODAL_ROUTES, ROUTES, useNavigateModal } from "~/router";
import type { Course } from "~/shared.types";

interface Pagination extends PaginationState {
  count: number;
  total: number;
  totalPages: number;
}

interface CoursesTableProps {
  isLoadingData: boolean;
  pagination: Pagination;
  sorting: SortingState;
  courses?: Course[];
  onPaginationChange: (updatedPagination: PaginationState) => void;
  onSortingChange: (updatedSorting: SortingState) => void;
}

export const CoursesTable = ({
  isLoadingData,
  pagination,
  sorting,
  courses,
  onPaginationChange,
  onSortingChange,
}: CoursesTableProps) => {
  const { count, total, pageIndex, pageSize, totalPages } = useMemo(
    () => pagination,
    [pagination],
  );
  const navigate = useNavigate();
  const navigateModal = useNavigateModal();

  const statementsTableData = useMemo(() => courses ?? [], [courses]);

  const columns = useMemo<ColumnDef<Course>[]>(
    () => [
      {
        accessorKey: "name",
        accessorFn: (course) => course.name,
        cell: ({ row }) => (
          <Link
            className="hover:underline"
            to={`${ROUTES.learningCenter.coursesList}/${row.original.id}`}
          >
            {row.original.name}
          </Link>
        ),
        header: "Course name",
      },
      {
        accessorKey: "currentAssignments",
        id: "currentAssignments",
        cell: ({ row }) => {
          const assignmentsLabel =
            row.original.assignmentsCount != 1 ? "assignments" : "assignment";
          return (
            <Link
              to={{
                pathname: ROUTES.assignments.historyView,
                search: `type=course&assignable=${row.original.id}-course`,
              }}
            >
              <Typography
                variant="small"
                className="text-neutrals-dark-900 hover:text-complementary-blue-500 hover:underline"
              >{`${row.original.assignmentsCount} ${assignmentsLabel}`}</Typography>
            </Link>
          );
        },
        header: "Current assignments",
      },
      {
        accessorKey: "status",
        id: "status",
        cell: ({ row }) => {
          return (
            <Chip
              size="lg"
              className={
                row.original.status === "available"
                  ? "h-6 w-20 bg-complementary-green-200  text-alert-success-800"
                  : "h-6 w-20 bg-neutrals-light-500  text-primary-600"
              }
            >
              {capitalize(row.original.status)}
            </Chip>
          );
        },
        header: "Status",
      },
      {
        accessorKey: "topics",
        id: "course.topic",
        cell: ({ row }) => {
          const topics = row.original.topics.map((topic) => topic.name);
          return (
            <Typography variant="small" className="text-neutrals-dark-900">
              {topics.length > 0 ? topics.join(", ") : "-"}
            </Typography>
          );
        },
        header: "Topics",
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu
            options={[
              {
                label: "Edit",
                left: <icons.PencilIcon className="h-5 w-5 stroke-2" />,
                onClick: () => {
                  navigate(
                    `${ROUTES.learningCenter.coursesList}/${row.original.id}/edit`,
                  );
                },
              },
              {
                label: "Assign Course",
                left: <icons.UserIcon className="h-5 w-5 stroke-2" />,
                onClick: () =>
                  navigateModal(
                    `${MODAL_ROUTES.newAssignmentForm}/?type=course&assignableId=${row.original.id}`,
                  ),
              },
            ]}
          />
        ),
      },
    ],

    [navigate, navigateModal],
  );

  const table = useReactTable({
    data: statementsTableData,
    columns,
    manualPagination: true,
    manualSorting: true,
    pageCount: totalPages ?? -1,
    enableSortingRemoval: false,
    state: {
      pagination: { pageIndex, pageSize },
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: (updater) =>
      updater instanceof Function
        ? onPaginationChange(updater({ pageIndex, pageSize }))
        : updater,
    onSortingChange: (updater) =>
      updater instanceof Function ? onSortingChange(updater(sorting)) : updater,
  });

  return (
    <div className="flex grow flex-col divide-y-2">
      <ScrollArea className="h-0 min-h-[19rem] grow">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={tw(
                      header.column.getCanSort() &&
                        "cursor-pointer select-none",
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {!header.isPlaceholder && (
                      <div className="flex items-center gap-2 truncate">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: (
                            <icons.ArrowLongUpIcon className="inline h-3.5 w-3.5 stroke-2" />
                          ),
                          desc: (
                            <icons.ArrowLongDownIcon className="inline h-3.5 w-3.5 stroke-2" />
                          ),
                        }[header.column.getIsSorted() as string] ??
                          (header.column.getCanSort() && (
                            <icons.ArrowsUpDownIcon className="inline h-3.5 w-3.5 stroke-2" />
                          ))}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoadingData ? (
              <TableSkeleton
                pageSize={table.getState().pagination.pageSize}
                columnsLength={table.getAllColumns().length}
              />
            ) : table.getRowModel().rows?.length && !isLoadingData ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={tw(
                        "max-w-[160px] truncate",
                        (cell.column.id === "isNotified" ||
                          cell.column.id === "actions") &&
                          "py-0",
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No courses to show.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      <Pagination
        count={count}
        total={total}
        totalPages={totalPages}
        currentPage={pageIndex + 1}
        pageSize={pageSize}
        onPageChange={(page) => {
          table.setPageIndex(page - 1);
        }}
        onPageSizeChange={table.setPageSize}
      />
    </div>
  );
};
