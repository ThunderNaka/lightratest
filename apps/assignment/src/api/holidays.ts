import type { ServiceResponse } from "./api.types";
import { getApi } from "./axios";

export interface Holiday {
  id: number;
  name: string;
  date: string;
}

export const getHolidays = async () => {
  const response = await getApi().get<ServiceResponse<Holiday[]>>("/holidays");
  return response.data.data;
};
