import React from "react";

import { tw } from "@lightit/shared";

const availableColors = [
  "gray",
  "red",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
  "pink",
] as const;
const availableVariants = [
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
] as const;

export type AvailableBaseColor = (typeof availableColors)[number];
export type AvailableVariant = (typeof availableVariants)[number];
export type AvailableColor = `${AvailableBaseColor}-${AvailableVariant}`;

interface ColorPickerProps {
  value: string;
  onChange: (
    newColor: AvailableColor,
    newBaseColor: AvailableBaseColor,
    newVariant: AvailableVariant,
  ) => void;
}

// TODO: keyboard navigation
export const ColorPicker = ({ value, onChange }: ColorPickerProps) => (
  <div className="w-[250px] rounded-lg bg-white p-2 drop-shadow-md">
    <div className="flex w-full justify-evenly">
      {availableColors.map((baseColor) => (
        <div key={baseColor} className="flex h-full flex-col justify-evenly">
          {availableVariants.map((variant) => {
            const color: AvailableColor = `${baseColor}-${variant}`;

            return (
              <button
                type="submit"
                title={color}
                className={tw(
                  `bg-${color}`,
                  "m-0.5 rounded-full p-2 hover:opacity-60",
                  value === color && "animate-bounce",
                )}
                key={variant}
                onClick={() => {
                  onChange(color, baseColor, variant);
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  </div>
);
