import React, { useEffect, useRef, useState } from "react";
import type { ForwardedRef } from "react";
import * as Portal from "@radix-ui/react-portal";
import { format, isValid, parse } from "date-fns";
import { useWatch } from "react-hook-form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { useForwardRef, useOnInteractOutside } from "@lightit/hooks";
import { forwardRef, tw } from "@lightit/shared";

import { icons } from "../common";
import { DatePicker } from "./DatePicker";
import { Input } from "./Input";
import type { InputProps } from "./Input";

// This function creates a fake change event and triggers it, based on this solution:
// https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-change-or-input-event-in-react-js-from-jquery-or
const _triggerFakeInputChangeEvent = (el: HTMLInputElement, value: string) => {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;
  nativeInputValueSetter?.call(el, value);

  const fakeEvent = new Event("input", { bubbles: true });
  el.dispatchEvent(fakeEvent);
};

export interface DatePickerInputProps<TFieldValues extends FieldValues>
  extends InputProps {
  name: FieldPath<TFieldValues>;
  dateFormat?: string;
  control: Control<TFieldValues>;
  changeCallback?: () => void;
}

export const DatePickerInput = forwardRef(
  <TFieldValues extends FieldValues>(
    {
      onClick,
      onFocus,
      onChange,
      dateFormat = "dd/MM/yy",
      control,
      containerClassName,
      changeCallback,
      ...props
    }: DatePickerInputProps<TFieldValues>,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const fieldValue = useWatch<TFieldValues>({
      control,
      name: props.name,
    });
    const dateSelected = !fieldValue
      ? new Date()
      : parse(fieldValue, dateFormat, new Date());

    const [_month, setMonth] = useState(dateSelected);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const datePickerRef = useRef(null);
    const forwardedRef = useForwardRef<HTMLInputElement>(ref);
    const rootRef = useRef<HTMLDivElement>(null);

    useOnInteractOutside(
      () => setIsPickerOpen(false),
      datePickerRef,
      forwardedRef,
    );

    useEffect(() => {
      const parents: ParentNode[] = [];
      const onScrollListener = () => {
        setIsPickerOpen(false);
      };

      const recursiveAttachment = (el?: ParentNode | null) => {
        if (el && isPickerOpen) {
          el.addEventListener("scroll", onScrollListener);
          parents.push(el);
          recursiveAttachment(el.parentNode);
        }
      };
      recursiveAttachment(rootRef.current);

      return () => {
        parents.forEach((el) => {
          el.removeEventListener("scroll", onScrollListener);
        });
      };
    }, [setIsPickerOpen, isPickerOpen]);

    const [coords, setCoords] = useState<{ left: number; top: number }>();

    const setCoordinates = (
      e:
        | React.MouseEvent<HTMLInputElement, MouseEvent>
        | React.FocusEvent<HTMLInputElement, Element>,
    ) => {
      const inputElement = e.target as HTMLInputElement;
      const rect = inputElement.getBoundingClientRect();
      setCoords({
        left: rect.x + (rect.width - 250) / 2,
        top:
          rect.y > window.screen.height * 0.5
            ? rect.y - 307
            : rect.y + rect.height + 20,
      });
    };

    return (
      <div className={tw("w-full", containerClassName)} ref={rootRef}>
        <Input
          left={<icons.CalendarDaysIcon className="text-primary-white-600" />}
          ref={forwardedRef}
          {...props}
          onChange={(e) => {
            onChange?.(e);
            const newDate = parse(e.target.value, dateFormat, new Date());

            if (isValid(newDate)) {
              setMonth(newDate);
            }
          }}
          autoComplete="off"
          onClick={(e) => {
            if (!props.readOnly) {
              setCoordinates(e);
              onClick?.(e);
              setIsPickerOpen(true);
            }
          }}
          onFocus={(e) => {
            if (!props.readOnly) {
              setCoordinates(e);
              setIsPickerOpen(true);
              onFocus?.(e);
            }
          }}
        />
        {isPickerOpen && (
          <Portal.Root
            ref={datePickerRef}
            className="absolute z-20"
            style={coords}
          >
            <DatePicker
              onChange={(newDate) => {
                if (newDate !== undefined && forwardedRef.current) {
                  // We were _forced_ to create a fake onchange event and trigger it
                  _triggerFakeInputChangeEvent(
                    forwardedRef.current,
                    format(newDate, "dd/MM/yy"),
                  );
                  if (changeCallback) changeCallback();
                }
              }}
              value={dateSelected}
            />
          </Portal.Root>
        )}
      </div>
    );
  },
);
