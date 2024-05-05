import type { ComponentPropsWithoutRef, ForwardedRef } from "react";

import { forwardRef, tw } from "@lightit/shared";

import { IconWrapper } from "./Icons";

export const buttonVariants = [
  "primary",
  "outline",
  "outline-white",
  "secondary",
  "tertiary-link",
] as const;
export type ButtonVariant = (typeof buttonVariants)[number];

export const buttonSizes = ["sm", "md", "lg"] as const;
export type ButtonSize = (typeof buttonSizes)[number];

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export const Button = forwardRef(
  (
    {
      type = "button",
      className,
      variant = "primary",
      size = "md",
      left,
      right,
      disabled = false,
      children,
      ...props
    }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => (
    <button
      ref={ref}
      type={type}
      className={tw(
        "flex items-center gap-2 rounded-md border border-transparent font-medium focus:outline-none focus:ring-2 focus:ring-offset-0",

        !disabled && [
          variant === "primary" &&
            "bg-nostalgia-purple-900 text-white hover:bg-nostalgia-purple-700 focus:bg-nostalgia-purple-900 focus:ring-secondary-100",
          variant === "outline" &&
            "border-nostalgia-purple-900 text-nostalgia-purple-900 hover:border-nostalgia-purple-900 hover:bg-secondary-50 hover:text-nostalgia-purple-900 focus:ring-secondary-100",
          variant === "outline-white" &&
            "border-primary-white-500 text-primary-white-500 hover:bg-nostalgia-purple-700 focus:ring-0",
          variant === "secondary" &&
            "bg-nostalgia-purple-100 text-nostalgia-purple-900 hover:bg-secondary-200 focus:text-nostalgia-purple-900 focus:ring-nostalgia-purple-100",
          variant === "tertiary-link" &&
            "text-nostalgia-purple-900 hover:text-nostalgia-purple-700 focus:text-nostalgia-purple-900 focus:ring-1 focus:ring-nostalgia-purple-900",
        ],

        disabled && [
          variant === "primary" && "bg-neutrals-light-300 text-neutrals-medium",
          variant === "outline" &&
            "border-neutrals-medium text-neutrals-medium",
          variant === "outline-white" &&
            "border-neutrals-medium-400 text-neutrals-medium-400",
          variant === "secondary" &&
            "bg-neutrals-light-300 text-neutrals-medium",
          variant === "tertiary-link" && "text-neutrals-medium",
        ],

        size === "sm" && "px-4 py-2 text-sm",
        size === "md" && "px-[18px] py-3 text-base leading-5",
        size === "lg" && "px-7 py-4 text-lg leading-[22px]",

        !children && [
          size === "sm" && "p-2",
          size === "md" && "p-3",
          size === "lg" && "p-4",
        ],

        className,
      )}
      disabled={disabled}
      {...props}
    >
      {left && <IconWrapper size={size}>{left}</IconWrapper>}
      <span className="grow overflow-hidden">{children}</span>
      {right && <IconWrapper size={size}>{right}</IconWrapper>}
    </button>
  ),
);
