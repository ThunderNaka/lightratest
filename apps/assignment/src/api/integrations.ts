import type { ServiceResponse } from "./api.types";
import { getApi } from "./axios";

export interface Integration {
  id: number;
  description: string;
  name: string;
  type: boolean;
  colors: {
    text: string;
    border: string;
    background: string;
  };
}

export const getIntegrations = async () => {
  const response = await getApi().get<ServiceResponse<Integration[]>>(
    "/integrations",
    { params: { "filter[description]": "Web" } },
  );
  return response.data.data;
};
