import type { ReactNode } from "react";

import { tw } from "@lightit/shared";

export const Row = ({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className="flex flex-row items-stretch gap-12 border-b">
    <div className="flex w-32 items-center  justify-center border-r px-2 text-center">
      {title}
    </div>
    <div className={tw("flex-1 p-2", className)}>{children}</div>
  </div>
);
