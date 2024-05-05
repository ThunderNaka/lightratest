import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { Button, Chip, icons, IconWrapper, Input, Select } from "@lightit/ui";

import type { Technology } from "~/api/technologies";

export interface TechMultiSelectProps {
  options: { value: string; label: string }[];
  selectedTechnologies?: Technology[];
  onChange: (techs: { id: number; version: string }[]) => void;
}

// TODO: refactor this component so it's not as messy
export const TechMultiSelect = ({
  options,
  selectedTechnologies,
  onChange,
}: TechMultiSelectProps) => {
  const [selectedTechs, setSelectedTechs] = useState<
    { id: number; version: string }[]
  >(
    selectedTechnologies?.map((tech) => ({
      id: tech.id,
      version: tech.version ?? "",
    })) ?? [],
  );

  const [selectedTechId, setSelectedTechId] = useState("");
  const [selectedTechVersion, setSelectedTechVersion] = useState("");

  useEffect(() => {
    onChange(selectedTechs);
  }, [selectedTechs, onChange]);

  const handleOnClick = () => {
    const tech = {
      id: +selectedTechId,
      version: selectedTechVersion,
    };

    if (
      selectedTechs.some((t) => t.id === tech.id && t.version === tech.version)
    ) {
      setSelectedTechVersion("");
      return;
    }

    setSelectedTechs([...selectedTechs, tech]);
    setSelectedTechVersion("");
  };

  const handleDeleteTech = (tech: { id: number; version: string }) => {
    setSelectedTechs(
      selectedTechs.filter(
        (t) => t.id !== tech.id || t.version !== tech.version,
      ),
    );
  };

  return (
    <div className="mb-6 grid w-full grid-cols-2 justify-between gap-x-4 gap-y-4">
      <Select
        label="Language / Framework"
        placeholder={options[0]?.label ?? "Select Project Language / Framework"}
        options={options}
        value={selectedTechId}
        onChange={setSelectedTechId}
      />
      <div className="flex">
        <Input
          id="technologyVersion"
          label="Version"
          placeholder="Type the version"
          className="rounded-r-none"
          containerClassName="w-full"
          value={selectedTechVersion}
          onChange={(e) => setSelectedTechVersion(e.target.value)}
        />
        <Button
          className="flex h-12 w-11 items-center justify-center self-end rounded-l-none"
          disabled={!selectedTechId}
          onClick={handleOnClick}
        >
          <IconWrapper>
            <icons.CheckIcon />
          </IconWrapper>
        </Button>
      </div>

      {!!selectedTechs.length && (
        <div className="col-span-2 flex flex-wrap gap-2 rounded-md bg-neutrals-light-200 p-3">
          {selectedTechs.map((tech) => (
            <Chip
              className="bg-secondary-500 text-white"
              key={`${tech.id}${tech.version}`}
            >
              <div className="flex items-center gap-1">
                <span>
                  {`${options.find((opt) => opt.value === `${tech.id}`)
                    ?.label} ${tech.version}`}{" "}
                </span>

                <button onClick={() => handleDeleteTech(tech)}>
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

export interface HookedTechMultiSelectProps<TFieldValues extends FieldValues>
  extends Omit<TechMultiSelectProps, "onChange"> {
  control: Control<TFieldValues>;
  id: FieldPath<TFieldValues>;
}

export const HookedTechMultiSelect = <TFieldValues extends FieldValues>({
  control,
  id,
  ...props
}: HookedTechMultiSelectProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={id}
      render={(renderProps) => {
        const defaultValue = renderProps?.formState?.defaultValues?.[id] ?? [];
        return (
          <TechMultiSelect
            {...props}
            onChange={renderProps.field.onChange}
            selectedTechnologies={defaultValue}
          />
        );
      }}
    />
  );
};
