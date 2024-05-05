import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from "react";

import { forwardRef, tw } from "@lightit/shared";

import { Label } from "./Label";

interface CheckboxProps extends ComponentPropsWithoutRef<"input"> {
  label?: ReactNode;
}

export const Checkbox = forwardRef(
  (
    { label, id, className, ...props }: CheckboxProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        ref={ref}
        className={tw(
          "h-4 w-4 rounded border border-neutrals-medium-500 text-secondary-600 focus:ring-transparent",
          className,
        )}
        {...props}
      />
      {!!label && <Label htmlFor={id} label={label} />}
    </div>
  ),
);
