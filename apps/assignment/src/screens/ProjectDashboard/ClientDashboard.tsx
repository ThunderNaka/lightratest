import { Breadcrumbs } from "~/components";
import { ROUTES } from "~/router";
import { ClientTab } from "./ClientTab";

export const ClientDashboard = () => {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden p-8">
      <Breadcrumbs pages={[{ name: "Clients", href: ROUTES.clients }]} />

      <ClientTab />
    </div>
  );
};
