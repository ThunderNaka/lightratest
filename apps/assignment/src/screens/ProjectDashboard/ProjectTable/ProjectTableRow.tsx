import { flexRender } from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";

import { TableCell, TableRow } from "@lightit/ui";

import type { ProjectWithEmployees } from "~/api/projects";

interface ProjectTableRowProps {
  row: Row<ProjectWithEmployees>;
}

const ProjectTableRow = ({ row }: ProjectTableRowProps) => (
  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
    {row.getVisibleCells().map((cell) => (
      <TableCell key={cell.id} className="max-w-[160px] truncate last:py-0">
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    ))}
  </TableRow>
);

export default ProjectTableRow;
