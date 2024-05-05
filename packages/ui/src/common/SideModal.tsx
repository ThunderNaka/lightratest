import { Fragment } from "react";
import type { ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { tw } from "@lightit/shared";

export interface SideModalProps {
  show: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export const SideModal = ({
  show,
  onClose,
  children,
  className,
}: SideModalProps) => {
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-500 sm:duration-700"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transform transition ease-in-out duration-500 sm:duration-700"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-700 bg-opacity-70 transition-all" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-fit">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    <div
                      className={tw(
                        "relative flex w-fit min-w-[30rem] flex-1 flex-col overflow-auto",
                        className,
                      )}
                    >
                      {children}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
