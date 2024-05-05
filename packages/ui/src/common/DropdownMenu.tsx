import type { ReactNode } from "react";
import * as DropdownMenuPrimitives from "@radix-ui/react-dropdown-menu";

import { tw } from "@lightit/shared";

import { icons } from "./Icons";

export interface Option {
  label: string;
  disabled?: boolean;
  left?: ReactNode;
  right?: ReactNode;
  onClick?: () => void;
}

export interface DropdownMenuProps {
  className?: string;
  options: Option[];
  trigger?: ReactNode;
  onSelect?: (option: Option["label"]) => void;
}

export const DropdownMenu = ({
  className,
  options,
  trigger,
  onSelect,
}: DropdownMenuProps) => {
  return (
    <DropdownMenuPrimitives.Root>
      {trigger ? (
        <DropdownMenuPrimitives.Trigger asChild>
          {trigger}
        </DropdownMenuPrimitives.Trigger>
      ) : (
        <DropdownMenuPrimitives.Trigger
          className={tw(
            "h-7 w-7 cursor-pointer rounded-md duration-300 hover:bg-primary-white-500 data-[state=open]:shadow",
          )}
        >
          <icons.EllipsisVerticalIcon className="m-auto h-5 w-5 stroke-[3] text-primary-200" />{" "}
        </DropdownMenuPrimitives.Trigger>
      )}

      <DropdownMenuPrimitives.Portal>
        <DropdownMenuPrimitives.Content
          side="bottom"
          sideOffset={10}
          align="end"
          alignOffset={-7}
          className={tw(
            "z-50 flex flex-col gap-2 overflow-hidden rounded-2xl bg-primary-white-50 py-4 text-sm font-medium text-neutrals-dark-300 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=right]:slide-in-from-left-2",
            className,
          )}
        >
          {options.map((option) => (
            <DropdownMenuPrimitives.Item
              onSelect={() => onSelect?.(option.label)}
              disabled={option.disabled}
              key={option.label}
              onClick={option.onClick}
              className={tw(
                "flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-50",
                option.disabled && "pointer-events-none opacity-60",
              )}
            >
              {option.left}
              {option.label}
              {option.right}
            </DropdownMenuPrimitives.Item>
          ))}
        </DropdownMenuPrimitives.Content>
      </DropdownMenuPrimitives.Portal>
    </DropdownMenuPrimitives.Root>
  );
};
