import type { QueryClient } from "@tanstack/react-query";

import type { ServiceResponse } from "./api.types";
import { getApi } from "./axios";
import { generateQueryKey, invalidateDomains } from "./config/config";
import type { Project } from "./projects";

export interface BaseClient {
  id: number;
  name: string;
  thumbnail: string;
  address: string;
  phoneNumber: string;
  email: string;
  createdAt: string;
}

export interface Client extends BaseClient {
  updatedAt: string;
  projectsCount: number;
}

export interface ClientWithProjects extends Client {
  projects: Project[];
}

export interface PostClientRequest {
  name: string;
  thumbnail: string;
  address: string;
  phoneNumber: string;
  email: string;
}

export interface Stats {
  archivedClientsCount: number;
  activeClientsCount: number;
}

export interface PutClientRequest extends PostClientRequest {
  id: number;
}

export const getClientsQuery = (sortByName = false) => ({
  queryKey: generateQueryKey("getClientsQuery", { domain: "client" }),
  queryFn: async () => {
    const response = await getApi().get<ServiceResponse<Client[]>>(`/clients`, {
      params: { sort: sortByName ? "name" : null },
    });
    return response.data.data;
  },
});

export const getClientsWithProjectsQuery = (sortByName = false) => ({
  queryKey: generateQueryKey("getClientsWithProjectsQuery", {
    domain: "client",
    subDomains: "project",
    params: sortByName,
  }),
  queryFn: async () => {
    const response = await getApi().get<ServiceResponse<ClientWithProjects[]>>(
      "/clients",
      {
        params: { with: "projects", sort: sortByName ? "name" : null },
      },
    );
    return response.data;
  },
});

export const getClientWithProjectsQuery = (id: number | null) => ({
  enabled: id !== null,
  queryKey: generateQueryKey("getClientWithProjectsQuery", {
    domain: "client",
    subDomains: "project",
    params: id,
  }),
  queryFn: async () => {
    const response = await getApi().get<ServiceResponse<ClientWithProjects>>(
      `/clients/${id}`,
      { params: { with: "projects" } },
    );
    return response.data;
  },
});

export const createClient = {
  mutation: async (client: PostClientRequest) => {
    const createdClient = { ...client, thumbnail: client.thumbnail };
    const response = await getApi().post<ServiceResponse<Client>>("/clients", {
      ...createdClient,
    });
    return response.data;
  },
  invalidates: (
    queryClient: QueryClient,
    {
      clientId,
    }: {
      clientId: number;
    },
  ) => {
    invalidateDomains(queryClient, ["client", clientId]);
  },
};

export const updateClient = {
  mutation: async (client: PutClientRequest) => {
    const updatedClient = { ...client };
    const response = await getApi().put<ServiceResponse<Client>>(
      `/clients/${client.id}`,
      { ...updatedClient },
    );
    return response.data;
  },
  invalidates: (
    queryClient: QueryClient,
    {
      clientId,
    }: {
      clientId: number;
    },
  ) => {
    invalidateDomains(queryClient, ["client", clientId]);
  },
};

export const getClientStatsQuery = () => ({
  queryFn: generateQueryKey("getClientStatsQuery", { domain: "client" }),
  queryKey: async () => {
    const response =
      await getApi().get<ServiceResponse<Stats>>("/clients/stats");
    return response.data.data;
  },
});
