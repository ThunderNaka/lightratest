import { Link } from "react-router-dom";

import { CircularAvatar, icons } from "@lightit/ui";

import { ROUTES } from "~/router";
import type { Employee } from "~/shared.types";

interface ProjectEmployeeCardProps {
  employee: Employee;
  title: string;
  startDate: string;
  endDate: string;
}

const ProjectEmployeeCard = ({
  employee,
  title,
  startDate,
  endDate,
}: ProjectEmployeeCardProps) => {
  return (
    <div className="flex gap-3 text-base">
      <CircularAvatar size="md" image={employee.avatarUrl} />
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <p className="font-semibold">{title}</p>
          <div className="flex items-center gap-1 text-neutrals-dark-200">
            <icons.CalendarIcon className="h-3 w-3" />
            <p>{`${startDate} - ${endDate}`}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <p className="font-medium">{employee.name}</p>
          <p>{`| ${employee.jobTitle}`}</p>
          <Link className="ml-2" to={`${ROUTES.employees}/${employee.id}`}>
            <icons.ArrowTopRightOnSquareIcon className="h-4 w-4 stroke-[2] text-nostalgia-purple-900" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectEmployeeCard;
