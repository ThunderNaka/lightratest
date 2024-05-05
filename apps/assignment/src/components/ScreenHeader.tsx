import type { ReactNode } from "react";

import { Breadcrumbs } from "./Breadcrumbs";

interface Path {
  name: string;
  href: string;
}

interface ScreenHeaderProps {
  actions?: ReactNode;
  path: Path[];
  title: string;
}
export const ScreenHeader = ({ actions, path, title }: ScreenHeaderProps) => {
  return (
    <header className="flex flex-col gap-4 p-8 pb-6">
      <Breadcrumbs pages={path} />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-neutrals-dark-900">{title}</h1>
        {actions}
      </div>
    </header>
  );
};
