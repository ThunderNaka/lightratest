import type { ComponentPropsWithoutRef, FC } from "react";
import { first } from "lodash/fp";

import { tw } from "@lightit/shared";

import { AvatarSvg } from "../assets";

export const avatarSizes = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;
export type AvatarSize = (typeof avatarSizes)[number];

export interface AvatarProps extends ComponentPropsWithoutRef<"div"> {
  size: AvatarSize;
  defaultToIcon?: boolean;
  image?: string;
  name?: string;
  className?: string;
}

export const CircularAvatar: FC<AvatarProps> = ({
  size,
  image,
  className,
  name,
  defaultToIcon = true,
  ...props
}) => {
  return (
    <div
      className={tw(
        "flex flex-shrink-0 items-center justify-center rounded-full bg-primary-400 bg-cover",
        size === "xs" && "h-9 w-9",
        size === "sm" && "h-9 w-9",
        size === "md" && "h-12 w-12",
        size === "lg" && "h-16 w-16",
        size === "xl" && "h-20 w-20",
        size === "2xl" && "h-32 w-32",
        className,
      )}
      style={{
        backgroundImage: defaultToIcon
          ? `url('${image ? image : AvatarSvg}')`
          : undefined,
      }}
      {...props}
    >
      {!defaultToIcon && (
        <span
          className={tw(
            "font-bold uppercase text-white",
            size === "xs" && "text-xs",
            size === "sm" && "text-xs",
            size === "md" && "text-lg",
            size === "lg" && "text-xl",
            size === "xl" && "text-2xl",
            size === "2xl" && "text-3xl",
          )}
        >
          {name?.split(" ").slice(0, 2).map(first)}
        </span>
      )}
    </div>
  );
};
