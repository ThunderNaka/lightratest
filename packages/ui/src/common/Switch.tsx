import { forwardRef } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { tw } from "@lightit/shared";

export type SwitchProps = React.ComponentPropsWithoutRef<
  typeof SwitchPrimitive.Root
> & {
  labels?: [string, string];
};

export const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, labels, ...props }, ref) => {
  return (
    <SwitchPrimitive.Root
      className={tw(
        "group peer inline-flex h-6 w-[3.75rem] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent text-white transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-nostalgia-purple-100 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-nostalgia-purple-900 data-[state=unchecked]:bg-primary-100",
        className,
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitive.Thumb
        className={tw(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-9 data-[state=unchecked]:translate-x-0",
        )}
      />
      {labels && (
        <SwitchPrimitive.Thumb
          aria-label={labels[0]}
          aria-labelledby={labels[1]}
          className={tw(
            "w-8 truncate px-0.5 text-sm transition-transform data-[state=checked]:-translate-x-4 data-[state=unchecked]:translate-x-1",
            `data-[state=checked]:after:content-[attr(aria-label)] data-[state=unchecked]:after:content-[attr(aria-labelledby)]`,
          )}
        />
      )}
    </SwitchPrimitive.Root>
  );
});
Switch.displayName = SwitchPrimitive.Root.displayName;
