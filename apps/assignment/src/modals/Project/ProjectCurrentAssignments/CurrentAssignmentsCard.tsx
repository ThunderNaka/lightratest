import { CircularAvatar, icons } from "@lightit/ui";

import { formatBackendDateToVerbose } from "~/utils";
import type { MockProjectAssignment } from "../../../mocks/currentAssignmentsMock";
import CurrentAssignmentsItem from "./CurrentAssignmentsItem";

interface CurrentAssignmentsCardProps {
  assignment: MockProjectAssignment;
}

const CurrentAssignmentsCard = ({
  assignment,
}: CurrentAssignmentsCardProps) => (
  <div
    key={assignment.id}
    className="mx-6 mb-4 flex items-start justify-between rounded-lg border border-neutrals-medium-200 px-4 py-3 shadow-full"
  >
    <div className="flex items-start gap-3">
      <CircularAvatar size="md" image={assignment.avatarUrl} />
      <div className="space-y-1">
        <h5 className="font-semibold text-neutrals-dark-900">
          {assignment.name}
        </h5>
        <p className="text-xs capitalize text-neutrals-dark-300">
          {assignment.role}
        </p>
      </div>
    </div>
    <div className="space-y-2">
      <CurrentAssignmentsItem
        icon={
          <icons.CalendarIcon className="h-4 w-4 stroke-[2] text-neutrals-medium-500" />
        }
        text={`${formatBackendDateToVerbose(
          assignment.fromDate,
        )} - ${formatBackendDateToVerbose(assignment.toDate)}`}
      />
      <CurrentAssignmentsItem
        icon={
          <icons.ClockIcon className="h-4 w-4 stroke-[2] text-neutrals-medium-500" />
        }
        text={`${assignment.hours}hs / ${assignment.availableHours}hs`}
      />
      <CurrentAssignmentsItem
        icon={
          <icons.CurrencyDollarIcon className="h-4 w-4 stroke-[2] text-neutrals-medium-500" />
        }
        text={assignment.rateType}
      />
    </div>
  </div>
);

export default CurrentAssignmentsCard;
