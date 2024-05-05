import { Outlet } from "react-router-dom";

import { ScreenLoading } from "@lightit/ui";

import { GlobalSearch } from "~/components";
import { usePermissions } from "~/hooks";
import { Navigation } from "./Navigation";
import { NotificationsPanel } from "./Notifications/NotificationsPanel";
import { ProfilePanel } from "./ProfilePanel";

export const Layout = () => {
  const { isLoading } = usePermissions();

  return (
    <section className="flex h-screen w-full bg-primary">
      <Navigation />
      <GlobalSearch />

      <div className="flex grow flex-col overflow-hidden">
        <div className="flex items-center justify-end gap-2 bg-primary px-8 py-4 text-white">
          <NotificationsPanel />
          <ProfilePanel />
        </div>

        <main className="flex grow flex-col overflow-y-auto rounded-t-2xl bg-white lg:rounded-tr-none">
          {isLoading ? <ScreenLoading /> : <Outlet />}
        </main>
      </div>
    </section>
  );
};
