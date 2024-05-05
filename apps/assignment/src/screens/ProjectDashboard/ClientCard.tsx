import type { FC } from "react";

import { Button, icons } from "@lightit/ui";

export interface ClientCardProps {
  clientName: string;
  clientImage?: string;
  startDate?: string;
  projects?: number;
  onViewClient: () => void;
}

export const ClientCard: FC<ClientCardProps> = ({
  clientName,
  startDate,
  projects,
  onViewClient,
}) => {
  return (
    <Button
      variant="secondary"
      className="group flex flex-col gap-8 rounded-lg bg-white p-4 shadow-full transition-shadow hover:bg-neutrals-light-200 hover:opacity-80 hover:shadow-xl"
      onClick={() => onViewClient()}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between">
          <span className="truncate text-lg font-semibold text-neutrals-dark-500">
            {clientName}
          </span>
        </div>

        <div className="mt-1 flex flex-row items-center justify-between gap-2">
          <div className="flex flex-row items-center justify-start gap-1">
            <icons.CalendarIcon className="h-4 w-4 text-neutrals-dark-200" />
            <span className="text-xs text-neutrals-dark-200">
              Created {startDate}
            </span>
          </div>
          <div className="flex flex-row items-center justify-start gap-1">
            <icons.FolderIcon className="h-4 w-4 text-neutrals-dark-200" />
            <span className="text-xs text-neutrals-dark-200">
              {projects} projects
            </span>
          </div>
        </div>
      </div>
    </Button>
  );
};
