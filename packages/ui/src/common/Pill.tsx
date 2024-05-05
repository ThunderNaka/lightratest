import type { ComponentPropsWithoutRef } from "react";

import { tw } from "@lightit/shared";

import { icons } from "./Icons";

export type PillProps = ComponentPropsWithoutRef<"button"> & {
  onClose?: () => void;
  textClassName?: string;
  disabled?: boolean;
};

export const Pill = ({
  children,
  className,
  textClassName,
  disabled,
  onClose,
  ...props
}: PillProps) => (
  <button
    className={tw(
      "flex max-w-full cursor-auto flex-row items-center justify-center",
      "bg-accent gap-2 rounded-full px-4 py-2",
      "text-accent-content text-base font-medium uppercase leading-tight shadow-md",
      disabled ? "bg-opacity-50" : "bg-accent-focus",
      !!onClose && "pr-2",
      !!props.onClick && "cursor-pointer select-none",
      className,
    )}
    {...props}
  >
    <span
      className={tw(
        "overflow-hidden text-ellipsis whitespace-nowrap",
        textClassName,
      )}
    >
      {children}
    </span>
    {onClose && (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();

          onClose();
        }}
      >
        <icons.XMarkIcon className="h-4 w-4" />
      </button>
    )}
  </button>
);
