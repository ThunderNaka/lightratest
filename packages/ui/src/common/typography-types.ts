type ColorName = "primary" | "dark" | "green" | "error" | "warning";

type ColorVariant =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "1000";

type ColorWithVariant = `${ColorName}-${ColorVariant}`;

type ColorWithoutVariant = "white" | "transparent";

export type TextColor = `text-${ColorWithVariant | ColorWithoutVariant}`;

export type BackgroundColor = `bg-${ColorWithVariant | ColorWithoutVariant}`;

export interface HeadingProps {
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: string;
  className?: string;
  textColor?: TextColor;
}

export const headingClasses = {
  h1: "text-h1 lg:text-h1-lg font-semibold",
  h2: "text-h2 lg:text-h2-lg font-semibold",
  h3: "text-h3 lg:text-h3-lg font-semibold",
  h4: "text-h4 lg:text-h4-lg font-semibold",
  h5: "text-h5 lg:text-h5-lg font-semibold",
  h6: "text-h6 lg:text-h6-lg font-semibold",
};

export interface ParagraphProps {
  fontWeight?: "normal" | "medium" | "semibold";
  size?:
    | "large"
    | "medium"
    | "small"
    | "xsmall"
    | "xxsmall"
    | "sm-lg"
    | "xs-sm";
  children: string;
  className?: string;
  textColor?: TextColor;
}

export const paragraphClasses = {
  large: "text-p-lg",
  medium: "text-p-md",
  small: "text-p-sm",
  xsmall: "text-p-xs",
  xxsmall: "text-p-xxs",
  "sm-lg": "text-p-sm lg:text-p-lg",
  "xs-sm": "text-p-xs lg:text-p-sm",
};
