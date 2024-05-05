import { useNavigate } from "react-router-dom";

import { useToastStore } from "@lightit/toast";
import {
  Chip,
  CircularAvatar,
  icons,
  IconWrapper,
  Typography,
} from "@lightit/ui";

import type { DashboardEmployee } from "~/api/employees";
import { ChipProject } from "~/components";
import { ROUTES } from "~/router";
import { copyToClipboard } from "~/utils/utils";

interface EmployeeRowProps {
  employee: DashboardEmployee;
}

export const EmployeeRow = ({ employee }: EmployeeRowProps) => {
  const pushToast = useToastStore((state) => state.pushToast);
  const navigate = useNavigate();

  return (
    <tr
      onClick={() => navigate(`${ROUTES.employees}/${employee.id}`)}
      className="cursor-pointer py-4 align-middle text-sm font-normal text-neutrals-dark-900 odd:bg-white hover:bg-violet-50"
      title={`Edit ${employee.name}`}
    >
      <td className="max-w-[300px] border-b border-gray-100 px-8 py-4">
        <div className="flex items-center">
          <CircularAvatar
            size="xs"
            defaultToIcon={employee.avatarUrl ? true : false}
            name={employee.name}
            image={employee.avatarUrl}
          />
          <Typography className="ml-2">{employee.name}</Typography>
        </div>
      </td>

      <td className="max-w-[150px] border-b border-gray-100 py-4 pr-7">
        {employee.teams.map((team) => (
          <Chip
            key={team.id}
            className="overflow-hidden text-ellipsis bg-neutrals-light-200 text-neutrals-dark-200"
            size="lg"
          >
            {team.name}
          </Chip>
        ))}
      </td>

      <td
        title="Copy to clipboard"
        className="group border-b border-gray-100 py-4 pr-6"
      >
        <button
          className="flex items-center gap-2 hover:underline"
          onClick={(e) => {
            copyToClipboard(employee.email, e),
              void pushToast({
                type: "success",
                title: "Copy Success",
                message: `"${employee.email}" copied to clipboard`,
              });
          }}
        >
          {employee.email}
          <icons.ClipboardDocumentIcon className="w-4 text-gray-500 opacity-0 group-hover:opacity-100" />
        </button>
      </td>

      <td className="max-w-[200px] border-b border-gray-100 py-4 pr-7">
        <div className="flex flex-wrap gap-3">
          {employee.projects && employee.projects.length > 3 ? (
            <Chip className="bg-primary-500 text-white">
              + {employee.projects.length - 3} more
            </Chip>
          ) : (
            employee.projects
              ?.slice(0, 3)
              .map((project) => (
                <ChipProject key={project.id} project={project} />
              ))
          )}
        </div>
      </td>

      <td className="border-b border-gray-100 py-4 pr-4 text-center">
        <IconWrapper size="md" className="m-auto">
          {employee.isAssignable ? (
            <icons.CheckIcon className="text-alert-success-500" />
          ) : (
            <icons.XMarkIcon className="text-complementary-red-500" />
          )}
        </IconWrapper>
      </td>

      <td className="border-b border-gray-100 py-4">{employee.hours} hours</td>
    </tr>
  );
};
