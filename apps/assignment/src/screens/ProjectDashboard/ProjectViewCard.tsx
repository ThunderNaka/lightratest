import { ScrollArea } from "@lightit/ui";

import { MODAL_ROUTES, useNavigateModal } from "~/router";
import { MOCK_PROJECTS } from "../../mocks/projectMock";
import ProjectCardActions from "./ProjectCard/ProjectCardActions";
import ProjectCardLink from "./ProjectCard/ProjectCardLink";

const ProjectViewCard = () => {
  const navigateModal = useNavigateModal();

  return (
    <ScrollArea>
      <div className="grid grid-cols-2 gap-6">
        {MOCK_PROJECTS.map((project) => (
          <div
            key={project.id}
            className="space-y-2 rounded-lg border border-neutrals-medium-300 p-6"
          >
            <div className="flex items-center justify-between">
              <ProjectCardLink
                id={project.id}
                status={project.status}
                type={project.type}
                name={project.name}
              />
              <ProjectCardActions
                id={project.id}
                accountManager={project.accountManager}
                techLead={project.techLead}
                projectManager={project.projectManager}
              />
            </div>

            <div className="flex items-center gap-3 text-sm font-medium">
              <button
                className="capitalize text-complementary-blue-500 hover:text-complementary-blue-500/90 hover:underline"
                onClick={() =>
                  navigateModal(
                    `${MODAL_ROUTES.clientForm}/${project.client.id}`,
                  )
                }
              >
                {project.client?.name}
              </button>
              <p className="text-neutrals-dark-900">Mental Health</p>
            </div>

            <p className="mt-2 line-clamp-4 text-sm text-neutrals-dark-500">
              {project.description}
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ProjectViewCard;
