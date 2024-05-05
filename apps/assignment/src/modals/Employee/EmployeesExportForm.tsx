import { useEffect, useState } from "react";
import type { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { validations } from "@lightit/shared";
import {
  Button,
  HookedSelect,
  icons,
  Select,
  SideModal,
  Switch,
} from "@lightit/ui";

import {
  exportEmployeeAvailability,
  getEmployeesQuery,
  SWITCHES,
} from "~/api/employees";
import { getTeamsQuery } from "~/api/teams";
import { HookedRangeCalendar } from "~/components/RangeCalendar";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { errorToast, formatFormDate, handleAxiosFieldErrors } from "~/utils";

interface AssignedHoursModalProps {
  onClose: () => void;
  show: boolean;
}

const employeesExportSchema = z.object({
  dateRange: z.object({
    fromDate: validations.date(),
    toDate: validations.date(),
  }),
  employeeIds: z.array(z.string()),
});

export const EmployeesExportForm: FC<AssignedHoursModalProps> = ({
  onClose,
  show,
}) => {
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [sheets, setSheets] = useState<
    (typeof SWITCHES)[keyof typeof SWITCHES][]
  >([SWITCHES.availabilities, SWITCHES.nonBillable]);

  const { hasPermission } = usePermissions();

  const canViewTeam = hasPermission(PERMISSIONS.viewTeam);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(employeesExportSchema),
    defaultValues: {
      dateRange: {
        fromDate: "",
        toDate: "",
      },
      employeeIds: [],
    },
  });

  const { data: teams } = useQuery({
    ...getTeamsQuery(),
    onError: errorToast,
    enabled: !!canViewTeam,
  });

  const teamOptions =
    teams?.map((e) => ({
      value: `${e.id}`,
      label: e.name,
    })) ?? [];

  const { data: employeesResponse, isLoading: employeeIsLoading } = useQuery({
    ...getEmployeesQuery(),
    onError: errorToast,
  });

  const [employeeOptions, setEmployeeOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (!employeeIsLoading && employeesResponse) {
      const employees = employeesResponse?.map((e) => ({
        value: `${e.id}`,
        label: e.name,
        avatarUrl: e.avatarUrl,
      }));
      setEmployeeOptions(employees);
    }
  }, [employeesResponse, employeeIsLoading]);

  const { mutate: exportEmployeeAvailabilityMutation, isLoading } = useMutation(
    {
      mutationFn: exportEmployeeAvailability.mutation,
      onSuccess: (response) => {
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        const today = formatFormDate(new Date());
        const outputFilename = `${today}.xls`;
        link.href = url;
        link.setAttribute("download", outputFilename);
        document.body.appendChild(link);
        link.click();
      },
      onError: (err) => {
        errorToast(err);
        handleAxiosFieldErrors(err, setError, true);
      },
    },
  );

  const updateSheets = (item: (typeof SWITCHES)[keyof typeof SWITCHES]) => {
    setSheets((prev) => {
      return !prev.includes(item)
        ? [...prev, item]
        : [...prev.filter((s) => s !== item)];
    });
  };

  return (
    <SideModal show={show} onClose={onClose} className="w-[38rem]">
      <header className="flex items-center justify-between border-b border-neutrals-medium-300 p-6">
        <h2 className="text-xl font-bold text-neutrals-dark-900">
          Export Availability
        </h2>
        <icons.XMarkIcon className="h-6 w-6 shrink-0" onClick={onClose} />
      </header>
      <div className="flex h-full flex-col items-center justify-start">
        <div className="flex h-full w-full flex-col items-center justify-start overflow-hidden">
          <div className="flex h-full w-full flex-col overflow-y-auto">
            <form
              className="flex flex-1 flex-col"
              onSubmit={handleSubmit((data) => {
                const teamEmployees: string[] = [];

                if (
                  selectedTeamIds.length > 0 &&
                  data.employeeIds.length === 0
                ) {
                  const selectedTeams = teams?.filter((t) =>
                    selectedTeamIds.includes(`${t.id}`),
                  );

                  if (selectedTeams && selectedTeams.length > 0) {
                    selectedTeams?.forEach((team) => {
                      teamEmployees.push(`${team?.leader?.id}`);
                      const teamEmployeesIds = team?.members.map(
                        (m) => `${m.id}`,
                      );
                      teamEmployees.push(...teamEmployeesIds);
                    });
                  }
                }
                exportEmployeeAvailabilityMutation({
                  fromDate: formatFormDate(data.dateRange.fromDate),
                  toDate: formatFormDate(data.dateRange.toDate),
                  employees: [...data.employeeIds, ...teamEmployees],
                  sheets,
                });
                reset({
                  dateRange: {
                    fromDate: "",
                    toDate: "",
                  },
                  employeeIds: [],
                });
                setSelectedTeamIds([]);
              })}
            >
              <div className="flex flex-col gap-6 px-8 py-4">
                <div className="flex flex-row items-start justify-between gap-3.5">
                  <div className="w-full">
                    <HookedRangeCalendar
                      showLabels={true}
                      control={control}
                      id="dateRange"
                      inputIcon={
                        <icons.CalendarIcon className="m-auto h-5 w-5 text-primary-white-600" />
                      }
                      error={errors.dateRange}
                    />
                  </div>
                </div>

                <div className="w-full">
                  <Select
                    multiple
                    label="Teams"
                    placeholder="All teams"
                    hasEmptyOption
                    options={teamOptions}
                    disabled={!canViewTeam}
                    value={selectedTeamIds}
                    onChange={(elements: string[]) => {
                      if (elements.length > 0) {
                        const selectedTeams = teams?.filter((e) =>
                          elements.includes(`${e.id}`),
                        );
                        const availableEmployees = [
                          ...new Set(
                            selectedTeams
                              ?.map((team) =>
                                team.members.map((m) => ({
                                  value: `${m.id}`,
                                  label: m.name,
                                  avatarUrl: m.avatarUrl,
                                })),
                              )
                              .flat()
                              .filter(
                                (employee, index, self) =>
                                  self.findIndex(
                                    (v) => v.value === employee.value,
                                  ) === index,
                              )
                              .sort((a, b) => (a.label > b.label ? 1 : -1)),
                          ),
                        ];
                        setEmployeeOptions(availableEmployees);
                      }
                      reset({ employeeIds: [] });
                      setSelectedTeamIds(elements);
                    }}
                  />
                </div>
                <div className="w-full">
                  <HookedSelect
                    id="employeeIds"
                    label="Employees"
                    hasEmptyOption
                    placeholder="All Employees"
                    options={employeeOptions}
                    control={control}
                    error={errors.employeeIds?.message}
                    disabled={!employeeOptions.length}
                    multiple
                    autocomplete
                  />
                </div>
                <div className="w-full">
                  <span className="text-lg">Export options</span>
                </div>
                <div className="flex w-full items-center justify-between pl-4">
                  <span>Availabilities</span>
                  <Switch
                    disabled={isLoading}
                    labels={["Yes", "No"]}
                    checked={sheets.includes(SWITCHES.availabilities)}
                    onCheckedChange={() => {
                      updateSheets(SWITCHES.availabilities);
                      if (
                        !sheets.includes(SWITCHES.internal) &&
                        !sheets.includes(SWITCHES.nonBillable)
                      ) {
                        updateSheets(SWITCHES.internal);
                      }
                    }}
                  />
                </div>
                <div className="flex w-full items-center justify-between pl-4">
                  <span>Internal assignments</span>
                  <Switch
                    disabled={isLoading}
                    labels={["Yes", "No"]}
                    checked={sheets.includes(SWITCHES.internal)}
                    onCheckedChange={() => {
                      if (sheets.includes(SWITCHES.nonBillable)) {
                        updateSheets(SWITCHES.nonBillable);
                      } else if (!sheets.includes(SWITCHES.availabilities)) {
                        updateSheets(SWITCHES.availabilities);
                      }
                      updateSheets(SWITCHES.internal);
                    }}
                  />
                </div>
                <div className="flex w-full items-center justify-between pl-4">
                  <span>Non billable assignments</span>
                  <Switch
                    disabled={isLoading}
                    labels={["Yes", "No"]}
                    checked={sheets.includes(SWITCHES.nonBillable)}
                    onCheckedChange={() => {
                      if (sheets.includes(SWITCHES.internal)) {
                        updateSheets(SWITCHES.internal);
                      } else if (!sheets.includes(SWITCHES.availabilities)) {
                        updateSheets(SWITCHES.availabilities);
                      }
                      updateSheets(SWITCHES.nonBillable);
                    }}
                  />
                </div>
              </div>

              <div className="mt-auto flex flex-row justify-end gap-3 pb-9 pr-8">
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  disabled={isLoading}
                >
                  Export
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </SideModal>
  );
};
