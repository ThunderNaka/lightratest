import React from "react";
import type { ReactElement } from "react";

import { tw } from "@lightit/shared";
import { Button, IconWrapper } from "@lightit/ui";

export interface ToggleViewOption<T extends string> {
  icon: ReactElement;
  value: T;
}

export interface ToggleViewProps<T extends string> {
  options: readonly ToggleViewOption<T>[];
  selected: ToggleViewOption<T>;
  onChange: (view: ToggleViewOption<T>) => void;
}

export const ToggleView = <T extends string>({
  options,
  selected,
  onChange,
}: ToggleViewProps<T>) => {
  return (
    <div className="flex gap-2">
      {options.map((option) => {
        const isSelected = selected.value === option.value;
        return (
          <Button
            key={option.value}
            size="sm"
            className={tw(
              !isSelected && "bg-transparent text-neutrals-medium-300",
            )}
            onClick={() => onChange(option)}
            variant="secondary"
          >
            <IconWrapper>{option.icon}</IconWrapper>
          </Button>
        );
      })}
    </div>
  );
};
