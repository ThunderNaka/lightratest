import { tw } from "@lightit/shared";

interface TableLinksProps {
  title?: string;
  headers: string[];
  hasOnlyOneURL: boolean;
  action: React.ReactNode;
  children: React.ReactNode | React.ReactNode[];
}

const TableLinks = ({
  title,
  headers,
  hasOnlyOneURL,
  action,
  children,
}: TableLinksProps) => {
  return (
    <div className="flex flex-col gap-4">
      {title && <h3 className="font-medium">{title}</h3>}
      <div className="overflow-hidden rounded-lg border border-neutrals-medium-200">
        <table className="w-full table-fixed text-left">
          <colgroup>
            <col className={tw(hasOnlyOneURL ? "w-1/2" : "w-[47%]")} />
            <col className={tw(hasOnlyOneURL ? "w-1/2" : "w-[47%]")} />
            {!hasOnlyOneURL && <col className="min-w-12 w-[6%]" />}
          </colgroup>
          <thead className="border-b border-neutrals-medium-200 text-sm text-black">
            <tr className="bg-neutrals-light-200">
              {headers.map((header) => (
                <th scope="col" key={header} className="px-4 py-2 font-medium">
                  {header}
                </th>
              ))}
              {!hasOnlyOneURL && (
                <th scope="col" className="p-2 pr-4">
                  <span className="sr-only">Delete</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">{children}</tbody>
        </table>
      </div>

      <div className="flex justify-center">{action}</div>
    </div>
  );
};

export default TableLinks;
