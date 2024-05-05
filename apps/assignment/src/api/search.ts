import type { IconName } from "react-cmdk";

import type { ServiceResponse } from "./api.types";
import { getApi } from "./axios";

export interface SearchResult {
  id: string;
  items: SearchResultItem[];
}

export interface SearchResultItem {
  id: string;
  label: string;
  icon?: IconName;
  entityType: SearchResultItemType;
  link?: string;
}

export type SearchResultItemType =
  | "navigation"
  | "project"
  | "employee"
  | "client"
  | "team";

export const getDefaultSearchResults = async () => {
  const response =
    await getApi().get<ServiceResponse<SearchResult[]>>("search/default");
  return response.data.data;
};

export const getSearchResults = async (query?: string) => {
  const response = await getApi().get<ServiceResponse<SearchResult[]>>(
    "search",
    {
      params: { query },
    },
  );
  return response.data.data;
};
