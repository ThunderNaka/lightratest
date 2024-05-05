import { tw } from "@lightit/shared";

interface ProjectStatusProps {
  name: string;
  status: "archived" | "paused" | "active";
}

const ProjectStatus = ({ name, status }: ProjectStatusProps) => {
  return (
    <div className="flex items-center gap-4">
      <h1 className="text-3xl font-bold">{name}</h1>
      <div
        className={tw(
          "rounded-md px-5 py-0.5",
          status === "archived" && "bg-alert-error-800",
          status === "paused" && "bg-complementary-yellow-600",
          status === "active" && "bg-alert-success-800",
        )}
      >
        <span className="text-xs font-medium capitalize text-white">
          {status}
        </span>
      </div>
    </div>
  );
};

export default ProjectStatus;
