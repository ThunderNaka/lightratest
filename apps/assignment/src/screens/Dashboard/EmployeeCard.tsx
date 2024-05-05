import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { ClockIcon } from "@heroicons/react/24/outline";

import { tw } from "@lightit/shared";

import type { EmployeeMockup } from "~/api/employees";

interface EmployeeCardProps {
  employee: EmployeeMockup;
}

export const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  return (
    <Disclosure key={employee.id}>
      {({ open }) => (
        <>
          <Disclosure.Button
            className={tw(
              open
                ? "bg-complementary-blue-50"
                : "odd:bg-white even:bg-slate-50",
              "flex w-full justify-between p-4 text-left text-sm font-medium focus:outline-none",
            )}
          >
            <div className="flex flex-row items-center justify-start">
              <div className="mr-4 h-16 w-16">
                <img className="rounded-full" src={employee.picture} alt="" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg">{employee.name}</span>
                <span className="text-sm text-neutrals-dark-300">
                  {employee.position}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-y-5">
              <ChevronUpIcon
                className={`${
                  open ? "rotate-180 transform" : ""
                } h-5 w-5 text-gray-500`}
              />
              <span className="inline-flex h-5 w-16 items-center rounded-md bg-transparent p-2 text-xs font-medium text-complementary-blue-500 ring-1 ring-inset ring-complementary-blue-500">
                <ClockIcon className="mr-1 h-4 w-4" />
                {employee.assignedWorkingHours} / {employee.dailyWorkingHours}
              </span>
            </div>
          </Disclosure.Button>
          <Disclosure.Panel className="py-4 text-lg">
            <div>
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="p-2 text-left text-xs font-normal text-neutrals-dark-200"
                    >
                      Project
                    </th>
                    <th
                      scope="col"
                      className="p-2 text-left text-xs font-normal text-neutrals-dark-200"
                    >
                      Hours Left
                    </th>
                    <th
                      scope="col"
                      className="p-2 text-left text-xs font-normal text-neutrals-dark-200"
                    >
                      Project Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employee.projectAssignmentHours.map((projectAssignment) => (
                    <tr
                      key={projectAssignment.id}
                      className="odd:bg-slate-50 even:bg-white"
                    >
                      <td className="whitespace-nowrap p-2 py-3 text-left text-xs font-normal text-pink-600">
                        {projectAssignment.projectName}
                      </td>
                      <td className="whitespace-nowrap p-2 py-3 text-left text-xs font-normal">
                        {projectAssignment.hoursLeft}
                      </td>
                      <td className="whitespace-nowrap p-2 py-3 text-left text-xs font-normal">
                        {projectAssignment.projectType}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
