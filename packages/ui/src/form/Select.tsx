import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react";
import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";
import { renderToString } from "react-dom/server";
import { Controller } from "react-hook-form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { tw } from "@lightit/shared";

import { CircularAvatar, icons, ScrollArea, Tooltip } from "../common";
import { SIZE } from "../shared.types";
import type { Size } from "../shared.types";
import { Label } from "./Label";
import { Message } from "./Message";

interface Option<TValue> {
  value: TValue;
  label: ReactNode;
  multipleSelectedLabel?: string;
  avatarUrl?: string;
  disabled?: boolean;
}

interface CommonProps<TValue>
  extends Omit<ComponentPropsWithoutRef<"input">, "size" | "onChange"> {
  autocomplete?: boolean;
  containerClassName?: string;
  emptyMessage?: string;
  error?: string | boolean;
  label?: string;
  message?: string;
  hasEmptyOption?: boolean;
  options: readonly Option<TValue>[];
  readOnlyPlaceholder?: string;
  searchPlaceholder?: string;
  size?: Size;
  requiredMarker?: boolean;
  onValueSelected?: (currentValue: TValue | TValue[]) => void;
}

interface SingleSelectProps<TValue> {
  multiple?: never;
  value: TValue;
  onChange: (value: TValue) => void;
}

interface MultiSelectProps<TValue> {
  multiple: true;
  value: TValue[];
  onChange: (value: TValue[]) => void;
}

type SelectProps<TValue> = CommonProps<TValue> &
  (SingleSelectProps<TValue> | MultiSelectProps<TValue>);

