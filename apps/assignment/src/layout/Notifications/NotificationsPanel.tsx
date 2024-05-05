import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { tw } from "@lightit/shared";
import { Dropdown, icons } from "@lightit/ui";

import { getNotificationsQuery } from "~/api/notifications";
import { errorToast } from "~/utils";
import { NotificationsMap } from "./NotificationsMap";

export const NotificationsPanel = () => {
  const { data: notifications } = useQuery({
    ...getNotificationsQuery(),
    onError: errorToast,
  });

  // TODO: refactor this sort to deduplicate the source of truth and erase the useState & useEffect
  const [sortedNotifications, setSortedNotifications] = useState(
    notifications ?? [],
  );

  useEffect(() => {
    if (notifications) {
      setSortedNotifications(notifications);
    }
  }, [notifications]);

  const [sortOption, setSortOption] = useState("");

  return (
    <Menu as="div" className="relative inline-flex p-2">
      {({ open }) => (
        <>
          <Menu.Button
            className={tw(
              "rounded-full p-1 outline-none hover:text-gray-500",
              "focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2",
              open && "ring-2 ring-secondary-500 ring-offset-2",
            )}
          >
            <span className="sr-only">View notifications</span>
            {notifications?.some((notification) => !notification.readAt) && (
              <span className="absolute right-3 top-2 block h-2 w-2 rounded-full bg-complementary-green-500 ring-2 ring-white" />
            )}
            <BellIcon
              className="h-6 w-6 text-white hover:opacity-90"
              aria-hidden="true"
            />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 top-10 z-20 mt-3.5 w-96 origin-top-right rounded-2xl bg-white pb-6 shadow-full focus:outline-none">
              <div className="flex flex-col">
                <div className="flex items-center justify-between p-4">
                  <h4 className="text-base font-semibold text-neutrals-dark-900">
                    Notifications
                  </h4>
                  {/* TODO: (BE): MarkAllAsRead endpoint & (UX/UI): Notification Configuration panel */}
                  {/* <Dropdown
                    containerClassName="w-fit"
                    optionsContainerClassName="bg-primary-white-50 rounded-2xl py-4 truncate gap-2"
                    optionClassName="text-neutrals-dark-300 text-sm font-semibold"
                    label="..."
                    renderButton={({ open }) => (
                      <div
                        className={tw(
                          "flex h-9 w-9 cursor-pointer items-center justify-center rounded-md",
                          open && "bg-secondary-50",
                        )}
                      >
                        <icons.EllipsisHorizontalIcon className="h-6 w-6 text-secondary-500" />
                      </div>
                    )}
                    options={[
                      {
                        value: "readAll",
                        label: "Mark all as read",
                        left: <icons.CheckIcon className="stroke-2" />,
                      },
                      {
                        value: "configuration",
                        label: "Notification configuration",
                        left: <Cog8ToothIcon className="stroke-2" />,
                      },
                    ]}
                  /> */}
                </div>

                {/* TODO: [Design] - do we need to show today's date or sort notifications? */}
                <div className="flex items-center justify-between p-4 text-sm text-neutrals-dark-500">
                  <div>{format(new Date(), "EEE, d MMMM")}</div>
                  <div className="flex items-center gap-2">
                    <span>Order by </span>
                    <Dropdown
                      containerClassName="w-fit"
                      optionsContainerClassName="bg-primary-white-50 rounded-2xl py-4 truncate gap-2"
                      optionClassName="text-neutrals-dark-300 text-sm font-semibold"
                      label="..."
                      renderButton={() => (
                        <div className="flex cursor-pointer items-center gap-2">
                          <span className="text-sm font-semibold text-neutrals-dark-900">
                            {sortOption}
                          </span>
                          <icons.ChevronDownIcon className="h-4 w-4 stroke-2 text-primary-400" />
                        </div>
                      )}
                      options={[
                        // TODO: (BE) - Get missing data for notifications
                        // { value: "priority", label: "Priority" },
                        // { value: "employeeName", label: "Employee Name" },

                        {
                          value: "projectName",
                          label: "Project Name",
                          onClick: () => {
                            setSortOption("Project Name");
                            setSortedNotifications((prevNotifications) =>
                              prevNotifications.slice().sort((a, b) => {
                                const projectA =
                                  a.notificationData.projectName.toUpperCase();
                                const projectB =
                                  b.notificationData.projectName.toUpperCase();

                                if (projectA < projectB) {
                                  return -1;
                                }
                                if (projectA > projectB) {
                                  return 1;
                                }
                                return 0;
                              }),
                            );
                          },
                        },

                        // { value: "billable", label: "Billable Project" },
                      ]}
                    />
                  </div>
                </div>
              </div>

              <NotificationsMap notifications={sortedNotifications} />
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};
