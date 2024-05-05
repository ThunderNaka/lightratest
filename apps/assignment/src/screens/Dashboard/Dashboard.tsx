import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DatePicker, { DateObject } from "react-multi-date-picker";

import { Select } from "@lightit/ui";

import { getNextAvailableEmployee } from "~/api/employees";
import { getProjectStatistics } from "~/api/projects";
import type { ProjectStatistics } from "~/api/projects";
import { Graph } from "~/assets";
import { errorToast } from "~/utils";
import { EmployeeCard } from "./EmployeeCard";

export const Dashboard = () => {
  const [values, setValues] = useState<DateObject | DateObject[] | null>([
    new DateObject().subtract(4, "days"),
    new DateObject().add(4, "days"),
  ]);

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedProject2, setSelectedProject2] = useState<ProjectStatistics>();

  const { data } = useQuery({
    queryKey: ["getProjectStatistics"],
    queryFn: () => getProjectStatistics(),
  });

  const { data: nextAvailableEmployee } = useQuery({
    queryFn: getNextAvailableEmployee,
    queryKey: ["getNextAvailableEmployee"],
    onError: errorToast,
  });

  const projectOptions =
    data?.map((project) => ({
      value: `${project.projectId}`,
      label: project.projectName,
    })) ?? [];

  const selectedProject = data?.find(
    (project) => project.projectId === +selectedProjectId,
  );

  return (
    <div className="grid h-full grid-flow-col grid-rows-4 gap-6 overflow-y-scroll p-8 pr-2">
      <div className="bg-black-100 col-span-2 row-span-2 p-5">
        <p>Total distribution of hours</p>
        <div className="mb-4 flex flex-row items-center justify-between">
          <div className="max-h-max bg-gray-800 p-4 text-white">2023</div>
          <Select
            id="project"
            placeholder="Select a project..."
            options={projectOptions}
            value={selectedProjectId}
            onChange={setSelectedProjectId}
            containerClassName="w-1/3"
          />
        </div>
        <div className="flex h-[50%] w-full items-center justify-center">
          <img src={Graph} alt="Graph" />
        </div>
        <div className="flex flex-row justify-between gap-4">
          <div>
            <h5>Total Hours</h5>
            <p>{`${selectedProject?.totalHours ?? "- -"} hs`}</p>
          </div>
          <div>
            <div className="flex flex-row gap-4">
              <div>
                <h5>Billable Hours</h5>
                <p>{`${selectedProject?.billableHours ?? "- -"} hs`}</p>
              </div>
              <div>
                <h5>Non-Billable</h5>
                <p>{`${selectedProject?.nonBillableHours ?? "- -"} hs`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black-200 col-span-2 row-span-2">
        <div className="flex h-full flex-col justify-between p-5">
          <p>Profitability Chart</p>

          <div className="mb-4 flex min-w-min flex-row justify-between">
            <DatePicker
              value={values}
              onChange={setValues}
              range
              calendarPosition="top"
              className="rmdp-prime"
              inputClass="rounded-md border border-gray-300 w-[230px]"
            />
            <Select
              id="project"
              value={`${selectedProject2?.projectId}` ?? ""}
              onChange={(selectedValue) => {
                setSelectedProject2(
                  data?.find((p) => `${p.projectId}` === selectedValue),
                );
              }}
              options={projectOptions}
              containerClassName="w-1/3"
            />
          </div>
          <div className="flex h-[50%] w-full items-center justify-center">
            <div>
              <div>{selectedProject2?.projectName}</div>
              <img src={Graph} alt="Graph" />
            </div>
          </div>
        </div>
      </div>
      <div className="row-span-4 w-96 overflow-y-scroll rounded-lg bg-white shadow">
        <div className="z-9 sticky top-0 bg-white p-4">
          <span className="text-lg font-medium">Free Employees</span>
        </div>
        <div className="p-4 pt-0">
          {nextAvailableEmployee?.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      </div>
    </div>
  );
};
