import type { QueryClient } from "@tanstack/react-query";

import type { ServiceResponse } from "./api.types";
import { getApi } from "./axios";
import { generateQueryKey, invalidateDomains } from "./config/config";
import type { Employee } from "./employees";

export interface Team {
  id: number;
  name: string;
  createdAt: Date;
  leaderId: number;
  leader?: Employee;
  members: Employee[];
}

export interface TeamParams {
  name: string;
  leaderId: string;
  memberIds: string[];
}

export interface UpdateTeamParams extends TeamParams {
  id: number;
}

export const getTeamsQuery = () => ({
  queryKey: generateQueryKey("getTeamsQuery", {
    domain: "team",
    subDomains: "employee",
  }),
  queryFn: async () => {
    const response =
      await getApi().get<ServiceResponse<Team[]>>("teams?with=members");
    return response.data.data;
  },
});

export const getTeamQuery = (teamId: number | null) => ({
  enabled: teamId !== null,
  queryKey: generateQueryKey("getTeamQuery", { domain: "team", id: teamId }),
  queryFn: async () => {
    const response = await getApi().get<ServiceResponse<Team>>(
      `teams/${teamId}?with=members`,
    );
    return response.data.data;
  },
});

export const createTeam = {
  mutation: async (team: TeamParams) => {
    const response = await getApi().post<ServiceResponse<Team>>("/teams", {
      ...team,
    });
    return response.data;
  },
  invalidates: (
    queryClient: QueryClient,
    {
      teamId,
    }: {
      teamId?: number;
    },
  ) => {
    invalidateDomains(queryClient, ["team", teamId]);
  },
};

export const updateTeam = {
  mutation: async (team: UpdateTeamParams) => {
    const response = await getApi().put<ServiceResponse<UpdateTeamParams>>(
      `/teams/${team.id}`,
      { ...team },
    );
    return response.data;
  },
  invalidates: (
    queryClient: QueryClient,
    {
      teamId,
    }: {
      teamId: number;
    },
  ) => {
    invalidateDomains(queryClient, ["team", teamId]);
  },
};

export const deleteTeam = {
  mutation: async (team: Team) => {
    const response = await getApi().delete<ServiceResponse<Team[]>>(
      `/teams/${team.id}`,
    );
    return response.data;
  },
  invalidates: (queryClient: QueryClient, teamId: number) => {
    invalidateDomains(queryClient, ["team", teamId]);
  },
};