export const Select = <TValue extends string | number | null>({
  autocomplete,
  className,
  containerClassName,
  disabled,
  emptyMessage,
  error,
  label,
  message,
  multiple,
  hasEmptyOption,
  options,
  placeholder,
  readOnly,
  readOnlyPlaceholder = "-",
  searchPlaceholder,
  size = SIZE.MEDIUM,
  value,
  requiredMarker,
  onChange,
  onValueSelected,
  ...rest
}: SelectProps<TValue>) => {
  const [open, setOpen] = useState(false);
  const handleSelect = (selectedValue: TValue) => {
    if (multiple) {
      const selectedValues =
        selectedValue === null
          ? []
          : value.some((v) => v === selectedValue)
          ? value.filter((v) => v !== selectedValue)
          : [...value, selectedValue];

      onChange(selectedValues);
      onValueSelected?.(selectedValues);
    } else {
      onChange(selectedValue);
      onValueSelected?.(selectedValue);
      setOpen(false);
    }
  };

  const selectedOption = !multiple
    ? options.find((option) => option.value === value)
    : undefined;

  const getSearchTextFromOption = (option: Option<unknown>) => {
    const removeHtmlTags = (input: string) => input.replace(/<[^>]+>/g, "");
    const labelString = removeHtmlTags(
      renderToString(option.label as ReactElement),
    );

    const labelStringWithoutAccents = labelString
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");

    return `${labelString} ${labelStringWithoutAccents}`;
  };

  return (
    <div className={tw("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <Label
          label={label}
          className={tw(readOnly && "text-neutrals-dark-300")}
          requiredMarker={requiredMarker}
        />
      )}

      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          className={tw(
            "flex items-center gap-3 rounded-md border border-neutrals-medium-300 bg-white text-left text-sm text-neutrals-dark-400 focus:border-secondary-400 focus:outline-none focus:ring-4 focus:ring-secondary-100 data-[state=open]:border-secondary-400 data-[state=open]:ring-4 data-[state=open]:ring-secondary-100",

            size === SIZE.SMALL && "px-3 py-2",
            size === SIZE.MEDIUM && "px-4 py-3",
            size === SIZE.LARGE && "px-5 py-4 text-base",

            disabled &&
              !readOnly &&
              "cursor-not-allowed bg-primary-white-500 opacity-80",

            readOnly &&
              "cursor-text select-text border-transparent px-0 font-medium text-neutrals-dark-500 shadow-none",

            error &&
              "border-complementary-red-500 focus:border-complementary-red-500 focus:ring-complementary-red-50 data-[state=open]:border-complementary-red-500 data-[state=open]:ring-complementary-red-50",

            className,
          )}
          disabled={!!disabled || readOnly}
        >
          {multiple ? (
            <>
              {!value.length ? (
                <span className="grow text-sm text-neutrals-medium-500">
                  {(readOnly ? readOnlyPlaceholder : placeholder) ??
                    "Select..."}
                </span>
              ) : (
                <ul className="-my-0.5 flex flex-1 flex-wrap gap-2">
                  {value.map((selectedValue) => (
                    <li
                      key={selectedValue}
                      className="flex cursor-auto items-center gap-1 truncate rounded-md bg-secondary-50 px-2 py-1 text-xs text-secondary-600"
                    >
                      {options.find((option) => option.value === selectedValue)
                        ?.multipleSelectedLabel ??
                        options.find((option) => option.value === selectedValue)
                          ?.label}
                      {!readOnly && (
                        <icons.XMarkIcon
                          className="h-4 w-4 cursor-pointer hover:opacity-80"
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedOptions = value.filter(
                              (value) => value !== selectedValue,
                            );
                            onChange(updatedOptions);
                          }}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="flex min-w-0 grow items-center gap-3 text-left">
              {selectedOption ? (
                <>
                  {selectedOption.avatarUrl && (
                    <CircularAvatar
                      size="sm"
                      image={selectedOption.avatarUrl}
                      name={selectedOption.label as string}
                      defaultToIcon={false}
                      className="-my-2"
                    />
                  )}
                  <span className="">{selectedOption.label}</span>
                </>
              ) : (
                <span className="truncate text-neutrals-medium-500">
                  {(readOnly ? readOnlyPlaceholder : placeholder) ??
                    "Select..."}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-center gap-1.5">
            {error && (
              <Tooltip
                content={error}
                side="bottom"
                align="end"
                className="-my-1 flex items-center"
                contentClassName="text-complementary-red-500"
                asChild
              >
                <icons.ExclamationCircleIcon className="h-6 w-6 shrink-0 text-complementary-red-500" />
              </Tooltip>
            )}

            <icons.ChevronDownIcon
              className={tw(
                "h-4 w-4 shrink-0 cursor-pointer stroke-[3] text-gray-400 duration-150",
                open && "rotate-180",
                disabled && "cursor-not-allowed",
                readOnly && "hidden",
              )}
            />
          </div>
        </Popover.Trigger>
        <Popover.Content
          sideOffset={8}
          className="z-50 min-w-[var(--radix-popover-trigger-width)] rounded-md border bg-white text-neutrals-dark-900 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          <Command className="flex h-full w-full flex-col rounded-md">
            {autocomplete && (
              <div className="p-2">
                <Command.Input
                  className="flex w-full rounded-md border-neutrals-medium-300 bg-transparent px-3 py-2 text-sm text-neutrals-dark-400 focus:border-secondary-100 focus:outline-none focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={searchPlaceholder ?? "Search..."}
                  {...rest}
                />
              </div>
            )}
            <ScrollArea className="h-auto text-sm [&:not(:first-child)]:border-t">
              <Command.Empty className="py-6 text-center">
                {emptyMessage ? emptyMessage : "No option found."}
              </Command.Empty>
              <Command.Group className="max-h-48 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-700">
                {hasEmptyOption && (
                  <Command.Item
                    onSelect={() => handleSelect(null as TValue)}
                    className={tw(
                      "flex cursor-pointer select-none items-center justify-between gap-2 truncate px-4 py-3 outline-none aria-selected:bg-gray-50 aria-selected:text-neutrals-dark-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&:last-child]:rounded-md [&:not(:last-child)]:border-b",

                      size === SIZE.SMALL && "px-3 py-2",
                      size === SIZE.MEDIUM && "px-4 py-3",
                      size === SIZE.LARGE && "px-5 py-4 text-base",
                    )}
                  >
                    None
                  </Command.Item>
                )}
                {options.map((option) => (
                  <Command.Item
                    key={option.value}
                    value={getSearchTextFromOption(option)}
                    onSelect={() => handleSelect(option.value)}
                    disabled={option.disabled}
                    className={tw(
                      "flex cursor-pointer select-none items-center justify-between gap-2 truncate px-4 py-3 outline-none aria-selected:bg-gray-50 aria-selected:text-neutrals-dark-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&:last-child]:rounded-md [&:not(:last-child)]:border-b",

                      size === SIZE.SMALL && "px-3 py-2",
                      size === SIZE.MEDIUM && "px-4 py-3",
                      size === SIZE.LARGE && "px-5 py-4 text-base",

                      option.disabled && "cursor-not-allowed opacity-30",
                    )}
                  >
                    {multiple && (
                      <input
                        id={`multi-select-option-${option.value}`}
                        tabIndex={-1}
                        readOnly
                        type="checkbox"
                        checked={value.includes(option.value)}
                        className="cursor-pointer rounded checked:bg-nostalgia-purple-900 hover:checked:bg-nostalgia-purple-700 focus:ring-nostalgia-purple-900 focus:checked:bg-nostalgia-purple-900"
                      />
                    )}

                    <div className="flex grow items-center gap-3">
                      {option.avatarUrl && (
                        <CircularAvatar
                          size="sm"
                          image={option.avatarUrl}
                          name={option.label as string}
                          defaultToIcon={false}
                          className="-my-2"
                        />
                      )}
                      {option.label}
                    </div>

                    {!multiple && value === option.value && (
                      <icons.CheckIcon
                        className="h-4 w-4 stroke-2 text-nostalgia-purple-700"
                        aria-hidden="true"
                      />
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            </ScrollArea>
          </Command>
        </Popover.Content>
      </Popover.Root>

      {message && <Message message={message} />}
    </div>
  );
};

interface HookedSelectProps<TFieldValues extends FieldValues>
  extends Omit<SelectProps<string | number | null>, "onChange" | "value"> {
  id: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
}
export const HookedSelect = <TFieldValues extends FieldValues>({
  id,
  control,
  ...props
}: HookedSelectProps<TFieldValues>) => {
  return (
    <Controller
      name={id}
      control={control}
      render={({ field }) => {
        const { onChange, value } = field;
        return <Select {...props} value={value} onChange={onChange} />;
      }}
    />
  );
};

export const EmployeeSelectOption = ({
  avatarUrl,
  name,
}: {
  avatarUrl: string;
  name: string;
}) => (
  <div className="-my-2 flex items-center gap-2 overflow-visible">
    <CircularAvatar
      size="xs"
      image={avatarUrl}
      name={name}
      defaultToIcon={false}
      className="my-0"
    />
    {name}
  </div>
);
