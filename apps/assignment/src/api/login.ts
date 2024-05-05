import type { ServiceResponse } from "./api.types";
import { getApi } from "./axios";

export interface UserToken {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}
export interface GoogleLoginRequest {
  email: string;
  name: string;
  googleToken: string;
}

export const googleLogin = async ({
  email,
  name,
  googleToken,
}: GoogleLoginRequest) => {
  const googleLoginPayload = { email, name, googleToken };
  const response = await getApi({ isPrivateApi: false }).post<
    ServiceResponse<UserToken>
  >("/auth/google", {
    ...googleLoginPayload,
  });
  return response.data;
};
