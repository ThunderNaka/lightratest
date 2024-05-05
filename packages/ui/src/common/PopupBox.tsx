import { useRef } from "react";
import type { RefObject } from "react";
import { Dialog } from "@headlessui/react";

import { tw } from "@lightit/shared";

import { icons } from "./Icons";
import { Modal } from "./Modal";

export interface PopupBoxProps {
  show: boolean;
  boxType: "alert" | "confirm" | "prompt";
  contentType?: "success" | "warning" | "error" | "information" | "warningRed";
  title: string;
  message?: string;
  onClose: () => void;
  onConfirm?: () => void;
  renderMessage?: (params: { message?: string }) => JSX.Element;
  renderButtonGroup?: (params: {
    onConfirm: () => void;
    onCancel: () => void;
    initialFocus?: RefObject<HTMLButtonElement>;
  }) => JSX.Element;
}

export const PopupBox = ({
  show,
  boxType,
  contentType,
  title,
  message,
  onClose,
  onConfirm,
  renderMessage,
  renderButtonGroup,
}: PopupBoxProps) => {
  const cancelButtonRef = useRef(null);

  return (
    <Modal isOpen={show} onClose={onClose} initialFocus={cancelButtonRef}>
      <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
        <div
          className={tw(
            "sm:flex sm:items-start",
            !message && !renderMessage && "sm:items-center",
          )}
        >
          {contentType && (
            <div
              className={tw(
                "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10",
                contentType === "success" &&
                  "bg-complementary-green-50 text-alert-success-500",
                contentType === "information" &&
                  "bg-complementary-blue-50 text-complementary-blue-500",
                contentType === "warning" && "bg-yellow-100 text-yellow-600",
                (contentType === "error" || contentType === "warningRed") &&
                  "bg-complementary-red-50 text-alert-error-500",
              )}
            >
              {contentType === "success" && (
                <icons.CheckCircleIcon className="h-6 w-6" aria-hidden="true" />
              )}
              {contentType === "information" && (
                <icons.InformationCircleIcon
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              )}
              {(contentType === "warning" || contentType === "warningRed") && (
                <icons.ExclamationTriangleIcon
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              )}
              {contentType === "error" && (
                <icons.XCircleIcon className="h-6 w-6" aria-hidden="true" />
              )}
            </div>
          )}

          <div className="mt-3 grow text-center sm:ml-4 sm:mt-0 sm:text-left">
            <Dialog.Title
              as="h3"
              className="mb-2 text-base font-semibold leading-6 text-neutrals-dark-900"
            >
              {title}
            </Dialog.Title>
            {renderMessage ? (
              renderMessage({ message })
            ) : (
              <p className="text-sm text-primary-400">{message}</p>
            )}
          </div>
        </div>
        {renderButtonGroup ? (
          renderButtonGroup({
            onCancel: onClose,
            onConfirm: () => {
              onClose();
              onConfirm?.();
            },
            initialFocus: cancelButtonRef,
          })
        ) : (
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={tw(
                "inline-flex w-full justify-center rounded-md bg-secondary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary-500 sm:ml-3 sm:w-auto",
              )}
              onClick={() => {
                onClose();
                onConfirm?.();
              }}
            >
              Confirm
            </button>
            {boxType === "confirm" && (
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={onClose}
                ref={cancelButtonRef}
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
