import { Skeleton, TableCell, TableRow } from "./";

export const TableSkeleton = ({
  pageSize,
  columnsLength,
}: {
  pageSize: number;
  columnsLength: number;
}) => {
  const rows = Array.from({ length: pageSize }, (_, index) => (
    <TableRow key={index}>
      {Array.from({ length: columnsLength }, (_, idx) => (
        <TableCell key={idx} className="h-[4.375rem]">
          <Skeleton className="h-3" />
        </TableCell>
      ))}
    </TableRow>
  ));

  return rows;
};
