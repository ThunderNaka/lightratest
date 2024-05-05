import axios from "axios";
import type { AxiosError } from "axios";
import mem from "mem";

import { env } from "~/env";
import { useUserStore } from "~/stores/useUserStore";
import type { ServiceResponse } from "./api.types";
import { resetStorage } from "./logout";

const baseApiConfiguration = {
  baseURL: env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
};

const privateApi = axios.create(baseApiConfiguration);

privateApi.interceptors.request.use(
  (config) => {
    const { token } = useUserStore.getState();
    if (token) config.headers.set("Authorization", `Bearer ${token}`);
    return config;
  },
  (error) => Promise.reject(error),
);

interface RefreshTokenResponse {
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

const refreshToken = async () => {
  const refreshApi = axios.create(baseApiConfiguration);
  const { token } = useUserStore.getState();
  const response = await refreshApi.post<ServiceResponse<RefreshTokenResponse>>(
    "/auth/refresh",
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );

  const { data: userToken } = response.data;
  return userToken.refresh_token;
};

const memoizedRefreshToken = mem(refreshToken, { maxAge: 10000 });

privateApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error?.config;
    const { setToken } = useUserStore.getState();

    if (error?.response?.status === 401) {
      try {
        const token = await memoizedRefreshToken();
        setToken(token);
        return privateApi({
          ...config,
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        resetStorage();
      }
    }

    return Promise.reject(error);
  },
);

const publicApi = axios.create(baseApiConfiguration);

export const getApi = ({ isPrivateApi } = { isPrivateApi: true }) =>
  isPrivateApi ? privateApi : publicApi;
