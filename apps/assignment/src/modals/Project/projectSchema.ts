import { z } from "zod";
import type { ZodLiteral } from "zod";

import { parseFormDate } from "~/utils";
import { projectInfoSchema } from "./ProjectInfoForm";
import { projectUsefulLinksSchema } from "./ProjectUsefulLinksForm";

const projectStatuses = [
  { label: "Active", value: "active" },
  { label: "Paused", value: "paused" },
  { label: "Archived", value: "archived" },
] as const;

export const projectSchema = projectInfoSchema
  .merge(projectUsefulLinksSchema)
  .extend({
    projectId: z.number().optional(),
    status: z.union(
      projectStatuses.map((p) => z.literal(p?.value)) as [
        ZodLiteral<"active">,
        ZodLiteral<"paused">,
        ZodLiteral<"archived">,
      ],
    ),
  })
  .refine(
    (data) => parseFormDate(data.startDate) < parseFormDate(data.endDate),
    {
      path: ["startDate"],
      message: "The start date must be earlier than the end date",
    },
  );

export type ProjectFormValues = z.infer<typeof projectSchema>;
