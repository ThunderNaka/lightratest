import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Button,
  Checkbox,
  HookedSelect,
  icons,
  IconWrapper,
  Popover,
  ScrollArea,
} from "@lightit/ui";

import {
  PROJECT_STATUS_OPTIONS,
  PROJECT_TYPE_OPTIONS,
} from "~/shared.constants";

const TRAFFIC_STATUS = [
  { label: "On track", value: "on-track" },
  { label: "Moderate risk", value: "moderate-risk" },
  { label: "Off track", value: "off-track" },
] as const;

const topicOptions = [
  { label: "Healthcare", value: "healthcare" },
  { label: "AI", value: "ai" },
] as const;

const toolsOptions = [
  { label: "Figma", value: "figma" },
  { label: "Github", value: "github" },
  { label: "AWS", value: "aws" },
] as const;

const defaultValues = {
  topics: [],
  tools: [],
  projectType: ["client", "internal"],
  trafficStatus: ["on-track", "moderate-risk", "off-track"],
  projectStatus: ["active"],
};

export const ProjectViewFilters = () => {
  const [open, setOpen] = useState(false);

  const { control, register, setValue } = useForm({ defaultValues });

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="secondary" size="sm" right={<icons.FunnelIcon />}>
          Filter
        </Button>
      }
      content={
        <form className="flex flex-col gap-8" onSubmit={() => setOpen(false)}>
          <ScrollArea className="h-auto">
            <div className="flex max-h-[calc(100vh-22rem)] w-[34rem] flex-col gap-6 p-4 pb-0">
              <div className="flex items-end gap-3">
                <HookedSelect
                  autocomplete
                  multiple
                  id="topics"
                  containerClassName="w-full"
                  label="Topics"
                  placeholder="Select a topic"
                  control={control}
                  options={topicOptions}
                />
                <IconWrapper className="pb-9">
                  <icons.XMarkIcon
                    className="h-5 w-5 cursor-pointer text-primary-300 hover:text-complementary-red-600"
                    onClick={() => setValue("topics", [])}
                  />
                </IconWrapper>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-sm">Project type</h2>
                <div className="flex items-center gap-8">
                  {PROJECT_TYPE_OPTIONS.map(({ value, label }) => (
                    <Checkbox
                      key={value}
                      label={label}
                      value={value}
                      {...register("projectType")}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-end gap-3">
                <HookedSelect
                  autocomplete
                  multiple
                  id="tools"
                  label="Tools"
                  placeholder="Select tools"
                  options={toolsOptions}
                  control={control}
                  containerClassName="grow"
                />
                <IconWrapper className="pb-9">
                  <icons.XMarkIcon
                    className="h-5 w-5 cursor-pointer text-primary-300 hover:text-complementary-red-600"
                    onClick={() => setValue("tools", [])}
                  />
                </IconWrapper>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-sm">Traffic status</h2>
                <div className="flex items-center gap-8">
                  {TRAFFIC_STATUS.map(({ value, label }) => (
                    <Checkbox
                      key={value}
                      label={label}
                      value={value}
                      {...register("trafficStatus")}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-sm">Project status</h2>
                <div className="flex items-center gap-8">
                  {PROJECT_STATUS_OPTIONS.map(({ value, label }) => (
                    <Checkbox
                      key={value}
                      label={label}
                      value={value}
                      {...register("projectStatus")}
                    />
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="flex flex-row justify-end gap-4 p-4 pt-0">
            <Button
              onClick={() => setOpen(false)}
              size="sm"
              variant="outline"
              className="w-32"
            >
              Clear Filters
            </Button>
            <Button type="submit" size="sm" className="w-32">
              Apply
            </Button>
          </div>
        </form>
      }
    />
  );
};
