import { Button, icons } from "@lightit/ui";

import { Breadcrumbs } from "~/components";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { ROUTES } from "~/router";
import ProjectStatus from "./ProjectStatus";

interface ProjectDetailsHeaderProps {
  name: string;
  status: "archived" | "paused" | "active";
  id: number;
}

const ProjectDetailsHeader = ({
  name,
  status,
  id,
}: ProjectDetailsHeaderProps) => {
  const { hasPermission } = usePermissions();
  const canEditProject = hasPermission(PERMISSIONS.updateProject);

  return (
    <header className="flex flex-col gap-4">
      <Breadcrumbs
        pages={[
          { name: "Home", href: ROUTES.base },
          { name: "Projects", href: ROUTES.projects.base },
          {
            name: name,
            href: `${ROUTES.projects.base}/${id}`,
          },
        ]}
      />

      <div className="flex items-center justify-between">
        <ProjectStatus name={name} status={status} />

        <div className="flex items-center gap-2">
          {canEditProject && (
            <Button
              variant="primary"
              size="sm"
              className="h-9 min-w-max"
              right={<icons.PlusIcon className="h-5 w-5 stroke-[3]" />}
            >
              Edit Project
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default ProjectDetailsHeader;
