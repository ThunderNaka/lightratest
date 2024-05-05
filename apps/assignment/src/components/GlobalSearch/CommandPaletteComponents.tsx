import CommandPalette from "react-cmdk";

import { Loading } from "@lightit/ui";

export const CommandPaletteLoading = () => (
  <div aria-disabled className="mb-4 mt-2 flex flex-row gap-5 ">
    <div className="relative ml-6">
      <Loading className="scale-[0.18] text-gray-500" />
    </div>
    <span className="opacity-60 dark:text-white">Searching...</span>
  </div>
);

export interface CommandPaletteNoResultsProps {
  reset: () => void;
}

export const CommandPaletteNoResults = ({
  reset,
}: CommandPaletteNoResultsProps) => (
  <CommandPalette.ListItem
    key={0}
    index={0}
    id="goBack"
    closeOnSelect={false}
    icon="ArrowLeftIcon"
    onClick={reset}
  >
    No results found - Go back
  </CommandPalette.ListItem>
);
