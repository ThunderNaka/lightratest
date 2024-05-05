import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { useToastStore } from "@lightit/toast";
import {
  Button,
  CircularAvatar,
  icons,
  IconWrapper,
  SideModal,
  Typography,
} from "@lightit/ui";

import { deleteTeam, getTeamQuery } from "~/api/teams";
import { ConfirmDelete, ScreenLoading } from "~/components";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { errorToast } from "~/utils";
import { TeamForm } from "./TeamForm";

interface TeamModalProps {
  show: boolean;
  onClose: () => void;
}

export const TeamModal = ({ show, onClose }: TeamModalProps) => {
  const pushToast = useToastStore((state) => state.pushToast);

  const queryClient = useQueryClient();

  const params = useParams<{ teamId: string }>();
  const teamId =
    params.teamId !== undefined ? parseInt(params.teamId, 10) : null;
  const isNewTeam = teamId === null;

  const { data: team, isLoading } = useQuery({
    ...getTeamQuery(teamId),
    onError: errorToast,
  });

  const memberIds = team
    ? team.members.map((member) => member.id.toString())
    : [];

  const { hasPermission } = usePermissions();

  const [confirmDelete, setConfirmDelete] = useState(false);

  const deleteTeamMutation = useMutation({
    mutationFn: deleteTeam.mutation,
    onSuccess: (_, team) => {
      onClose();
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
    <SideModal show={show} onClose={onClose} className="w-[600px]">
      {isLoading && !isNewTeam ? (
        <ScreenLoading />
      ) : (
        <div className="flex h-full flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between p-8">
            <div className="flex flex-row items-center">
              <CircularAvatar
                size="xl"
                defaultToIcon={false}
                name={team ? team.name : "Add New Team"}
                className="justify-self-start"
              />
              <Typography className="ml-2 text-3xl" font="semiBold">
                {team ? team.name : "Add New Team"}
              </Typography>
            </div>
            {team && hasPermission(PERMISSIONS.deleteTeam) && (
              <Button
                variant="secondary"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md bg-secondary-50 hover:bg-secondary-100"
                onClick={() => {
                  setConfirmDelete(true);
                }}
                // TODO: remove this and use the proper initialFocus api from HeadlessUI
                tabIndex={-1}
              >
                <IconWrapper className="flex items-center">
                  <icons.TrashIcon className="h-5 w-5 text-secondary-400" />
                </IconWrapper>
              </Button>
            )}
          </div>
          <TeamForm
            team={team}
            onClose={onClose}
            defaultValues={{
              name: team?.name ?? "",
              leaderId: team?.leader?.id.toString() ?? "",
              memberIds: memberIds ?? [],
            }}
          />
          <ConfirmDelete
            show={confirmDelete}
            onClose={() => {
              setConfirmDelete(false);
            }}
            label="team"
            onConfirm={() => {
              team && deleteTeamMutation.mutate(team);
            }}
          />
        </div>
      )}
    </SideModal>
  );
};
