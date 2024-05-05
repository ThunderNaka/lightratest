import { tw } from "@lightit/shared";
import { icons } from "@lightit/ui";

type IconMap = Record<string, JSX.Element>;

export const ChipStatus = ({ status }: { status?: string }) => {
  const iconMap: IconMap = {
    active: <icons.PlayCircleIcon />,
    paused: <icons.PauseCircleIcon />,
    archived: <icons.FolderMinusIcon />,
  };

  const icon = status ? iconMap[status] : null;

  return (
    <div
      className={tw(
        "flex flex-row items-center space-x-1.5 py-6",
        status === "active" && "text-green-600",
        status === "paused" && "text-yellow-600",
        status === "archived" && "text-neutrals-dark-200",
      )}
    >
      <div className="h-4 w-4">{icon}</div>
      <div className="text-xs capitalize">{status}</div>
    </div>
  );
};
