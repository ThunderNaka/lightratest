import React, { useEffect, useRef, useState } from "react";
import type { ForwardedRef } from "react";
import * as Portal from "@radix-ui/react-portal";
import { useWatch } from "react-hook-form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { useForwardRef, useOnInteractOutside } from "@lightit/hooks";
import { forwardRef, tw } from "@lightit/shared";

import { icons } from "../common";
import { ColorPicker } from "./ColorPicker";
import { Input } from "./Input";
import type { InputProps } from "./Input";

export const getTextColor = (backgroundColor: string) => {
  const [baseColor, intensity] = backgroundColor.split("-");

  if (baseColor && intensity) {
    return parseInt(intensity, 10) < 400 ? "black" : "white";
  }
  return "black";
};

const _triggerFakeInputChangeEvent = (el: HTMLInputElement, value: string) => {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;
  nativeInputValueSetter?.call(el, value);

  const fakeEvent = new Event("input", { bubbles: true });
  el.dispatchEvent(fakeEvent);
};

export interface ColorPickerInputProps<TFieldValues extends FieldValues>
  extends InputProps {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
}

export const ColorPickerInput = forwardRef(
  <TFieldValues extends FieldValues>(
    {
      onClick,
      onFocus,
      control,
      containerClassName,
      ...props
    }: ColorPickerInputProps<TFieldValues>,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const fieldValue: string = useWatch<TFieldValues>({
      control,
      name: props.name,
    });

    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const colorPickerRef = useRef(null);
    const forwardedRef = useForwardRef<HTMLInputElement>(ref);
    const rootRef = useRef<HTMLDivElement>(null);

    useOnInteractOutside(
      () => setIsPickerOpen(false),
      colorPickerRef,
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
            ? rect.y - 217
            : rect.y + rect.height + 20,
      });
    };

    return (
      <div className={tw("w-full", containerClassName)} ref={rootRef}>
        <Input
          right={
            <icons.SwatchIcon className={`text-${getTextColor(fieldValue)}`} />
          }
          ref={forwardedRef}
          {...props}
          iconClassName={`bg-${fieldValue}`}
          autoComplete="off"
          onClick={(e) => {
            setCoordinates(e);
            onClick?.(e);
            setIsPickerOpen(true);
          }}
          onFocus={(e) => {
            setCoordinates(e);
            setIsPickerOpen(true);
            onFocus?.(e);
          }}
        />
        {isPickerOpen && (
          <Portal.Root
            ref={colorPickerRef}
            className="absolute z-20"
            style={coords}
          >
            <ColorPicker
              onChange={(newColor) => {
                if (newColor !== fieldValue && forwardedRef.current) {
                  setIsPickerOpen(false);
                  _triggerFakeInputChangeEvent(forwardedRef.current, newColor);
                }
              }}
              value={fieldValue}
            />
          </Portal.Root>
        )}
      </div>
    );
  },
);
