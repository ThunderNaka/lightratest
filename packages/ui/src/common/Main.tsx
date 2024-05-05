import type { ComponentPropsWithoutRef } from "react";

import { tw } from "@lightit/shared";

export type MainProps = ComponentPropsWithoutRef<"main">;

export const Main = ({ children, className, ...props }: MainProps) => (
  <main
    className={tw(
      className,
      "container mx-auto flex h-full flex-col items-center justify-around p-4 pb-16",
    )}
    {...props}
  >
    {children}
  </main>
);
