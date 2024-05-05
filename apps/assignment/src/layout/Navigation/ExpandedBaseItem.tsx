import { Link, useLocation } from "react-router-dom";

import { tw } from "@lightit/shared";

import type { BaseNavigation } from "./navigationItems";

export const ExpandedBaseItem = ({
  item,
  onClick,
}: {
  item: BaseNavigation;
  onClick?: () => void;
}) => {
  const { pathname: currentPath } = useLocation();

  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={tw(
        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 duration-300",
        currentPath.startsWith(item.path)
          ? "bg-secondary-900"
          : "hover:bg-primary-400",
      )}
      draggable="false"
    >
      {item.icon}
      <span className="truncate">{item.label}</span>
    </Link>
  );
};
