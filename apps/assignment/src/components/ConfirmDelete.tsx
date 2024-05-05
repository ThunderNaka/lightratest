import React from "react";

import type { PopupBoxProps } from "@lightit/ui";
import { Button, PopupBox } from "@lightit/ui";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export interface ConfirmDeleteProps
  extends Optional<PopupBoxProps, "boxType" | "title"> {
  label?: string;
}

export const ConfirmDelete = ({ label, ...props }: ConfirmDeleteProps) => {
  return (
    <PopupBox
      boxType="confirm"
      contentType="warningRed"
      title={label ? `Deleting the ${label}` : "Deletion"}
      renderMessage={() => (
        <p className="text-sm">
          {label
            ? `Are you sure you want to delete the ${label}?`
            : "Are you sure you want to delete?"}
        </p>
      )}
      renderButtonGroup={({ onCancel, onConfirm, initialFocus }) => (
        <div className="mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:justify-end">
          <Button
            size="sm"
            onClick={onConfirm}
            variant="tertiary-link"
            className="w-full justify-center sm:w-auto"
          >
            {label ? `Delete ${label}` : "Delete"}
          </Button>
          <Button
            size="sm"
            onClick={onCancel}
            className="w-full justify-center sm:w-auto"
            ref={initialFocus}
          >
            Cancel
          </Button>
        </div>
      )}
      {...props}
    />
  );
};
