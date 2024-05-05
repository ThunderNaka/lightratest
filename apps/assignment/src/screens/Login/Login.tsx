import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

import { useToastStore } from "@lightit/toast";
import { Typography } from "@lightit/ui";

import { googleLogin } from "~/api/login";
import type { GoogleLoginRequest } from "~/api/login";
import { Lightit } from "~/assets";
import { ROUTES } from "~/router";
import { useUserStore } from "~/stores/useUserStore";
import { errorToast } from "~/utils";
import { Background } from "./Background";

export const Login = () => {
  const pushToast = useToastStore((state) => state.pushToast);
  const setUser = useUserStore((s) => s.setUser);
  const setToken = useUserStore((s) => s.setToken);

  const { mutate: loginMutation } = useMutation({
    mutationFn: (requestBody: GoogleLoginRequest) =>
      googleLogin({
        ...requestBody,
      }),
    onSuccess: (data) => {
      void pushToast({ type: "success", title: "Welcome back!" });
      setToken(data.data.accessToken);
      navigate(ROUTES.projects.base);
    },
    onError: errorToast,
  });

  const navigate = useNavigate();
  const handleLogin = (credential: string) => {
    if (!credential) {
      void pushToast({
        type: "error",
        title: "Login Error",
        message: "The right credential is missing",
      });
      return;
    }

    const { email, name } = jwt_decode<{ email: string; name: string }>(
      credential,
    );

    setUser({
      email,
      name,
    });

    loginMutation({
      email,
      name,
      googleToken: credential,
    });
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-primary-700 bg-center">
      <Background>
        <div className="z-10 flex flex-col items-center gap-3 bg-primary-500/80 px-20 py-12">
          <motion.img
            src={Lightit}
            width={400}
            alt="Lightit logo"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.8 }}
          />
          <Typography variant="xlarge" className="text-white">
            DO IT FOR THEM
          </Typography>
          <div>
            <GoogleLogin
              width={200}
              auto_select={false}
              useOneTap={false}
              onSuccess={(resp) => handleLogin(resp.credential ?? "")}
              onError={() => {
                void pushToast({
                  type: "error",
                  title: "Login Error",
                  message:
                    "An error occurred while trying to log in with a Google account",
                });
              }}
            />
          </div>
        </div>
      </Background>
    </div>
  );
};
