import { Fragment } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { tw } from "@lightit/shared";

import { icons } from "./Icons";
import { Overlay } from "./Overlay";

export type LoadingProps = ComponentPropsWithoutRef<"div"> & {
  iconClassName?: string;
  transparent?: boolean;
};

export const Loading = ({
  className,
  iconClassName,
  transparent,
  ...props
}: LoadingProps) => (
  <div
    className={tw(
      "absolute inset-0 flex items-center justify-center bg-opacity-50",
      !transparent && "bg-base-content",
      className,
    )}
    {...props}
  >
    <icons.SpinnerIcon className={iconClassName} />
  </div>
);

export const ScreenLoading = ({
  className,
  iconClassName,
  ...props
}: LoadingProps) => (
  <Transition.Root show as={Fragment}>
    <Dialog
      as="div"
      onClose={() => null}
      className={tw(
        "absolute inset-0 z-10 flex items-center justify-center",
        className,
      )}
      {...props}
    >
      <Overlay />
      <icons.SpinnerIcon className={tw(iconClassName, "text-base-content")} />
    </Dialog>
  </Transition.Root>
);
