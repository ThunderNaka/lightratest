import React from "react";

import { Switch } from "@lightit/ui";

export interface AlphabeticalSortProps {
  checked: boolean;
  onChange: () => void;
}

// TODO: check this, it's currently unused, should we remove it?
export const AlphabeticalSort = ({
  checked,
  onChange,
}: AlphabeticalSortProps) => {
  return (
    <div className="text-base text-primary-white-600">
      A - Z
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
};
