import type { ReactNode } from "react";

import { tw } from "@lightit/shared";

import { SIZE } from "../shared.types";
import type { Size } from "../shared.types";

export interface ChipProps {
  size?: Size;
  children?: ReactNode;
  className?: string;
}

export const Chip = ({
  size = SIZE.SMALL,
  children,
  className,
  ...props
}: ChipProps) => {
  return (
    <div
      className={tw(
        "flex h-fit w-fit items-center justify-center gap-1 rounded-md border border-transparent text-xs font-medium",

        size === SIZE.SMALL && "px-2 py-0.5",
        size === SIZE.MEDIUM && "px-2.5 py-1",
        size === SIZE.LARGE && "px-3 py-1.5",

        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
