import * as Accordion from "@radix-ui/react-accordion";

import { icons, ScreenLoading } from "@lightit/ui";

import { MOCK_PROJECTS } from "~/mocks/projectMock";
import ProjectDetailsDates from "./ProjectDetailsDates";
import ProjectDetailsHeader from "./ProjectDetailsHeader";
import ProjectEmployeeCard from "./ProjectEmployeeCard";
import ProjectListItem from "./ProjectListItem";
import ProjectListItems from "./ProjectListItems";
import ProjectTrafficStatus from "./ProjectTrafficStatus";

const ProjectDetails = () => {
  const project = MOCK_PROJECTS[0];

  if (!project) {
    return <ScreenLoading />;
  }

  return (
    <div className="flex grow flex-col gap-6 p-8">
      <ProjectDetailsHeader
        name={project.name}
        id={project.id}
        status={project.status}
      />

      <div className="flex items-center justify-between">
        <ProjectDetailsDates
          startDate={project.startDate}
          endDate={project.endDate}
        />
        <ProjectTrafficStatus trafficStatus="on-track" />
      </div>

      <div>
        <Accordion.Root
          type="single"
          collapsible
          defaultValue={`${project.id}`}
        >
          <Accordion.Item
            value={`${project.id}`}
            className="overflow-hidden rounded-2xl border border-neutrals-medium-200 bg-neutrals-light-200"
          >
            <Accordion.Trigger className="flex w-full items-center p-6 duration-300 data-[state=open]:rounded-b-none [&[data-state=open]>div:last-child>svg]:rotate-90 [&[data-state=open]>div:nth-child(even)]:hidden">
              <h2 className="flex-1 text-left text-sm font-semibold capitalize text-nostalgia-purple-900">
                {project.client.name}
              </h2>
              {project.projectManager && (
                <div className="flex items-center justify-end gap-2 text-sm">
                  <span className="font-semibold text-neutrals-dark-500">
                    Project manager:
                  </span>
                  <span className="text-nostalgia-purple-900">
                    {project.projectManager?.name}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-end gap-1.5 px-4 py-2 text-sm text-nostalgia-purple-900">
                <icons.ChevronRightIcon
                  className="h-4 w-4 shrink-0 stroke-[3] duration-200"
                  aria-hidden="true"
                />
              </div>
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden px-6 pb-6 text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="flex gap-6">
                <div className="w-full max-w-xl space-y-4 divide-y divide-neutrals-medium-300 text-sm text-neutrals-dark-500">
                  <div className="space-y-2">
                    <p className="font-semibold">Project description</p>
                    <p>{project.description}</p>
                  </div>
                  <div className="space-y-4 pt-4">
                    <ProjectListItems title="Utilities">
                      {project.utilities.map((utility) => (
                        <ProjectListItem name={utility.name} key={utility.id} />
                      ))}
                    </ProjectListItems>
                    <ProjectListItems title="Technologies">
                      {project.technologies.map((tech) => (
                        <ProjectListItem name={tech.name} key={tech.id} />
                      ))}
                    </ProjectListItems>
                    <ProjectListItems title="Integrations">
                      {project.integrations.map((int) => (
                        <ProjectListItem name={int.name} key={int.id} />
                      ))}
                    </ProjectListItems>
                  </div>
                </div>
                <div className="space-y-6">
                  <p className="text-sm font-semibold text-neutrals-dark-500">
                    Leaders
                  </p>
                  <div className="space-y-10">
                    {project.accountManager && (
                      <ProjectEmployeeCard
                        employee={project.accountManager}
                        title="Account Manager"
                        startDate="jan 4"
                        endDate="dec 3"
                      />
                    )}
                    {project.techLead && (
                      <ProjectEmployeeCard
                        employee={project.techLead}
                        title="Tech Lead"
                        startDate="jan 4"
                        endDate="dec 3"
                      />
                    )}
                    {project.projectManager && (
                      <ProjectEmployeeCard
                        employee={project.projectManager}
                        title="Project Manager"
                        startDate="jan 4"
                        endDate="dec 3"
                      />
                    )}
                  </div>
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </div>
  );
};

export default ProjectDetails;
