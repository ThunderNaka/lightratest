import { Link, useLocation } from "react-router-dom";

import { tw } from "@lightit/shared";
import { icons } from "@lightit/ui";

import { ROUTES } from "~/router";

export const AssignmentsNavigation = () => {
  const { pathname: currentPath } = useLocation();

  const navigation = [
    {
      path: ROUTES.assignments.historyView,
      icon: <icons.ClockIcon className="h-5 w-5" />,
    },
    {
      path: ROUTES.assignments.projectView,
      icon: <icons.FolderIcon className="h-5 w-5" />,
    },
    {
      path: ROUTES.assignments.employeesView,
      icon: <icons.UserIcon className="h-5 w-5" />,
    },
  ] as const;

  return (
    <div className="flex items-center gap-2">
      {navigation.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={tw(
            "rounded-md border border-nostalgia-purple-900 p-2 text-nostalgia-purple-900",
            currentPath === item.path &&
              "border-transparent bg-nostalgia-purple-100",
          )}
        >
          {item.icon}
        </Link>
      ))}
    </div>
  );
};
