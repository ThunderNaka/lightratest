import * as Accordion from "@radix-ui/react-accordion";
import { Link, useLocation } from "react-router-dom";

import { tw } from "@lightit/shared";
import { icons } from "@lightit/ui";

import type { NestedNavigation } from "./navigationItems";

export const ExpandedNestedItem = ({
  item,
  onClick,
}: {
  item: NestedNavigation;
  onClick?: () => void;
}) => {
  const { pathname: currentPath } = useLocation();

  return (
    <Accordion.Item value={item.label}>
      <Accordion.Trigger
        className={tw(
          "flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6 duration-300 [&[data-state=open]>svg:last-child]:rotate-90",
          item.children.map((i) => i.path).includes(currentPath)
            ? "data-[state=closed]:bg-secondary-900 data-[state=open]:bg-primary-400"
            : "hover:bg-primary-400",
        )}
      >
        {item.icon}
        <span className="truncate">{item.label}</span>
        <icons.ChevronRightIcon
          className="ml-auto h-5 w-5 shrink-0 text-gray-500 duration-200 data-[state=closed]:text-gray-400"
          aria-hidden="true"
        />
      </Accordion.Trigger>
      <Accordion.Content className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <ul className="flex flex-col gap-1 px-2 pt-2">
          {item.children.map((subItem) => (
            <li key={subItem.label}>
              <Link
                to={subItem.path}
                onClick={onClick}
                className={tw(
                  "block rounded-md py-2 pl-9 pr-2 text-sm leading-6 duration-300",
                  currentPath.startsWith(subItem.path)
                    ? "bg-secondary-900"
                    : "hover:bg-primary-400",
                )}
                draggable="false"
              >
                <span className="truncate duration-200">{subItem.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Accordion.Content>
    </Accordion.Item>
  );
};
