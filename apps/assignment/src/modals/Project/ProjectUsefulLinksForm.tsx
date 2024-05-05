import { useQuery } from "@tanstack/react-query";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { z } from "zod";

import { HookedSelect } from "@lightit/ui";

import { getIntegrations } from "~/api/integrations";
import { getTechnologiesQuery } from "~/api/technologies";
import { errorToast } from "~/utils";
import { HookedTechMultiSelect } from "./TechMultiSelect";
import { HookedUtilitiesMultiSelect } from "./UtilitiesMultiSelect";

export const projectUsefulLinksSchema = z.object({
  environment: z.object({
    staging: z.string(),
    development: z.string(),
    production: z.string(),
  }),
  technologies: z.array(
    z.object({
      id: z.number(),
      version: z.string(),
    }),
  ),
  utilities: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    }),
  ),
  integrations: z.array(z.number()),
});

export type ProjectUsefulLinksFormValues = z.infer<
  typeof projectUsefulLinksSchema
>;

interface ProjectUsefulLinksFormProps {
  control: Control<ProjectUsefulLinksFormValues>;
  errors: FieldErrors<ProjectUsefulLinksFormValues>;
  register: UseFormRegister<ProjectUsefulLinksFormValues>;
}
export const ProjectUsefulLinksForm = ({
  control,
}: ProjectUsefulLinksFormProps) => {
  const { data: technologiesResponse } = useQuery({
    ...getTechnologiesQuery(),
    onError: errorToast,
  });
  const { data: integrationsResponse } = useQuery({
    queryFn: getIntegrations,
    queryKey: ["getIntegrations"],
    onError: errorToast,
  });
  return (
    <div className="grid grow grid-cols-2 gap-x-4 gap-y-2 overflow-y-auto pl-8 pr-6 pt-12">
      <div className="col-span-2 flex flex-col">
        <h3 className="mb-6">Utilities</h3>
        <HookedUtilitiesMultiSelect
          id="utilities"
          control={control}
          options={[]}
        />
      </div>
      <div className="col-span-2 flex flex-col">
        <h3 className="mb-6">Technologies</h3>
        <HookedTechMultiSelect
          id="technologies"
          control={control}
          options={
            technologiesResponse?.map((tech) => ({
              value: `${tech.id}`,
              label: tech.name,
            })) ?? []
          }
        />
      </div>
      <div className="col-span-2 flex flex-col">
        <h3 className="mb-6">Integrations</h3>
        <HookedSelect
          multiple
          id="integrations"
          control={control}
          options={
            integrationsResponse?.map((integration) => ({
              value: integration.id,
              label: integration.name,
            })) ?? []
          }
        />
      </div>
    </div>
  );
};
