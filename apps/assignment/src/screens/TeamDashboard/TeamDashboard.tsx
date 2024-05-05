import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useToastStore } from "@lightit/toast";
import { Button, icons, Input, Loading } from "@lightit/ui";

import type { Team } from "~/api/teams";
import { deleteTeam, getTeamsQuery } from "~/api/teams";
import { ConfirmDelete } from "~/components";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { MODAL_ROUTES, useNavigateModal } from "~/router";
import { errorToast } from "~/utils";
import { TeamRow } from "./TeamRow";

export const TeamDashboard = () => {
  const [filter, setFilter] = useState("");
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const inputPlaceholder = "Team Name";
  const navigateModal = useNavigateModal();

  const { hasPermission } = usePermissions();
  const { data: teams } = useQuery({
    ...getTeamsQuery(),
    onError: errorToast,
  });
  const [confirmDeleteTeam, setConfirmDeleteTeam] = useState<Team | null>(null);

  const deleteTeamMutation = useMutation({
    mutationFn: deleteTeam.mutation,
    onSuccess: (_, team) => {
      void pushToast({
        type: "success",
        title: "Deletion Complete",
        message: `Team "${team.name}" successfully deleted!`,
      });
      deleteTeam.invalidates(queryClient, team.id);
    },
    onError: errorToast,
  });

  return (
    <div className="flex h-full w-full flex-col">
      <div className="my-4 flex items-center justify-between px-8">
        <Input
          className="w-64"
          id="id"
          left={<icons.MagnifyingGlassIcon />}
          placeholder={inputPlaceholder}
          onChange={(event) => {
            setFilter(event.target.value);
          }}
        />

        {hasPermission(PERMISSIONS.createTeam) && (
          <Button
            className="h-9"
            size="sm"
            variant="secondary"
            right={<icons.PlusCircleIcon />}
            onClick={() => navigateModal(MODAL_ROUTES.teamForm)}
          >
            Add New Team
          </Button>
        )}
      </div>

      {!teams ? (
        <div className="relative h-full">
          <Loading />
        </div>
      ) : (
        <div className="h-[100%] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 border-b border-neutrals-light-200 bg-white text-left text-sm text-primary-white-700">
              <tr>
                <th className="py-6 pl-8 font-medium">
                  <div className="flex flex-row items-center space-x-2">
                    <p>Name</p>
                  </div>
                </th>
                <th className="py-6 font-medium">
                  <div className="flex flex-row items-center space-x-2">
                    <p>Leader</p>
                  </div>
                </th>
                <th className="py-6 font-medium">Members</th>
              </tr>
            </thead>
            <tbody className="text-sm text-neutrals-dark">
              {teams
                .filter(
                  (team) =>
                    !filter ||
                    team.name.toLowerCase().includes(filter.toLowerCase()),
                )
                .map((team) => (
                  <TeamRow
                    key={team.id}
                    team={team}
                    onEdit={() => {
                      navigateModal(`${MODAL_ROUTES.teamForm}/${team.id}`);
                    }}
                    onDelete={() => setConfirmDeleteTeam(team)}
                  />
                ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDelete
        show={!!confirmDeleteTeam}
        onClose={() => {
          setConfirmDeleteTeam(null);
        }}
        label="team"
        onConfirm={() => {
          deleteTeamMutation.mutate(confirmDeleteTeam!);
        }}
      />
    </div>
  );
};
