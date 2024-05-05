import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";

import { Button, CircularAvatar } from "@lightit/ui";

import { useLogoutQuery } from "~/api/logout";
import { useUserStore } from "~/stores/useUserStore";

export const ProfilePanel = () => {
  const { logoutMutation } = useLogoutQuery();

  const currentUser = useUserStore((store) => store.user);

  return (
    <Menu as="div" className="relative ml-3 inline-flex">
      <div className="center flex">
        <Menu.Button className="relative flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Open user menu</span>
          <CircularAvatar
            size="sm"
            defaultToIcon={false}
            name={currentUser?.name}
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="absolute right-0 top-16 z-20 flex w-48 flex-col rounded-2xl bg-white pb-2 shadow-full focus:outline-none">
          <span className="p-4 text-base font-semibold text-black">
            {currentUser?.name}
          </span>
          <Button
            className="font-semibold text-neutrals-dark-300"
            variant="tertiary-link"
            size="sm"
            left={<ArrowLeftOnRectangleIcon />}
            onClick={() => logoutMutation()}
          >
            Log out
          </Button>
        </div>
      </Transition>
    </Menu>
  );
};
