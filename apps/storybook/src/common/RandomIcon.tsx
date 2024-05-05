import { useRef } from "react";
import { sample } from "lodash/fp";

import { icons } from "@lightit/ui";
import type { SVGProps } from "@lightit/ui";

const iconList = Object.values(icons).filter((v) => v !== icons.SpinnerIcon);
export const RandomIcon = (props: SVGProps) => {
  const iconRef = useRef(sample(iconList)!);
  const Icon = iconRef.current;
  return <Icon {...props} />;
};
