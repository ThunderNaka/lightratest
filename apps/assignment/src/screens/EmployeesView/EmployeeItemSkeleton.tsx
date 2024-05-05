import { Skeleton } from "@lightit/ui";

export const EmployeeItemSkeleton = () => {
  return (
    <li>
      <div className="divide-y overflow-hidden rounded-2xl border">
        <div className="flex w-full items-center p-4 duration-300 data-[state=open]:rounded-b-none [&[data-state=closed]>div:last-child]:before:content-['Expand'] [&[data-state=open]>div:last-child>svg]:rotate-90 [&[data-state=open]>div:last-child]:before:content-['Collapse']">
          <div className="flex w-1/4 items-center gap-3 text-left">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex min-w-0 flex-col gap-2">
              <Skeleton className="h-3 w-24 p-2" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>

          <div className="flex grow items-center justify-center text-sm">
            <div className="relative">
              <span className="absolute right-full top-0 px-2">
                <Skeleton className="absolute right-full h-4 w-20" />
              </span>

              <div className="border-x px-2">
                <Skeleton className="h-4 w-6" />
              </div>

              <span className="absolute left-full top-0 px-2">
                <Skeleton className="h-4 w-20" />
              </span>
            </div>
          </div>

          <div className="flex w-1/4 items-center justify-end gap-1.5 px-4 py-2 text-sm text-nostalgia-purple-900">
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </li>
  );
};
