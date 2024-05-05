import type { ServiceResponse } from "./api.types";
import { getApi } from "./axios";
import { generateQueryKey } from "./config";

export interface Technology {
  id: number;
  name: string;
  description?: string;
  colors: {
    text: string;
    border: string;
    background: string;
  };
  url?: string;
  version?: string;
}

export const getTechnologiesQuery = () => ({
  queryKey: generateQueryKey("getTechnologiesQuery"),
  queryFn: async () => {
    const response = await getApi().get<ServiceResponse<Technology[]>>(
      "/technologies",
      { params: { "filter[description]": "Web" } },
    );
    return response.data.data;
  },
});
