import { TableCell, TableRow } from "@lightit/ui";

interface EmptyStateProps {
  length: number;
}

const EmptyState = ({ length }: EmptyStateProps) => (
  <TableRow>
    <TableCell colSpan={length} className="h-24 text-center">
      No statement to show.
    </TableCell>
  </TableRow>
);

export default EmptyState;
