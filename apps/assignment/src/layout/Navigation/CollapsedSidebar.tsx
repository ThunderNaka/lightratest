import * as Tooltip from "@radix-ui/react-tooltip";
import { Link } from "react-router-dom";

import { LightItLogoSmall } from "~/assets";
import { usePermissions } from "~/hooks";
import { ROUTES } from "~/router";
import { CollapsedBaseItem } from "./CollapsedBaseItem";
import { CollapsedNestedItem } from "./CollapsedNestedItem";
import { NAVIGATION_ITEMS } from "./navigationItems";

export const CollapsedSidebar = () => {
  const { hasPermission } = usePermissions();
  const filteredNavItems = NAVIGATION_ITEMS.filter(
    (item) =>
      (item.permission && hasPermission(item.permission)) ?? !item.permission,
  );

  return (
    <nav className="divide-y divide-neutrals-dark-500">
      <div className="relative flex items-center justify-between px-4 pb-6 pt-7 duration-500">
        <Link to={ROUTES.base} draggable="false">
          <img
            className="h-10 w-11 select-none animate-in fade-in-0 zoom-in-95 duration-500"
            src={LightItLogoSmall}
            alt="Light-it Logo"
            draggable="false"
          />
        </Link>
      </div>
      <Tooltip.Provider delayDuration={100}>
        <ul className="flex flex-col gap-2 p-4">
          {filteredNavItems.map((item) => (
            <li key={item.label}>
              {item.type !== "nested" ? (
                <CollapsedBaseItem item={item} />
              ) : (
                <CollapsedNestedItem item={item} />
              )}
            </li>
          ))}
        </ul>
      </Tooltip.Provider>
    </nav>
  );
};
