import type { ClientWithProjects } from "~/api/clients";
import { ClientRow } from "./ClientRow";

interface ClientsTableProps {
  clients?: ClientWithProjects[];
  onViewClient: (clientId: number) => void;
}

export const ClientsTable = ({ clients, onViewClient }: ClientsTableProps) => {
  return (
    <div className="h-full overflow-y-auto">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="sticky top-0 w-[17%] border-y border-neutrals-light-200 bg-white py-6 pl-8 text-left text-sm font-medium text-primary-white-700 ">
              <div className="flex flex-row items-center space-x-2">
                <p>Name</p>
              </div>
            </th>
            <th className="sticky top-0 w-[10%] border-y border-neutrals-light-200 bg-white py-6 text-left text-sm font-medium text-primary-white-700">
              Creation Date
            </th>
            <th className="sticky top-0 w-[50%] border-y border-neutrals-light-200 bg-white py-6 text-left text-sm font-medium text-primary-white-700">
              Projects
            </th>

            <th className="sticky top-0 w-[10%] border-y border-neutrals-light-200 bg-white py-6 text-left text-sm font-medium text-primary-white-700">
              Status
            </th>
            <th className="sticky top-0 z-10 w-[5%] border-y border-neutrals-light-200 bg-white text-left text-sm text-primary-white-700"></th>
          </tr>

          {clients?.map((client) => (
            <ClientRow
              client={client}
              key={client.id}
              onViewClient={onViewClient}
            />
          ))}
        </thead>
      </table>
    </div>
  );
};
