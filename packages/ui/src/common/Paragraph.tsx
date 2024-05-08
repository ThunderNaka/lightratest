import React from "react";

import { paragraphClasses } from "./typography-types";
import type { ParagraphProps } from "./typography-types";

const Paragraph = ({
  fontWeight = "normal",
  className,
  children,
  size = "xsmall",
  textColor = "text-dark-1000",
}: ParagraphProps) => {
  const paragraphClass = paragraphClasses[size];
  let fontWeightClass;
  switch (fontWeight) {
    case "medium":
      fontWeightClass = "font-medium";
      break;
    case "semibold":
      fontWeightClass = "font-semibold";
      break;
    default:
      fontWeightClass = "font-normal";
      break;
  }

  return (
    <p
      className={`${paragraphClass} ${textColor} ${className} ${fontWeightClass} font-lato m-0`}
    >
      {children}
    </p>
  );
};

export default Paragraph;
