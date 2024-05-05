import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Button,
  Checkbox,
  HookedSelect,
  icons,
  IconWrapper,
  Label,
  Popover,
  ScrollArea,
} from "@lightit/ui";

import { getTopicsQuery } from "~/api/courses";

export const filtersSchema = z.object({
  status: z.array(z.string()),
  topic_id: z.array(z.number()),
  name: z.string(),
});

export type FiltersValues = z.infer<typeof filtersSchema>;

const emptyValues: FiltersValues = {
  status: [],
  topic_id: [],
  name: "",
};

interface FiltersProps {
  defaultValues: FiltersValues;
  onFilterApply: (values: FiltersValues) => void;
}

export const Filters = ({ defaultValues, onFilterApply }: FiltersProps) => {
  const [open, setOpen] = useState(false);

  const { control, handleSubmit, reset, setValue, register } =
    useForm<FiltersValues>({
      resolver: zodResolver(filtersSchema),
      defaultValues,
    });

  const { data: topics } = useQuery({
    ...getTopicsQuery(),
    initialData: [],
    keepPreviousData: true,
    select: (data) =>
      data.map((topic) => ({
        value: topic.id,
        label: topic.name,
      })),
  });

  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        !!value && reset(defaultValues);
      }}
      trigger={
        <Button variant="secondary" size="sm" right={<icons.FunnelIcon />}>
          Filter
        </Button>
      }
      content={
        <form
          className="flex flex-col gap-8"
          onSubmit={(e) => {
            void handleSubmit((values) => {
              onFilterApply(values);
              setOpen(false);
            })(e);
          }}
        >
          <ScrollArea className="h-auto">
            <div className="flex max-h-[calc(100vh-22rem)] w-[34rem] flex-col gap-6 p-4 pb-0">
              <div className="flex items-end gap-3">
                <HookedSelect
                  id="topic_id"
                  multiple
                  label="Topics"
                  placeholder="All topics"
                  options={topics}
                  control={control}
                  containerClassName="grow"
                />
                <IconWrapper className="pb-9">
                  <icons.XMarkIcon
                    className="h-5 w-5 cursor-pointer text-primary-300 hover:text-complementary-red-600"
                    onClick={() => setValue("topic_id", [])}
                  />
                </IconWrapper>
              </div>

              <div className="flex flex-col gap-3">
                <Label
                  label={"Assignments Status"}
                  className="text-neutrals-dark-300"
                />

                <div className="flex gap-3">
                  {["Available", "Deprecated"].map((status) => (
                    <Checkbox
                      key={status}
                      label={status}
                      value={status.toLocaleLowerCase()}
                      {...register("status")}
                    />
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="flex flex-row justify-end gap-4 p-4 pt-0">
            <Button
              onClick={() => {
                onFilterApply(emptyValues);
                setOpen(false);
              }}
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
