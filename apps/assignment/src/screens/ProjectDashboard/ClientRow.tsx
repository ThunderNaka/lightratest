import { tw } from "@lightit/shared";
import { CircularAvatar, Dropdown, icons, Typography } from "@lightit/ui";

import type { ClientWithProjects } from "~/api/clients";
import { ChipProject, ChipStatus } from "~/components";
import { formatBackendDate } from "~/utils";

export const ClientRow = ({
  client,
  onViewClient,
}: {
  client: ClientWithProjects;
  onViewClient: (clientId: number) => void;
}) => {
  return (
    <tr className="even:bg-neutrals-medium-100">
      <td className="flex items-center gap-2 pl-8 align-top">
        <CircularAvatar size="xs" defaultToIcon={false} name={client.name} />
        <Typography variant="small">{client.name}</Typography>
      </td>
      <td className="align-top">
        <Typography font="regular">
          {formatBackendDate(client.createdAt)}
        </Typography>
      </td>
      <td className="py-6 align-top">
        <div className="mr-4 flex flex-wrap items-start gap-3">
          {client.projects.map((project) => (
            <ChipProject key={project.id} project={project} />
          ))}
        </div>
      </td>

      <td className="align-top">
        {client.projects.some((project) => project.status === "active") ? (
          <ChipStatus status={"active"} />
        ) : (
          <ChipStatus status={"paused"} />
        )}
      </td>
      <td className="py-4 pr-8 align-top" align="right">
        <Dropdown
          containerClassName="w-fit"
          optionsContainerClassName="bg-primary-white-50 rounded-2xl py-4 w-32 gap-2"
          label="..."
          renderButton={({ open, onClick }) => (
            <div
              className={tw(
                "flex h-9 w-9 cursor-pointer items-center justify-center rounded-md",
                open && "bg-secondary-50",
              )}
            >
              <button onClick={onClick}>
                <icons.EllipsisVerticalIcon className="h-6 w-6 text-secondary-500" />
              </button>
            </div>
          )}
          options={[
            {
              value: "edit",
              label: "Edit",
              left: <icons.PencilSquareIcon />,
              onClick: () => onViewClient(client.id),
            },
          ]}
        />
      </td>
    </tr>
  );
};
