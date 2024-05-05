import type { ComponentPropsWithoutRef } from "react";

import { tw } from "@lightit/shared";

export interface TabProps extends ComponentPropsWithoutRef<"button"> {
  value: string;
  isSelected: boolean;
}

export const Tab = ({ value, isSelected, className, ...props }: TabProps) => (
  <button
    type="button"
    className={tw(
      "focus-visible:none inline-flex items-center border-b-2 px-4 py-6 text-base font-medium capitalize leading-4 focus:outline-none",
      isSelected
        ? "border-secondary text-neutrals-dark-900"
        : "border-transparent text-neutrals-dark-200",
      className,
    )}
    aria-current={isSelected ? "page" : undefined}
    {...props}
  >
    {value}
  </button>
);
