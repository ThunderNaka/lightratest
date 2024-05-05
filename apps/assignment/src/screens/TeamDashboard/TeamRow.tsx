import { tw } from "@lightit/shared";
import {
  AvatarGroup,
  CircularAvatar,
  Dropdown,
  icons,
  Typography,
} from "@lightit/ui";

import type { Team } from "~/api/teams";
import { PERMISSIONS, usePermissions } from "~/hooks";

interface TeamRowProps {
  team: Team;
  onEdit: () => void;
  onDelete: () => void;
}

export const TeamRow = ({ team, onEdit, onDelete }: TeamRowProps) => {
  const { hasPermission } = usePermissions();
  return (
    <tr
      className="cursor-pointer bg-primary-white-300 shadow odd:bg-white"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        hasPermission(PERMISSIONS.updateTeam) && onEdit();
      }}
    >
      <td className="flex items-center py-6 pl-8">
        <CircularAvatar size="xs" defaultToIcon={false} name={team.name} />
        <Typography className="ml-2">{team.name}</Typography>
      </td>
      <td>
        <div className="flex items-center">
          <CircularAvatar
            size="xs"
            defaultToIcon={team.leader?.avatarUrl ? true : false}
            name={team.leader?.name}
            image={team.leader?.avatarUrl}
          />
          <Typography className="ml-2">{team.leader?.name}</Typography>
        </div>
      </td>

      <td className="">
        <AvatarGroup>
          {team.members.map((member) => (
            <CircularAvatar
              key={member.id}
              size="xs"
              defaultToIcon={member.avatarUrl ? true : false}
              name={member.name}
              image={member.avatarUrl}
            />
          ))}
        </AvatarGroup>
      </td>
      <td className="pr-4">
        <div className="float-right mr-2">
          {hasPermission(PERMISSIONS.updateTeam) && (
            <Dropdown
              containerClassName="w-fit"
              optionsContainerClassName="bg-primary-white-50 rounded-2xl py-4 w-32 gap-2 mt-0 border-0 shadow-full"
              renderButton={({ open, onClick }) => (
                <button onClick={onClick}>
                  <icons.EllipsisHorizontalIcon
                    className={tw(
                      "h-6 w-6 cursor-pointer text-neutrals-dark",
                      open && "text-secondary-500",
                    )}
                  />
                </button>
              )}
              options={[
                {
                  value: "edit",
                  label: "Edit",
                  left: <icons.PencilSquareIcon />,
                  onClick: () => onEdit(),
                },
                {
                  value: "delete",
                  label: "Delete",
                  left: <icons.TrashIcon />,
                  onClick: () => onDelete(),
                },
              ]}
            />
          )}
        </div>
      </td>
    </tr>
  );
};
