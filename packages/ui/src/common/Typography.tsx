import type { ComponentPropsWithoutRef } from "react";

import { tw } from "@lightit/shared";
import type { TextTags } from "@lightit/shared";

export const typographyVariants = [
  "base",
  "detail",
  "large",
  "small",
  "xlarge",
] as const;
export type TypographyVariant = (typeof typographyVariants)[number];

export const typographyFonts = [
  "normal",
  "medium",
  "regular",
  "semiBold",
  "bold",
] as const;
export type TypographyFont = (typeof typographyFonts)[number];

export interface TypographyProps extends ComponentPropsWithoutRef<"p"> {
  as?: TextTags;
  variant?: TypographyVariant;
  font?: TypographyFont;
}

export const Typography = ({
  as: Container = "p",
  variant = "base",
  font = "medium",
  children,
  className,
  ...props
}: TypographyProps) => {
  return (
    <Container
      className={tw(
        "tracking-normal text-neutrals-dark-500",
        variant === "detail" && "text-xs",
        variant === "small" && "text-sm",
        variant === "base" && "text-base",
        variant === "large" && "text-lg",
        variant === "xlarge" && "text-xl",

        font === "normal" && "font-normal",
        font === "medium" && "font-medium",
        font === "regular" && "font-normal",
        font === "semiBold" && "font-semibold",
        font === "bold" && "font-bold",

        className,
      )}
      {...props}
    >
      {children}
    </Container>
  );
};
