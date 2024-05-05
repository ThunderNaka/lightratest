import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { ScrollArea } from "@lightit/ui";

import { getProjectQuery } from "~/api/projects";
import { Breadcrumbs, ScreenLoading } from "~/components";
import { ROUTES } from "~/router";
import { errorToast } from "~/utils";
import { EmployeesTable } from "./EmployeesTable";
import { ProjectDetails } from "./ProjectDetails";

export const ProjectOverview = () => {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId ? parseInt(params.projectId) : null;

  const { data: project } = useQuery({
    ...getProjectQuery(projectId),
    onError: errorToast,
  });

  if (!project) {
    return <ScreenLoading />;
  }
  return (
    <ScrollArea>
      <div className="flex flex-col p-8">
        <Breadcrumbs
          pages={[
            { name: "Projects", href: ROUTES.projects.base },
            {
              name: project.name,
              href: `${ROUTES.projects.base}/${project.id}`,
            },
          ]}
        />
        <ProjectDetails project={project} />
        <EmployeesTable project={project} />
      </div>
    </ScrollArea>
  );
};
