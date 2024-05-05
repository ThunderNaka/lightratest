import { useState } from "react";
import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from "react";

import { forwardRef, tw } from "@lightit/shared";

import { icons, IconWrapper, Tooltip } from "../common";
import { SIZE } from "../shared.types";
import type { Size } from "../shared.types";
import { Label } from "./Label";
import { Message } from "./Message";
import type { FormErrorType } from "./Message";

interface TextAreaProps extends ComponentPropsWithoutRef<"textarea"> {
  compact?: boolean;
  containerClassName?: string;
  secondaryContainerClassName?: string;
  tooltipClassName?: string;
  error?: FormErrorType;
  label?: ReactNode;
  message?: string;
  readOnlyPlaceholder?: string;
  size?: Size;
  requiredMarker?: boolean;
  maxCharacters?: number;
}

export const TextArea = forwardRef(
  (
    {
      className,
      containerClassName,
      secondaryContainerClassName,
      tooltipClassName,
      error,
      id,
      label,
      message,
      placeholder,
      readOnly,
      readOnlyPlaceholder = "-",
      size = SIZE.MEDIUM,
      style,
      requiredMarker,
      maxCharacters,
      ...rest
    }: TextAreaProps,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ) => {
    const [count, setCount] = useState(0);

    return (
      <div
        style={style}
        className={tw(
          "flex flex-col gap-1.5 text-neutrals-dark-400",
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

        <div
          className={tw(
            "relative flex h-full flex-row items-center rounded-md",
            secondaryContainerClassName,
          )}
        >
          <textarea
            ref={ref}
            readOnly={readOnly}
            placeholder={readOnly ? readOnlyPlaceholder : placeholder}
            {...rest}
            onChange={(e) => {
              setCount(e.target.value.length);
              if (rest.onChange) rest.onChange(e);
            }}
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

              readOnly &&
                "resize-none border-transparent px-0 font-medium text-neutrals-dark-500 shadow-none focus:border-transparent focus:ring-0",

              className,
            )}
          />

          {error && (
            <Tooltip
              content={error}
              side="bottom"
              align="end"
              className={tw(
                "absolute right-4 top-1/2 flex -translate-y-1/2 items-center",
                tooltipClassName,
              )}
              contentClassName="text-complementary-red-500"
            >
              <IconWrapper size={size} className=" text-complementary-red-500">
                <icons.ExclamationCircleIcon />
              </IconWrapper>
            </Tooltip>
          )}

          {maxCharacters && (
            <span
              className={tw(
                "absolute -bottom-5 right-1 text-xs text-gray-400",
                count > maxCharacters && "text-alert-error",
              )}
            >
              {count}/{maxCharacters}
            </span>
          )}
        </div>

        {message && <Message message={message} />}
      </div>
    );
  },
);
