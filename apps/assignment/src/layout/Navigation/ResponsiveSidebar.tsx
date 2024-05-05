import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { tw } from "@lightit/shared";
import { icons } from "@lightit/ui";

import { Sidebar } from "./Sidebar";

export const ResponsiveSidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <>
      <button
        type="button"
        className="absolute left-6 top-3 p-2.5 text-white lg:hidden"
        onClick={() => setShowSidebar(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <icons.Bars3Icon
          className={tw(
            "h-8 w-8 text-white duration-300 hover:opacity-80",
            showSidebar && "opacity-0",
          )}
          aria-hidden="true"
        />
      </button>

      <Transition.Root show={showSidebar} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setShowSidebar}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-fit flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex justify-center pl-2 pt-5">
                    <button
                      type="button"
                      className="p-2"
                      onClick={() => setShowSidebar(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <icons.XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <Sidebar onLinkSelect={() => setShowSidebar(false)} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
