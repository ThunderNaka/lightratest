import type { ReactNode } from "react";

import { tw } from "@lightit/shared";
import { IconWrapper } from "@lightit/ui";
import { SIZE } from "@lightit/ui/src/shared.types";

interface GanttBarContentProps {
  icon: ReactNode;
  data: string;
  compact?: boolean;
  notesIcon?: ReactNode;
  deleted?: boolean;
}

export const AssignmentGanttBarContent = ({
  icon,
  data,
  compact,
  notesIcon,
  deleted,
}: GanttBarContentProps) => {
  return (
    <div
      className={tw(
        "flex items-center justify-start gap-2 overflow-hidden px-2",
        compact && "justify-center px-0",
      )}
    >
      <IconWrapper
        size={SIZE.SMALL}
        className="shrink-0 rounded-full bg-white p-0.5 shadow-sm group-focus:text-neutrals-dark-500"
      >
        {icon}
      </IconWrapper>

      {!compact && (
        <span
          className={tw("grow truncate text-left", deleted && "line-through")}
        >
          {data}
        </span>
      )}

      {notesIcon}
    </div>
  );
};
