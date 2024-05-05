import { tw } from "@lightit/shared";
import { Button, icons } from "@lightit/ui";

import type { VIEW_MODE } from "~/shared.constants";

interface ProjectViewModeProps {
  selectedMode: typeof VIEW_MODE.LIST | typeof VIEW_MODE.GRID;
  setMode: (value: typeof VIEW_MODE.LIST | typeof VIEW_MODE.GRID) => void;
}

export const ProjectViewMode = ({
  selectedMode,
  setMode,
}: ProjectViewModeProps) => {
  const viewModes = [
    {
      label: "list",
      icon: <icons.Bars3Icon className="h-5 w-5" />,
    },
    {
      label: "grid",
      icon: <icons.Squares2X2Icon className="h-5 w-5" />,
    },
  ] as const;

  return (
    <div className="flex items-center gap-2">
      {viewModes.map((mode) => (
        <Button
          key={mode.label}
          onClick={() => setMode(mode.label)}
          className={tw(
            "rounded-md border border-nostalgia-purple-900 bg-white p-2 text-nostalgia-purple-900 hover:bg-nostalgia-purple-100 focus:bg-nostalgia-purple-100 active:bg-nostalgia-purple-100",
            selectedMode === mode.label &&
              "border-transparent bg-nostalgia-purple-100",
          )}
        >
          {mode.icon}
        </Button>
      ))}
    </div>
  );
};
