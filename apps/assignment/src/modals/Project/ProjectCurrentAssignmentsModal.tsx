import { useNavigate } from "react-router-dom";

import { Button, icons, Input, ScrollArea, SideModal } from "@lightit/ui";

import { ROUTES } from "~/router";
import { MOCK_PROJECT_WITH_ASSIGNMENTS } from "../../mocks/currentAssignmentsMock";
import CurrentAssignmentsCard from "./ProjectCurrentAssignments/CurrentAssignmentsCard";

interface ProjectCurrentAssignmentsModalProps {
  onClose: () => void;
  show: boolean;
}

export const ProjectCurrentAssignmentsModal = ({
  onClose,
  show,
}: ProjectCurrentAssignmentsModalProps) => {
  const navigate = useNavigate();

  return (
    <SideModal show={show} onClose={onClose} className="w-500">
      <div className="flex items-start justify-between border-b border-neutrals-medium-300 p-6">
        <div>
          <h4 className="text-xl font-bold text-neutrals-dark-900">
            Current assignments
          </h4>
          <p className="text-sm text-primary-200">
            {MOCK_PROJECT_WITH_ASSIGNMENTS.name}
          </p>
        </div>
        <button className="p-1.5" onClick={onClose}>
          <icons.XMarkIcon className="h-6 w-6 stroke-[2] text-neutrals-dark-200" />
          <span className="sr-only">Close</span>
        </button>
      </div>
      <div className="grow space-y-4 py-6">
        <Input
          id="filter"
          left={<icons.MagnifyingGlassIcon />}
          placeholder="Enter employee name or role..."
          size="sm"
          containerClassName="mx-6"
        />
        <ScrollArea className="h-full grow">
          {MOCK_PROJECT_WITH_ASSIGNMENTS.assignments.map((assignment) => (
            <CurrentAssignmentsCard
              key={assignment.id}
              assignment={assignment}
            />
          ))}
        </ScrollArea>
      </div>
      <div className="flex items-center justify-end gap-4 self-stretch p-6">
        <Button
          size="md"
          type="submit"
          onClick={() =>
            navigate(
              `${ROUTES.projects.base}/${MOCK_PROJECT_WITH_ASSIGNMENTS.id}`,
            )
          }
        >
          Go to Project Details
        </Button>
      </div>
    </SideModal>
  );
};
