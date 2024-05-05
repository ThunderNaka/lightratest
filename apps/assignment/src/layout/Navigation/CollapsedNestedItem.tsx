import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useLocation, useNavigate } from "react-router-dom";

import { tw } from "@lightit/shared";

import type { NestedNavigation } from "./navigationItems";

export const CollapsedNestedItem = ({ item }: { item: NestedNavigation }) => {
  const navigate = useNavigate();
  const { pathname: currentPath } = useLocation();
  return (
    <DropdownMenu.Root>
      <Tooltip.Root>
        <DropdownMenu.Trigger
          className={tw(
            "rounded-md duration-300 data-[state=open]:bg-primary-400",
            item.children.map((i) => i.path).includes(currentPath)
              ? "bg-secondary-900"
              : "hover:bg-primary-400",
          )}
        >
          <Tooltip.Trigger
            asChild
            className={tw(
              "flex items-center rounded-md p-2",
              item.children.map((i) => i.path).includes(currentPath)
                ? "bg-secondary-900"
                : "hover:bg-primary-400",
            )}
          >
            <div draggable="false">{item.icon}</div>
          </Tooltip.Trigger>
        </DropdownMenu.Trigger>
        <Tooltip.Content
          side="right"
          sideOffset={6}
          className="z-50 overflow-hidden rounded-lg bg-primary-300 px-3 py-1.5 text-sm text-white shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=right]:slide-in-from-left-2"
        >
          {item.label}
          <Tooltip.Arrow className="fill-primary-300" />
        </Tooltip.Content>
      </Tooltip.Root>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="right"
          sideOffset={10}
          align="start"
          alignOffset={-7}
          className="z-50 flex min-w-[11rem] flex-col gap-1 overflow-hidden rounded-lg bg-primary-400 p-2 text-sm font-medium text-white shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=right]:slide-in-from-left-2"
        >
          {item.children.map((subItem) => (
            <DropdownMenu.Item
              key={subItem.label}
              onClick={() => navigate(subItem.path)}
              className={tw(
                "cursor-pointer rounded-md p-2 text-sm leading-6 duration-300",
                currentPath.startsWith(subItem.path)
                  ? "bg-primary-500"
                  : "hover:bg-primary-300",
              )}
            >
              {subItem.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
