import { Link } from "react-router-dom";

import { tw } from "@lightit/shared";
import { getTextColor } from "@lightit/ui";

import { ROUTES } from "~/router";
import type { Project } from "~/shared.types";

export interface ChipProjectProps {
  project: Project;
  className?: string;
}

export const ChipProject = ({ project, className }: ChipProjectProps) => {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  return (
    <Link
      onClick={(e) => handleClick(e)}
      to={`${ROUTES.projects.base}/${project.id}`}
      title={`Go to ${project.name}`}
      className={tw(
        "max-w-md overflow-hidden truncate rounded px-2 py-1 text-sm hover:opacity-75 hover:shadow",
        `bg-${project.color} text-${getTextColor(project.color)}`,
        className,
      )}
    >
      {project.name}
    </Link>
  );
};
