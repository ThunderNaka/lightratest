import React from "react";

import { tw } from "@lightit/shared";
import { useToastStore } from "@lightit/toast";
import { CircularAvatar, icons, Typography } from "@lightit/ui";

import { copyToClipboard } from "~/utils";

interface ModalHeaderProps {
  avatarUrl?: string;
  title: string;
  className?: string;
  showAvatar?: boolean;
  allowCopy?: boolean;
}

export const ModalHeader = ({
  title,
  avatarUrl,
  className,
  showAvatar = true,
  allowCopy = false,
}: ModalHeaderProps) => {
  const pushToast = useToastStore((state) => state.pushToast);

  return (
    <div className={tw("flex items-center", className)}>
      {showAvatar && (
        <CircularAvatar
          size="xl"
          image={avatarUrl}
          name={title}
          className="mr-2 justify-self-start"
          defaultToIcon={avatarUrl ? true : false}
        />
      )}

      <Typography
        font="semiBold"
        className="group flex items-center gap-2 text-3xl"
        onClick={() => {
          if (allowCopy) {
            copyToClipboard(title);
            void pushToast({
              type: "success",
              title: "Copy Success",
              message: `"${title}" copied to clipboard`,
            });
          }
        }}
      >
        {title}
        {allowCopy && (
          <icons.ClipboardDocumentIcon className="w-5 text-gray-500 opacity-0 group-hover:opacity-100" />
        )}
      </Typography>
    </div>
  );
};
