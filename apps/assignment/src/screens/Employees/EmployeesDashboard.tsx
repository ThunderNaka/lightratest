import { useState } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { useQuery } from "@tanstack/react-query";

import { tw } from "@lightit/shared";
import { icons, Input, ScrollArea } from "@lightit/ui";

import { generateQueryKey } from "~/api/config";
import { getDashboardEmployeesQuery } from "~/api/employees";
import { ScreenLoading } from "~/components";
import { ScreenHeader } from "~/components/ScreenHeader";
import useDebounce from "~/hooks/useDebounce";
import { ROUTES } from "~/router";
import { errorToast, includeStringWithoutAccent } from "~/utils";
import { BambooSyncButton } from "./BambooSyncButton";
import { EmployeeRow } from "./EmployeeRow";

type HeadProps = ComponentPropsWithoutRef<"th">;

const Head = ({ children, scope = "col", className, ...props }: HeadProps) => (
  <th
    scope={scope}
    className={tw("border-b border-neutrals-light-200 font-medium", className)}
    {...props}
  >
    {children}
  </th>
);

export const EmployeesDashboard = () => {
  const [filter, setFilter] = useState("");

  const inputPlaceholder = "Employee Name";

  const [sortParam, setSortParam] = useState("-isAssignable");
  const debouncedSort = useDebounce(sortParam, 200);
  const { data } = useQuery({
    queryKey: [
      ...generateQueryKey("getDashboardEmployeesQuery", { domain: "employee" }),
      debouncedSort,
    ],
    ...getDashboardEmployeesQuery({
      sort: sortParam,
    }),
    onError: errorToast,
  });
  const employees = data?.data;
  const bambooLastSync = data?.bambooLastSync;

  return (
    <div className="flex h-full w-full flex-col">
      <ScreenHeader
        title="Employees"
        path={[
          {
            name: "Employees",
            href: ROUTES.employees,
          },
        ]}
        actions={<BambooSyncButton lastSyncDate={bambooLastSync} />}
      />

      <div className="flex items-center justify-between px-8 pb-6">
        <div className="flex justify-between space-x-4">
          <Input
            className="w-64"
            id="id"
            left={<icons.MagnifyingGlassIcon />}
            placeholder={inputPlaceholder}
            onChange={(event) => {
              setFilter(event.target.value);
            }}
          />
        </div>
      </div>
      {!employees && <ScreenLoading />}
      {employees && (
        <ScrollArea className="p-8 pt-0">
          <table className="w-full border-separate border-spacing-0">
            <colgroup>
              <col className="w-full sm:w-3/12" />
              <col className="lg:w-1/12" />
              <col className="lg:w-1/5" />
              <col className="lg:w-1/5" />
              <col className="lg:w-1/12" />
              <col className="lg:w-1/12" />
              <col className="lg:w-fit" />
            </colgroup>

            <thead className="sticky top-0 z-10 bg-white text-left text-sm capitalize text-neutrals-dark-200">
              <tr>
                <Head className="py-6 pl-8">
                  <div className="flex gap-2">
                    Name
                    <icons.ArrowsUpDownIcon
                      className="w-4 cursor-pointer stroke-2"
                      onClick={() =>
                        setSortParam(sortParam === "name" ? "-name" : "name")
                      }
                    />
                  </div>
                </Head>

                <Head className="py-4">
                  <div className="flex gap-2">Team</div>
                </Head>

                <Head className="last:pr-8">
                  <div className="flex gap-2">
                    email
                    <icons.ArrowsUpDownIcon
                      className="w-4 cursor-pointer stroke-2"
                      onClick={() =>
                        setSortParam(sortParam === "email" ? "-email" : "email")
                      }
                    />
                  </div>
                </Head>
                <Head className="last:pr-8">projects</Head>
                <Head className="pr-4 text-center">
                  <div className="flex gap-2">
                    Must be assigned
                    <icons.ArrowsUpDownIcon
                      className="w-4 cursor-pointer stroke-2"
                      onClick={() =>
                        setSortParam(
                          sortParam === "isAssignable"
                            ? "-isAssignable"
                            : "isAssignable",
                        )
                      }
                    />
                  </div>
                </Head>
                <Head className="text-center">
                  <div className="flex gap-2">
                    daily hours
                    <icons.ArrowsUpDownIcon
                      className="w-4 cursor-pointer stroke-2"
                      onClick={() =>
                        setSortParam(sortParam === "hours" ? "-hours" : "hours")
                      }
                    />
                  </div>
                </Head>
              </tr>
            </thead>

            <tbody className="align-top">
              {(filter === ""
                ? employees
                : employees.filter((employee) =>
                    includeStringWithoutAccent(employee.name, filter),
                  )
              ).map((employee) => (
                <EmployeeRow key={employee.email} employee={employee} />
              ))}
            </tbody>
          </table>
        </ScrollArea>
      )}
    </div>
  );
};
