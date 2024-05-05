import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { Button, Chip, icons, IconWrapper, Input } from "@lightit/ui";

import type { Utility } from "~/api/projects";

export interface UtilitiesMultiSelectProps {
  options: { value: string; label: string }[];
  storedUtilities?: Utility[];
  onChange: (utilities: { name: string; url: string }[]) => void;
}

export const UtilitiesMultiSelect = ({
  storedUtilities,
  onChange,
}: UtilitiesMultiSelectProps) => {
  const [selectedUtilities, setSelectedUtilities] = useState<
    { name: string; url: string }[]
  >(
    storedUtilities?.map((utility) => ({
      name: utility.name,
      url: utility.url ?? "",
    })) ?? [],
  );
  const [selectedUtilityUrl, setSelectedUtilityUrl] = useState("");
  const [selectedUtilityName, setSelectedUtilityName] = useState("");

  useEffect(() => {
    onChange(selectedUtilities);
  }, [selectedUtilities, onChange]);

  const handleUrlOnClick = () => {
    const utility = { name: selectedUtilityName, url: selectedUtilityUrl };

    if (!selectedUtilities.some((t) => t.name === utility.name)) {
      setSelectedUtilities([...selectedUtilities, utility]);
    }
    setSelectedUtilityName("");
    setSelectedUtilityUrl("");
  };

  const handleDeleteUtility = (utility: { name: string; url: string }) => {
    setSelectedUtilities(
      selectedUtilities.filter((t) => t.url !== utility.url),
    );
  };

  return (
    <div className="mb-6 grid w-full grid-cols-2 justify-between gap-x-4 gap-y-4">
      <Input
        id="labelName"
        label="Name"
        placeholder="Enter the utility name"
        containerClassName="w-full"
        value={selectedUtilityName}
        onChange={(e) => setSelectedUtilityName(e.target.value)}
      />
      <div className="flex items-center">
        <Input
          id="utilitiesUrl"
          label="Url"
          placeholder="Paste a valid URL"
          className="rounded-r-none"
          containerClassName="w-full"
          value={selectedUtilityUrl}
          onChange={(e) => setSelectedUtilityUrl(e.target.value)}
        />
        <Button
          className="flex h-12 w-11 items-center justify-center self-end rounded-l-none"
          disabled={selectedUtilityUrl === "" ?? selectedUtilityName === ""}
          onClick={handleUrlOnClick}
        >
          <IconWrapper>
            <icons.CheckIcon />
          </IconWrapper>
        </Button>
      </div>

      {!!selectedUtilities.length && (
        <div className="col-span-2 flex flex-wrap gap-2 rounded-md bg-neutrals-light-200 p-3">
          {selectedUtilities.map((utility) => (
            <Chip
              className="bg-secondary-500 text-white"
              key={`${utility.name}${utility.url}`}
            >
              <div className="flex items-center gap-1">
                <span>{utility.name}</span>

                <button onClick={() => handleDeleteUtility(utility)}>
                  <IconWrapper className="h-3 w-3 cursor-pointer hover:text-violet-200">
                    <icons.XMarkIcon />
                  </IconWrapper>
                </button>
              </div>
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
};

export interface HookedUtilitiesMultiSelectProps<
  TFieldValues extends FieldValues,
> extends Omit<UtilitiesMultiSelectProps, "onChange"> {
  control: Control<TFieldValues>;
  id: FieldPath<TFieldValues>;
}

export const HookedUtilitiesMultiSelect = <TFieldValues extends FieldValues>({
  control,
  id,
  ...props
}: HookedUtilitiesMultiSelectProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={id}
      render={(renderProps) => {
        const defaultValue = renderProps?.formState?.defaultValues?.[id] ?? [];
        return (
          <UtilitiesMultiSelect
            {...props}
            onChange={renderProps.field.onChange}
            storedUtilities={defaultValue}
          />
        );
      }}
    />
  );
};
