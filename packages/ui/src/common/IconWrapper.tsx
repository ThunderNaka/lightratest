import React from "react";

import { IconSize, IIconWrapper } from "./IconWrapperTypes";

const IconWrapper = ({
  size,
  desktop,
  children,
  ariaHidden = true,
  ariaLabel = "",
}: IIconWrapper) => {
  const mobileClasses: Record<IconSize, string> = {
    12: "h-3 w-3",
    16: "h-4 w-4",
    20: "h-5 w-5",
    24: "h-6 w-6",
    28: "h-7 w-7",
    32: "h-8 w-8",
    40: "h-10 w-10",
    48: "h-12 w-12",
    60: "h-[60px] w-[60px]",
    72: "h-[72px] w-[72px]",
  };
  const desktopClasses: Record<IconSize, string> = {
    12: "md:h-3 md:w-3",
    16: "md:h-4 md:w-4",
    20: "md:h-5 md:w-5",
    24: "md:h-6 md:w-6",
    28: "md:h-7 md:w-7",
    32: "md:h-8 md:w-8",
    40: "md:h-10 md:w-10",
    48: "md:h-12 md:w-12",
    60: "md:h-[60px] md:w-[60px]",
    72: "md:h-[72px] md:w-[72px]",
  };
  return (
    <div
      className={`${mobileClasses[size]} ${
        desktop ? desktopClasses[desktop] : ""
      } flex-none `}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    >
      {children}
    </div>
  );
};

IconWrapper.defaultProps = {
  desktop: "",
};

export default IconWrapper;
