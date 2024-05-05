import { formatBackendDateFullYear } from "~/utils";

interface ProjectDetailsDatesProps {
  startDate: string;
  endDate: string;
}

const ProjectDetailsDates = ({
  startDate,
  endDate,
}: ProjectDetailsDatesProps) => {
  return (
    <div className="flex items-center gap-6 divide-x divide-neutrals-dark-300 text-sm">
      <div className="space-x-1">
        <span className="text-neutrals-dark-300">Start date</span>
        <span className="font-medium text-neutrals-dark-500">
          {formatBackendDateFullYear(startDate)}
        </span>
      </div>
      <div className="space-x-1 pl-6">
        <span className="text-neutrals-dark-300">End date</span>
        <span className="font-medium text-neutrals-dark-500">
          {formatBackendDateFullYear(endDate)}
        </span>
      </div>
    </div>
  );
};

export default ProjectDetailsDates;
