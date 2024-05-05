import * as Tooltip from "@radix-ui/react-tooltip";
import { Link, useLocation } from "react-router-dom";

import { tw } from "@lightit/shared";

import type { BaseNavigation } from "./navigationItems";

export const CollapsedBaseItem = ({ item }: { item: BaseNavigation }) => {
  const { pathname: currentPath } = useLocation();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Link
          to={item.path}
          className={tw(
            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 duration-300",
            currentPath.startsWith(item.path)
              ? "bg-secondary-900"
              : "hover:bg-primary-400",
          )}
          draggable="false"
        >
          {item.icon}
        </Link>
      </Tooltip.Trigger>
      <Tooltip.Content
        side="right"
        sideOffset={6}
        className="z-50 overflow-hidden rounded-lg bg-primary-300 px-3 py-1.5 text-sm text-white shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=right]:slide-in-from-left-2"
      >
        {item.label}
        <Tooltip.Arrow className="fill-primary-300" />
      </Tooltip.Content>
    </Tooltip.Root>
  );
};
