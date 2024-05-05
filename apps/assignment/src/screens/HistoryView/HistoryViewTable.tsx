import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Link } from "react-router-dom";

import { tw } from "@lightit/shared";
import { useToastStore } from "@lightit/toast";
import {
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
} from "@lightit/ui";

import type { HistoryViewAssignment } from "~/api/assignments";
import { deleteAssignment } from "~/api/assignments";
import { ConfirmDelete } from "~/components";
import { MODAL_ROUTES, ROUTES, useNavigateModal } from "~/router";
import { ASSIGNMENT_TYPE } from "~/shared.constants";
import { errorToast, formatBackendDateToVerbose } from "~/utils";
import { NotificationSwitch } from "./NotificationSwitch";

interface Pagination extends PaginationState {
  count: number;
  total: number;
  totalPages: number;
}

interface HistoryViewTableProps {
  isLoadingData: boolean;
  pagination: Pagination;
  sorting: SortingState;
  assignments?: HistoryViewAssignment[];
  onPaginationChange: (updatedPagination: PaginationState) => void;
  onSortingChange: (updatedSorting: SortingState) => void;
}

export const HistoryViewTable = ({
  isLoadingData,
  pagination,
  sorting,
  assignments,
  onPaginationChange,
  onSortingChange,
}: HistoryViewTableProps) => {
  const { count, total, pageIndex, pageSize, totalPages } = useMemo(
    () => pagination,
    [pagination],
  );
  const [deleteId, setDeleteId] = useState<number>();

  const statementsTableData = useMemo(() => assignments ?? [], [assignments]);

  const navigateModal = useNavigateModal();

  const { pushToast } = useToastStore();
  const queryClient = useQueryClient();
  const { mutate: deleteAssignmentMutation } = useMutation({
    mutationFn: deleteAssignment.mutation,
    onSuccess: (_, id) => {
      deleteAssignment.invalidates(queryClient, {
        assignmentId: id,
      });
      setDeleteId(undefined);
      void pushToast({
        type: "success",
        title: "Deletion Complete",
        message: "Assignment successfully deleted",
      });
    },
    onError: errorToast,
  });

  const columns = useMemo<ColumnDef<HistoryViewAssignment>[]>(
    () => [
      {
        accessorKey: "updatedAt",
        accessorFn: (assignment) =>
          formatBackendDateToVerbose(assignment.updatedAt),
        header: "Updated at",
      },
      {
        accessorKey: "assignedBy",
        id: "assignedBy.name",
        cell: ({ row }) => {
          const assignedBy = row.original.assignedBy;
          if (row.original.type === "timeOff") {
            return <span className="grow truncate">Bamboo</span>;
          }
          if (!assignedBy) return null;
          return (
            <Link
              to={`${ROUTES.employees}/${assignedBy.id}`}
              className="underline-offset-2 hover:underline"
            >
              <span className="grow truncate">{assignedBy.name}</span>
            </Link>
          );
        },
        header: "Assigned by",
      },
      {
        accessorKey: "assignee",
        id: "employee.name",
        cell: ({ row }) => {
          const employee = row.original.employee;
          if (!employee) return null;

          return (
            <Link
              to={`${ROUTES.employees}/${employee.id}`}
              className="underline-offset-2 hover:underline"
            >
              <span className="grow truncate">{employee.name}</span>{" "}
            </Link>
          );
        },
        header: "Assignee",
      },
      {
        accessorKey: "assignedTo",
        id: "project.name",
        cell: ({ row }) => {
          const assignment =
            (row.original.type === ASSIGNMENT_TYPE.PROJECT ||
              row.original.type === ASSIGNMENT_TYPE.COURSE) &&
            row.original.assignable;
          if (row.original.type === ASSIGNMENT_TYPE.TIME_OFF) {
            return <span className="grow truncate">Time Off</span>;
          }
          if (!assignment) return null;

          return (
            <Link
              to={
                row.original.type === ASSIGNMENT_TYPE.PROJECT
                  ? `${ROUTES.projects.base}/${assignment.id}`
                  : `${ROUTES.learningCenter.coursesList}?searchText=${assignment.name}`
              }
              className="flex items-center gap-2 text-complementary-blue-600 underline underline-offset-2"
            >
              <icons.LightBulbIcon className="h-4 w-4 shrink-0" />
              <span className="truncate">{assignment.name}</span>
            </Link>
          );
        },
        header: "Assigned to",
      },
      {
        accessorKey: "fromDate",
        accessorFn: (assignment) =>
          formatBackendDateToVerbose(assignment.fromDate),
        header: "Form date",
      },
      {
        accessorKey: "toDate",
        accessorFn: (assignment) =>
          formatBackendDateToVerbose(assignment.toDate),
        header: "Due date",
      },
      {
        accessorKey: "hours",
        accessorFn: (assignment) =>
          `${assignment.hours} ${assignment.hours === 1 ? "hour" : "hours"}`,
        header: "Hours / Days",
      },
      {
        id: "isNotified",
        accessorKey: "notified",
        cell: ({ row }) => (
          <NotificationSwitch
            key={`HistoryView-isNotified-${row.original.id}`}
            assignment={row.original}
          />
        ),
        header: "Notified",
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu
            options={[
              {
                label: "View detail",
                left: <icons.EyeIcon className="h-5 w-5 stroke-2" />,
                onClick: () =>
                  navigateModal(
                    `${MODAL_ROUTES.assignmentDetails}/${row.original.id}`,
                  ),
              },
              {
                label: "Delete assignation",
                left: <icons.TrashIcon className="h-5 w-5 stroke-2" />,
                onClick: () => setDeleteId(row.original.id),
              },
            ]}
          />
        ),
      },
    ],

    [navigateModal],
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
                  No statement to show.
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
      <ConfirmDelete
        label="assignation"
        show={!!deleteId}
        onClose={() => {
          setDeleteId(undefined);
        }}
        onConfirm={() => {
          if (deleteId) deleteAssignmentMutation(deleteId);
        }}
      />
    </div>
  );
};
