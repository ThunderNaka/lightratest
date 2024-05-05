import type { ComponentPropsWithoutRef } from "react";

import { tw } from "@lightit/shared";

export type FormErrorType = string | boolean;

export interface MessageProps extends ComponentPropsWithoutRef<"p"> {
  message?: string;
  error?: FormErrorType;
}

export const Message = ({ message, error, className }: MessageProps) => (
  <p
    className={tw(
      "text-left text-sm text-neutrals-dark-200",
      className,

      !!error && "text-alert-error",
    )}
  >
    {error === true ? "\u200b" : !error ? message ?? "\u200b" : error}
  </p>
);
