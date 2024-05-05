import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";

import { Button, icons, Input, ScrollArea } from "@lightit/ui";

import { getClientsWithProjectsQuery } from "~/api/clients";
import { ScreenLoading } from "~/components";
import { PERMISSIONS, usePermissions } from "~/hooks";
import { MODAL_ROUTES, useNavigateModal } from "~/router";
import { errorToast, formatBackendDate } from "~/utils";
import { ClientCard } from "./ClientCard";

export const ClientTab = () => {
  const { hasPermission } = usePermissions();
  const [filters, setFilters] = useState<{
    search: string;
    sortByName: boolean;
  }>({ search: "", sortByName: true });
  const navigateModal = useNavigateModal();

  const { data: clients } = useQuery({
    ...getClientsWithProjectsQuery(filters.sortByName),
    onError: errorToast,
  });

  if (!clients) {
    return <ScreenLoading />;
  }

  const filteredClients = clients.data.filter(
    (client) =>
      !filters.search ||
      client.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      client.projects.some((project) =>
        project.name.toLowerCase().includes(filters.search.toLowerCase()),
      ),
  );

  const handleClientClick = (clientId: number) => {
    navigateModal(`${MODAL_ROUTES.clientForm}/${clientId}`);
  };

  return (
    <div className="flex grow flex-col">
      <div className="my-4 flex flex-row justify-between px-8">
        <Input
          id="filter"
          left={<MagnifyingGlassIcon width={16} />}
          onChange={(event) => {
            setFilters((prev) => ({ ...prev, search: event.target.value }));
          }}
          placeholder="Clients and Projects..."
        />

        {hasPermission(PERMISSIONS.createClient) && (
          <Button
            variant="secondary"
            size="sm"
            className="h-9"
            right={<icons.PlusCircleIcon />}
            onClick={() => navigateModal(MODAL_ROUTES.clientForm)}
          >
            Add New
          </Button>
        )}
      </div>

      <ScrollArea>
        <div className="flex h-fit flex-auto flex-wrap gap-x-5 gap-y-8 px-4 pb-8 pt-3">
          {filteredClients?.map((client) => (
            <div
              className="h-full w-3/5 min-w-[260px] rounded-lg md:w-1/6"
              key={client.name}
            >
              <ClientCard
                clientName={client.name}
                clientImage={client.thumbnail}
                projects={client.projectsCount}
                startDate={formatBackendDate(client.createdAt)}
                onViewClient={() => {
                  hasPermission(PERMISSIONS.updateClient) &&
                    handleClientClick(client.id);
                }}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
