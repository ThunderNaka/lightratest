import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { forwardRef, tw } from "@lightit/shared";

export interface TooltipProps
  extends Omit<
    ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>,
    "content"
  > {
  align?: "start" | "center" | "end";
  children?: ReactNode;
  content: ReactNode;
  contentClassName?: string;
  arrowClassName?: string;
  side?: "top" | "right" | "bottom" | "left";
  onOpenChange?: (open: boolean) => void;
}

export const Tooltip = forwardRef(
  (
    {
      align = "center",
      children,
      className,
      content,
      contentClassName,
      side = "top",
      arrowClassName = "fill-white",
      onOpenChange,
      ...props
    }: TooltipProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => (
    <TooltipPrimitive.Provider delayDuration={0}>
      <TooltipPrimitive.Root onOpenChange={onOpenChange}>
        <TooltipPrimitive.Trigger
          ref={ref}
          onClick={(e) => e.stopPropagation()}
          className={tw(
            "flex flex-shrink-0 items-center justify-center rounded-full",
            className,
          )}
          {...props}
        >
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            asChild
            side={side}
            sideOffset={5}
            align={align}
          >
            <div
              className={tw(
                "z-50 select-none rounded-lg bg-white p-2 text-xs leading-none text-neutrals-dark-400 shadow-full will-change-[transform,opacity] animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                contentClassName,
              )}
            >
              {content}
              <TooltipPrimitive.Arrow className={tw(arrowClassName)} />
            </div>
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  ),
);
