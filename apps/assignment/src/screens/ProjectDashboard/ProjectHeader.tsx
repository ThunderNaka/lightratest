import { useNavigate } from "react-router-dom";

import { Button, icons } from "@lightit/ui";

import { Breadcrumbs } from "~/components";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { ROUTES } from "~/router";

const ProjectHeader = () => {
  const navigate = useNavigate();

  const { hasPermission } = usePermissions();
  const canCreateProject =
    hasPermission(PERMISSIONS.createClientProject) ||
    hasPermission(PERMISSIONS.createInternalProject);

  return (
    <header className="flex flex-col gap-4">
      <Breadcrumbs
        pages={[
          { name: "Home", href: ROUTES.base },
          { name: "Projects", href: ROUTES.projects.base },
        ]}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>

        <div className="flex items-center gap-2">
          {canCreateProject && (
            <Button
              variant="primary"
              size="sm"
              className="h-9 min-w-max"
              right={<icons.PlusIcon className="h-5 w-5 stroke-[3]" />}
              onClick={() => navigate(ROUTES.projects.newProject)}
            >
              New project
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default ProjectHeader;
