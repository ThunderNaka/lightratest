import type { ComponentPropsWithoutRef, FC, ReactNode } from "react";

import { tw } from "@lightit/shared";

export interface LabelProps extends ComponentPropsWithoutRef<"label"> {
  label: ReactNode;
  containerClassName?: string;
  requiredMarker?: boolean;
}

export const Label: FC<LabelProps> = ({
  label,
  containerClassName,
  className,
  requiredMarker = false,
  ...props
}) => (
  <div className={tw("flex", containerClassName)}>
    {typeof label !== "string" ? (
      label
    ) : (
      <label
        {...props}
        className={tw("text-sm font-medium text-neutrals-dark-900", className)}
      >
        {label}
        {requiredMarker && (
          <span className="text-complementary-red-500"> *</span>
        )}
      </label>
    )}
  </div>
);
