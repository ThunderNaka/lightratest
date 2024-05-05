import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from "react";

import { forwardRef, tw } from "@lightit/shared";

import { Label } from "./Label";
import { Message } from "./Message";
import type { FormErrorType } from "./Message";

export interface SelectProps<
  TOptionsValue extends string = string,
  TValue extends TOptionsValue = TOptionsValue,
> extends ComponentPropsWithoutRef<"select"> {
  options:
    | { value: TOptionsValue; label: string; disabled?: boolean }[]
    | readonly {
        readonly value: TOptionsValue;
        readonly label: string;
        disabled?: boolean;
      }[];
  id: string;
  label?: ReactNode;
  containerClassName?: string;
  value?: TValue;
  emptyOption?: string;
  message?: string;
  compact?: boolean;
  error?: FormErrorType;
  disableEmptyOption?: boolean;
}

export const LegacySelect = forwardRef(
  <TOptionsValue extends string, TValue extends TOptionsValue>(
    {
      label,
      message,
      error,
      id,
      emptyOption = "Select an Option",
      compact,
      style,
      containerClassName = "",
      className,
      options,
      disableEmptyOption = false,
      ...rest
    }: SelectProps<TOptionsValue, TValue>,
    ref: ForwardedRef<HTMLSelectElement>,
  ) => (
    <div style={style} className={tw("flex flex-col", containerClassName)}>
      {!!label && <Label htmlFor={id} label={label} />}
      <select
        ref={ref}
        className={tw(
          "shadow-xs placeholder:text-black-300 placeholder-black-300 block w-full rounded-md border-gray-300 focus:border-secondary-400 focus:ring-4 focus:ring-secondary-100 sm:text-sm",
          className,
          !!error && "border-red-500 focus:border-red-500 focus:ring-red-200",
        )}
        id={id}
        {...rest}
      >
        {emptyOption && (
          <option disabled={disableEmptyOption} value="">
            {emptyOption}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
      {!compact && <Message message={message} error={error} />}
    </div>
  ),
);
