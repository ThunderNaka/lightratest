import { icons, Skeleton } from "@lightit/ui";

export const AssignmentDetailsSkeleton = () => {
  return (
    <div className="flex grow flex-col">
      <div className="flex items-center justify-between border-b border-neutrals-medium-300 p-6">
        <Skeleton className="h-7 w-44" />
        <icons.XMarkIcon className="h-6 w-6 shrink-0" />
      </div>

      <div className="flex grow flex-col gap-8 p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex min-w-0 flex-col gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-16 py-1" />
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-4 w-40 py-1" />
          <Skeleton className="h-5 w-14" />
        </div>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-4 w-16 py-1" />
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-4 w-14 py-1" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-4 w-14 py-1" />
          <Skeleton className="h-5 w-48" />
        </div>
      </div>
    </div>
  );
};
