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
import {
  DropdownMenu,
  icons,
  Pagination,
  ScrollArea,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
} from "@lightit/ui";

import type { ProjectWithEmployees } from "~/api/projects";
import { MODAL_ROUTES, ROUTES, useNavigateModal } from "~/router";
import { PROJECT_STATUS } from "~/shared.constants";
import EmptyState from "./ProjectTable/EmptyState";
import ProjectTableRow from "./ProjectTable/ProjectTableRow";

interface Pagination extends PaginationState {
  count: number;
  total: number;
  totalPages: number;
}

interface ProjectViewTableProps {
  isLoadingData: boolean;
  pagination: Pagination;
  sorting: SortingState;
  projects?: ProjectWithEmployees[];
  onPaginationChange?: (updatedPagination: PaginationState) => void;
  onSortingChange?: (updatedSorting: SortingState) => void;
}

export const ProjectViewTable = ({
  isLoadingData,
  pagination,
  sorting,
  projects,
}: ProjectViewTableProps) => {
  const { count, total, pageIndex, pageSize, totalPages } = pagination;

  const navigateModal = useNavigateModal();

  const columns: ColumnDef<ProjectWithEmployees>[] = [
    {
      accessorKey: "projectName",
      id: "project.name",
      cell: ({ row }) => (
        <Link to={`${ROUTES.projectsNew}/${row.original.id}`}>
          <span className="grow truncate">{row.original.name}</span>
        </Link>
      ),
      header: "Project name",
    },
    {
      accessorKey: "trafficStatus",
      id: "project.status",
      cell: ({ row }) => (
        <div
          className={tw(
            "flex w-28 items-center justify-center rounded-md py-0.5",
            row.original.status === PROJECT_STATUS.ARCHIVED &&
              "bg-complementary-red-100 text-complementary-red-600",
            row.original.status === PROJECT_STATUS.ACTIVE &&
              "bg-complementary-green-200 text-alert-success-800",
            row.original.status === PROJECT_STATUS.PAUSED &&
              "bg-complementary-yellow-200 text-complementary-orange-500",
          )}
        >
          <span className="truncate font-medium capitalize">On track</span>
        </div>
      ),
      header: "Traffic status",
    },
    {
      accessorKey: "clientName",
      id: "client.name",
      cell: ({ row }) => {
        const client = row.original.client;
        if (!client) return null;

        return (
          <Link
            to={`${ROUTES.clients}/${client.id}`}
            className="flex items-center gap-2 text-complementary-blue-600 underline-offset-2"
          >
            <icons.PresentationChartBarIcon className="h-4 w-4 stroke-[2]" />
            <span className="grow truncate capitalize underline">
              {client.name}
            </span>
          </Link>
        );
      },
      header: "Client name",
    },
    {
      accessorKey: "projectType",
      id: "project.type",
      cell: ({ row }) => (
        <span className="grow truncate capitalize">{row.original.type}</span>
      ),
      header: "Type",
    },
    {
      accessorKey: "projectTopics",
      id: "project.type",
      cell: ({ row }) => (
        <span className="grow truncate capitalize">{row.original.type}</span>
      ),
      header: "Topics",
    },
    {
      accessorKey: "projectTechnologies",
      id: "project.technologies",
      cell: ({ row }) => (
        <p className="grow truncate">
          {row.original.technologies.map((tech, i) => (
            <span key={tech.id}>
              {tech.name}
              {i < row.original.technologies.length - 1 && ", "}
            </span>
          ))}
        </p>
      ),
      header: "Technologies",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu
          options={[
            {
              label: "Edit",
              left: <icons.PencilSquareIcon className="h-5 w-5 stroke-2" />,
              onClick: () =>
                navigateModal(`${MODAL_ROUTES.projectForm}/${row.original.id}`),
            },
            {
              label: "Current assignments",
              left: <icons.UserIcon className="h-5 w-5 stroke-2" />,
              onClick: () =>
                navigateModal(
                  `${MODAL_ROUTES.currentAssignments}/${row.original.id}`,
                ),
            },
            {
              label: "Delete",
              left: <icons.TrashIcon className="h-5 w-5 stroke-2" />,
            },
          ]}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: projects ?? [],
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
            {isLoadingData && (
              <TableSkeleton
                pageSize={table.getState().pagination.pageSize}
                columnsLength={table.getAllColumns().length}
              />
            )}
            {table.getRowModel().rows?.length && !isLoadingData ? (
              table
                .getRowModel()
                .rows.map((row) => (
                  <ProjectTableRow row={row} key={row.original.id} />
                ))
            ) : (
              <EmptyState length={columns.length} />
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
