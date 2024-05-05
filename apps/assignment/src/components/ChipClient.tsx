import { tw } from "@lightit/shared";

import type { Client } from "~/api/clients";

export interface ChipClientProps {
  client: Client;
  className?: string;
}

export const ChipClient = ({ client, className }: ChipClientProps) => {
  return (
    <span
      className={tw(
        "truncate rounded px-2 py-1 text-xs",
        `bg-gray-200 text-black`,
        className,
      )}
    >
      {client.name}
    </span>
  );
};
