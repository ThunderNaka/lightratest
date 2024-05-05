import { CircularAvatar, DropdownMenu, icons } from "@lightit/ui";

import type { Employee } from "~/api/employees";
import { MODAL_ROUTES, useNavigateModal } from "~/router";

interface ProjectCardActionsProps {
  id: number;
  accountManager: Employee;
  techLead?: Employee;
  projectManager?: Employee;
}

const ProjectCardActions = ({
  id,
  accountManager,
  techLead,
  projectManager,
}: ProjectCardActionsProps) => {
  const navigateModal = useNavigateModal();

  return (
    <div className="flex items-center gap-2">
      <div className="relative z-0 flex -space-x-2">
        <CircularAvatar
          className="z-20 h-7 w-7 border-2 border-white"
          size="xs"
          image={accountManager.avatarUrl}
        />
        {techLead && (
          <CircularAvatar
            className="z-10 h-7 w-7 border-2 border-white"
            size="xs"
            image={techLead.avatarUrl}
          />
        )}
        {projectManager && (
          <CircularAvatar
            className="h-7 w-7 border-2 border-white"
            size="xs"
            image={projectManager.avatarUrl}
          />
        )}
      </div>

      <DropdownMenu
        options={[
          {
            label: "Edit",
            left: <icons.PencilSquareIcon className="h-5 w-5 stroke-2" />,
            onClick: () => navigateModal(`${MODAL_ROUTES.projectForm}/${id}`),
          },
          {
            label: "Current assignments",
            left: <icons.UserIcon className="h-5 w-5 stroke-2" />,
            onClick: () =>
              navigateModal(`${MODAL_ROUTES.currentAssignments}/${id}`),
          },
          {
            label: "Delete",
            left: <icons.TrashIcon className="h-5 w-5 stroke-2" />,
          },
        ]}
      />
    </div>
  );
};

export default ProjectCardActions;
