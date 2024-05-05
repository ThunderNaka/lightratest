import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "~/router";
import { useUserStore } from "~/stores";
import type { ServiceResponse } from "./api.types";
import { getApi } from "./axios";

export interface LogoutMessage {
  message: string;
}

export const logout = async () => {
  const response =
    await getApi().post<ServiceResponse<LogoutMessage>>("/auth/logout");
  return response.data;
};

export const useLogoutQuery = () => {
  const navigate = useNavigate();
  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    retry: false,
    onSettled: () => {
      resetStorage();
      navigate(ROUTES.login);
    },
  });

  return {
    logoutMutation,
  };
};

export const resetStorage = () => {
  useUserStore.getState().setUser(null);
  useUserStore.getState().setToken(null);
  window.location.href = ROUTES.login;
};
