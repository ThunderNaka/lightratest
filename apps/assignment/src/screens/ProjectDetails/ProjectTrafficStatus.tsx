import { tw } from "@lightit/shared";

import { PROJECT_TRAFFIC_STATUS } from "../../shared.constants";

interface ProjectTrafficStatusProps {
  trafficStatus: "off-track" | "on-track" | "moderate-risk";
}

const ProjectTrafficStatus = ({ trafficStatus }: ProjectTrafficStatusProps) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <p className="text-sm text-neutrals-dark-900">Overall status:</p>
      <div
        className={tw(
          "rounded-md px-3 py-0.5",
          trafficStatus === PROJECT_TRAFFIC_STATUS.OFF_TRACK &&
            "bg-complementary-red-100 text-complementary-red-600",
          trafficStatus === PROJECT_TRAFFIC_STATUS.ON_TRACK &&
            "bg-complementary-green-200 text-alert-success-800",
          trafficStatus === PROJECT_TRAFFIC_STATUS.MODERATE_RISK &&
            "bg-complementary-yellow-200 text-complementary-orange-500",
        )}
      >
        <span className="truncate text-xs font-medium capitalize">
          {trafficStatus}
        </span>
      </div>
    </div>
  );
};

export default ProjectTrafficStatus;
