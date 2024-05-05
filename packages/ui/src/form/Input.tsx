import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from "react";

import { forwardRef, tw } from "@lightit/shared";

import { icons, IconWrapper, Tooltip } from "../common";
import { SIZE } from "../shared.types";
import type { Size } from "../shared.types";
import { Label } from "./Label";
import { Message } from "./Message";
import type { FormErrorType } from "./Message";

export interface InputProps
  extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  containerClassName?: string;
  error?: FormErrorType;
  iconClassName?: string;
  label?: ReactNode;
  left?: ReactNode;
  message?: string;
  readOnlyPlaceholder?: string;
  right?: ReactNode;
  rightWidth?: number;
  size?: Size;
  requiredMarker?: boolean;
}

export const Input = forwardRef(
  (
    {
      className,
      containerClassName,
      error,
      id,
      label,
      left,
      message,
      placeholder,
      readOnly,
      readOnlyPlaceholder = "-",
      right,
      size = SIZE.MEDIUM,
      style,
      requiredMarker,
      ...rest
    }: InputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <div
        style={style}
        className={tw(
          "relative flex flex-col gap-1.5 text-neutrals-dark-400",
          containerClassName,
        )}
      >
        {!!label && (
          <Label
            htmlFor={id}
            label={label}
            className={tw(readOnly && "text-neutrals-dark-300")}
            requiredMarker={requiredMarker}
          />
        )}

        <div className="relative flex flex-row items-center rounded-md">
          {left && (
            <IconWrapper
              size={size}
              className={tw(
                "pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-neutrals-medium",
                readOnly && "hidden",
              )}
            >
              {left}
            </IconWrapper>
          )}

          <input
            ref={ref}
            type="text"
            readOnly={readOnly}
            placeholder={readOnly ? readOnlyPlaceholder : placeholder}
            {...rest}
            className={tw(
              "block w-full rounded-md border border-neutrals-medium-300 text-sm shadow-sm placeholder:text-neutrals-medium focus:border-secondary-400 focus:outline-none focus:ring-4 focus:ring-secondary-100",
              !!error &&
                "border-alert-error focus:border-alert-error focus:ring-complementary-red-50",

              !!rest.disabled &&
                !readOnly &&
                "cursor-not-allowed border-neutrals-medium-300 bg-primary-white text-neutrals-dark-200",

              size === "sm" && "py-2",
              size === "md" && "py-3",
              size === "lg" && "py-4",

              left &&
                ((size === "sm" && "pl-11") ||
                  (size === "md" && "pl-12") ||
                  (size === "lg" && "pl-12")),

              (!!right || error) &&
                ((size === "sm" && "pr-11") ||
                  (size === "md" && "pr-12") ||
                  (size === "lg" && "pr-12")),

              readOnly &&
                "border-transparent px-0 font-medium text-neutrals-dark-500 shadow-none focus:border-transparent focus:ring-0",

              className,
            )}
          />

          {right && !error && (
            <IconWrapper
              size={size}
              className="pointer-events-none absolute right-4 top-1/2 flex -translate-y-1/2 items-center text-neutrals-medium"
            >
              {right}
            </IconWrapper>
          )}

          {error && (
            <Tooltip
              content={error}
              side="bottom"
              align="end"
              className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center"
              contentClassName="text-complementary-red-500"
            >
              <IconWrapper size={size} className=" text-complementary-red-500">
                <icons.ExclamationCircleIcon />
              </IconWrapper>
            </Tooltip>
          )}
        </div>

        {message && <Message message={message} />}
      </div>
    );
  },
);
