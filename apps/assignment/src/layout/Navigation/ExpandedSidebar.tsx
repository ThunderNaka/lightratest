import * as Accordion from "@radix-ui/react-accordion";
import { Link } from "react-router-dom";

import { ScrollArea } from "@lightit/ui";

import { LightitLogo } from "~/assets";
import { usePermissions } from "~/hooks";
import { ROUTES } from "~/router";
import { ExpandedBaseItem } from "./ExpandedBaseItem";
import { ExpandedNestedItem } from "./ExpandedNestedItem";
import { NAVIGATION_ITEMS } from "./navigationItems";

export const ExpandedSidebar = ({
  onLinkSelect,
}: {
  onLinkSelect?: () => void;
}) => {
  const { hasPermission } = usePermissions();
  const filteredNavItems = NAVIGATION_ITEMS.filter(
    (item) =>
      (item.permission && hasPermission(item.permission)) ?? !item.permission,
  );

  const expandedByDefaultNavItems = NAVIGATION_ITEMS.filter(
    (item) => item.type === "nested" && item.expandedByDefault,
  ).map((item) => item.label);

  return (
    <div className="flex grow flex-col divide-y divide-neutrals-dark-500">
      <div className="relative flex items-center justify-between p-6 pt-8 duration-500">
        <Link to={ROUTES.base} onClick={onLinkSelect} draggable="false">
          <img
            className="h-9 select-none animate-in fade-in-0 zoom-in-95 duration-500"
            src={LightitLogo}
            alt="Light-it Logo"
            draggable="false"
          />
        </Link>
      </div>

      <ScrollArea className="grow">
        <Accordion.Root
          type="multiple"
          defaultValue={expandedByDefaultNavItems}
        >
          <ul className="flex flex-col gap-2 p-4">
            {filteredNavItems.map((item) => (
              <li key={item.label}>
                {item.type !== "nested" ? (
                  <ExpandedBaseItem item={item} onClick={onLinkSelect} />
                ) : (
                  <ExpandedNestedItem item={item} onClick={onLinkSelect} />
                )}
              </li>
            ))}
          </ul>
        </Accordion.Root>
      </ScrollArea>
    </div>
  );
};
