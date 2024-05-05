import { tw } from "@lightit/shared";

export const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={tw("animate-pulse rounded-md bg-primary-50", className)}
      {...props}
    />
  );
};
