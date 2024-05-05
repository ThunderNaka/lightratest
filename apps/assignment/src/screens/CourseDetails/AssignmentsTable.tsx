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
import { Link } from "react-router-dom";

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
} from "@lightit/ui";

import type { AssignmentsWithEmployee } from "~/api/courses";
import { ROUTES } from "~/router";
import { formatBackendDate, formatBackendDateToVerbose } from "~/utils";

interface Pagination extends PaginationState {
  count: number;
  total: number;
  totalPages: number;
}

interface AssignmentsTableProps {
  isLoadingData: boolean;
  pagination: Pagination;
  sorting: SortingState;
  assignments: AssignmentsWithEmployee[];
  onPaginationChange: (updatedPagination: PaginationState) => void;
  onSortingChange: (updatedSorting: SortingState) => void;
}

export const AssignmentsTable = ({
  isLoadingData,
  pagination,
  sorting,
  assignments,
  onPaginationChange,
  onSortingChange,
}: AssignmentsTableProps) => {
  const { count, total, pageIndex, pageSize, totalPages } = useMemo(
    () => pagination,
    [pagination],
  );

  const statementsTableData = useMemo(() => assignments ?? [], [assignments]);

  const columns = useMemo<ColumnDef<AssignmentsWithEmployee>[]>(
    () => [
      {
        accessorKey: "createdAt",
        accessorFn: (assignment) =>
          formatBackendDateToVerbose(assignment.createdAt),
        header: "Created at",
      },
      // TODO: pending
      // {
      //   accessorKey: "assignedBy",
      //   id: "assignedBy.name",
      //   cell: ({ row }) => {
      //     const assignedBy = row.original.assignedById;
      //     if (row.original.type === "timeOff") {
      //       return <span className="grow truncate">Bamboo</span>;
      //     }
      //     if (!assignedBy) return null;
      //     return (
      //       <Link
      //         to={`${ROUTES.employees}/${assignedBy.id}`}
      //         className="underline-offset-2 hover:underline"
      //       >
      //         <span className="grow truncate">{assignedBy.name}</span>
      //       </Link>
      //     );
      //   },
      //   header: "Assigned by",
      // },
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
        accessorKey: "startDate",
        accessorFn: (assignment) => formatBackendDate(assignment.fromDate),
        header: "Start date",
      },
      {
        accessorKey: "toDate",
        accessorFn: (assignment) => formatBackendDate(assignment.toDate),
        header: "Due date",
      },
      {
        accessorKey: "hours",
        accessorFn: (assignment) =>
          `${assignment.hours}${assignment.hours === 1 ? "h" : "hs"}`,
        header: "Daily Hours",
      },
      {
        accessorKey: "status",
        id: "status",
        cell: ({ row }) => {
          return (
            <Chip
              size="sm"
              className={
                row.original.employee?.email !== "available"
                  ? "bg-complementary-green-200 text-complementary-green-900"
                  : "bg-complementary-red-50 text-complementary-red-600"
              }
            >
              {capitalize("completed")}
            </Chip>
          );
        },
        header: "Status",
      },
      {
        id: "actions",
        cell: () => (
          <DropdownMenu
            options={[
              {
                label: "View detail",
                left: <icons.EyeIcon className="h-5 w-5 stroke-2" />,
                disabled: true,
              },
              {
                label: "Delete assignation",
                left: <icons.TrashIcon className="h-5 w-5 stroke-2" />,
                disabled: true,
              },
            ]}
          />
        ),
      },
    ],

    [],
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
    <div className="flex grow flex-col divide-y-2 rounded-b-xl border-2 border-t-0">
      <ScrollArea className="h-0 min-h-[500px] grow">
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
                  No assignments to show.
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
