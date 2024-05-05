import type { FC, PropsWithChildren, ReactNode } from "react";

import { tw } from "@lightit/shared";

export interface AvatarGroupProps {
  className?: string;
  children?: ReactNode[];
}

export const AvatarGroup: FC<PropsWithChildren<AvatarGroupProps>> = ({
  children,
  className,
}) => {
  return (
    <div className="flex flex-row items-center justify-start">
      {children?.map((avatar, index) => (
        <div className={tw("-mr-5", className)} key={index}>
          {avatar}
        </div>
      ))}
    </div>
  );
};
