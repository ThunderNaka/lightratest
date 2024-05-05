import { Link } from "react-router-dom";

import { tw } from "@lightit/shared";
import { Chip } from "@lightit/ui";

import { ROUTES } from "~/router";
import { PROJECT_STATUS, PROJECT_TYPE } from "~/shared.constants";
import type { ProjectStatus, ProjectType } from "~/shared.types";

interface ProjectCardLinkProps {
  id: number;
  status: ProjectStatus;
  type: ProjectType;
  name: string;
}

function ProjectCardLink({ id, status, type, name }: ProjectCardLinkProps) {
  return (
    <Link
      to={`${ROUTES.projectsNew}/${id}`}
      className="w-fit underline-offset-2"
    >
      <h4 className="flex items-center gap-2 font-semibold text-neutrals-dark-900">
        <div
          className={tw(
            "aspect-square h-2 rounded-full",
            status === PROJECT_STATUS.ARCHIVED && "bg-complementary-red-500",
            status === PROJECT_STATUS.PAUSED && "bg-complementary-yellow-500",
            status === PROJECT_STATUS.ACTIVE && "bg-complementary-green-500",
          )}
        />
        <span className="truncate hover:underline">{name}</span>
        <Chip
          className={tw(
            "min-w-fit capitalize text-complementary-green-50",
            type === PROJECT_TYPE.CLIENT && `bg-complementary-blue-500`,
            type === PROJECT_TYPE.INTERNAL && `bg-nostalgia-purple-500`,
          )}
        >
          {type}
        </Chip>
      </h4>
    </Link>
  );
}

export default ProjectCardLink;
