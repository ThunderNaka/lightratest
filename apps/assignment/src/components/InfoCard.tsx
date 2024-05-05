import type { FC } from "react";

import { Typography } from "@lightit/ui";

export interface InfoCardProps {
  title: string;
  value?: number;
}

// TODO: check this, it's currently unused, should we remove it?
export const InfoCard: FC<InfoCardProps> = ({ title, value }) => {
  return (
    <div className="flex w-fit items-center gap-2 rounded-lg border border-neutrals-medium-400 px-4 py-3">
      <Typography
        className="capitalize text-neutrals-medium-400"
        variant="small"
        font="semiBold"
      >
        {title}
      </Typography>
      <Typography
        className="text-neutrals-medium"
        variant="xlarge"
        font="semiBold"
      >
        {value}
      </Typography>
    </div>
  );
};
