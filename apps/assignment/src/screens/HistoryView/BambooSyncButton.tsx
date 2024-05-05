import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

import { icons } from "@lightit/ui";

import { syncBambooTimeOff } from "~/api/assignments";
import { errorToast } from "~/utils";

export const BambooSyncButton = ({ lastSyncDate }: { lastSyncDate?: Date }) => {
  const queryClient = useQueryClient();
  const {
    mutate: syncBambooTimeOffMutation,
    isLoading,
    data,
  } = useMutation({
    mutationFn: syncBambooTimeOff.mutation,
    onSuccess: () => syncBambooTimeOff.invalidates(queryClient),
    onError: errorToast,
  });
  const lastDate = data?.bambooLastSync ? data.bambooLastSync : lastSyncDate;
  const lastSync = lastDate
    ? `${formatDistanceToNow(new Date(lastDate), {
        includeSeconds: true,
      })} ago`
    : "-";

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-end text-xs text-neutrals-dark-500">
        {isLoading ? (
          "Synchronizing..."
        ) : (
          <>
            <label
              htmlFor="bamboo-last-synced"
              className="text-neutrals-dark-200"
            >
              Last synced
            </label>
            <p id="bamboo-last-synced">{lastSync}</p>
          </>
        )}
      </div>

      <button
        onClick={() => syncBambooTimeOffMutation()}
        disabled={isLoading}
        className="flex h-9 w-9 items-center justify-center rounded-md bg-[#73C41D] hover:bg-[#59A00E] disabled:cursor-not-allowed disabled:bg-[#73C41D]/60 disabled:hover:bg-[#73C41D]/60"
      >
        {isLoading ? <icons.BambooSpinnerIcon /> : <icons.BambooIcon />}
      </button>
    </div>
  );
};
