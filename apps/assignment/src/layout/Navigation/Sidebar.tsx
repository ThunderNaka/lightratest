import { useState } from "react";

import { tw } from "@lightit/shared";
import { icons } from "@lightit/ui";

import { CollapsedSidebar } from "./CollapsedSidebar";
import { ExpandedSidebar } from "./ExpandedSidebar";

export const Sidebar = ({ onLinkSelect }: { onLinkSelect?: () => void }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={tw(
        "relative flex h-screen w-72 bg-primary text-white duration-200",
        isCollapsed && "w-[4.5rem]",
      )}
    >
      {!onLinkSelect && (
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className={tw(
            "absolute right-0 top-9 z-10 rounded-lg bg-primary-dark-900 p-1",
            isCollapsed && "-right-5",
          )}
        >
          <icons.ChevronDoubleLeftIcon
            className={tw(
              "h-4 w-4 text-secondary duration-500",
              isCollapsed && "rotate-180",
            )}
          />
        </button>
      )}

      <nav className="flex grow overflow-x-hidden">
        {isCollapsed ? (
          <CollapsedSidebar />
        ) : (
          <ExpandedSidebar onLinkSelect={onLinkSelect} />
        )}
      </nav>
    </div>
  );
};
