import { Fragment, useState } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { Menu, Transition } from "@headlessui/react";

import { tw } from "@lightit/shared";

import { icons, IconWrapper } from "./Icons";

export interface DropdownOption<TValue extends string>
  extends ComponentPropsWithoutRef<"button"> {
  value: TValue;
  label: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export interface DropdownProps<TId extends string> {
  options: DropdownOption<TId>[];
  label?: string;
  className?: string;
  containerClassName?: string;
  optionsContainerClassName?: string;
  optionClassName?: string;
  iconsSize?: "sm" | "md" | "lg";
  renderButton?: (params: {
    label?: string;
    open?: boolean;
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  }) => JSX.Element;
}

export const Dropdown = <TId extends string>({
  options = [],
  label,
  className,
  containerClassName,
  optionsContainerClassName,
  optionClassName,
  iconsSize,
  renderButton,
}: DropdownProps<TId>) => {
  const [upwards, setUpwards] = useState(false);

  return (
    <button
      className={tw("w-full text-neutrals-dark-400", containerClassName)}
      onClick={(e) => e.stopPropagation()}
    >
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button as="div" className="h-full w-full">
          {(buttonRenderProps) =>
            renderButton ? (
              renderButton({
                label,
                onClick: (e) => {
                  const inputElement = e.target as HTMLButtonElement;
                  const rect = inputElement.getBoundingClientRect();
                  setUpwards(rect.y > innerHeight * 0.5);
                },
                ...buttonRenderProps,
              })
            ) : (
              <button
                type="button"
                className={tw(
                  "flex items-center justify-center gap-1.5 rounded-md border border-neutrals-medium-300 bg-white px-3 py-2 text-sm font-semibold shadow-sm focus-within:outline-none focus-within:ring-4 focus-within:ring-complementary-green-100 hover:bg-gray-50 focus-visible:border-complementary-green-400",
                  className,
                )}
              >
                <span>{label}</span>
                <icons.ChevronDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </button>
            )
          }
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={tw(
              "absolute right-0 z-10 h-fit w-fit origin-top-right outline-none ring-0",
              upwards && "bottom-[100%]",
            )}
          >
            <div
              className={tw(
                "mt-2 flex flex-col rounded-md border border-neutrals-medium-300 bg-white py-1 outline-none",
                optionsContainerClassName,
              )}
            >
              {options.map(({ value, left, right, label, ...rest }) => (
                <Menu.Item key={value}>
                  {({ active }) => (
                    <button
                      type="button"
                      className={tw(
                        "flex h-9 w-full items-center gap-3 px-4 py-2 text-left text-sm disabled:opacity-50",
                        active &&
                          "bg-secondary-50 font-medium text-neutrals-dark-900",
                        optionClassName,
                      )}
                      {...rest}
                    >
                      {left && (
                        <IconWrapper
                          size={iconsSize ?? "sm"}
                          aria-hidden="true"
                        >
                          {left}
                        </IconWrapper>
                      )}
                      <span className="w-full">{label}</span>
                      {right && (
                        <IconWrapper
                          size={iconsSize ?? "sm"}
                          aria-hidden="true"
                        >
                          {right}
                        </IconWrapper>
                      )}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </button>
  );
};
