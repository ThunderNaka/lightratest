import type { ComponentPropsWithoutRef } from "react";

import { tw } from "@lightit/shared";
import { Loading } from "@lightit/ui";

interface ScreenLoadingProps extends ComponentPropsWithoutRef<"div"> {
  loadingProps?: string;
}

export const ScreenLoading = (props: ScreenLoadingProps) => {
  const { className, loadingProps } = props;

  return (
    <div
      className={tw(
        "flex h-full w-full items-center justify-center",
        className,
      )}
    >
      <Loading className={tw("scale-50", loadingProps)} />
    </div>
  );
};
