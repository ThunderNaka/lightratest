import axios from "axios";
import { shuffle } from "lodash/fp";

import { preloadImages } from "./preloadImages";

interface ServiceResponse<T> {
  data: T;
  status: number;
  success: boolean;
}
interface Employee {
  avatarUrl: string;
  id: number;
  name: string;
  email: string;
}

const fixedApi = axios.create({
  baseURL: "https://lightranet.lightitlabs.com/api/",
  headers: {
    "Content-Type": "application/json",
    "x-api-key":
      "cmDkHE3YDSTnJP63YsagXZDPtAd665YueuBIuiVlu4zV0y85A9mWfeh3c8AbzEGD",
  },
});

// Should be Employee but I'm not importing this type here.

export const fetchImages = async (): Promise<string[]> => {
  const {
    data: { data },
  } = await fixedApi.get<ServiceResponse<Employee[]>>("/services/employees");
  const shuffled = shuffle(
    data
      ?.filter(
        (employee) =>
          !employee.name.includes("Leti") &&
          employee.avatarUrl.includes("https"),
      )
      .map((employee) => employee.avatarUrl),
  );
  await preloadImages(shuffled);
  return shuffled;
};
