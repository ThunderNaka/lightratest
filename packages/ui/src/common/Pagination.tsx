import { tw } from "@lightit/shared";

import { Label, Select } from "../form";
import { icons } from "./Icons";

interface PaginationProps {
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const Pagination = ({
  count,
  total,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 text-neutrals-dark-300">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-1">
          <Label label="Per page" />
          <Select
            id="select-page-size"
            value={pageSize}
            options={[
              { value: 8, label: "8" },
              { value: 12, label: "12" },
              { value: 16, label: "16" },
            ]}
            onChange={(value) => onPageSizeChange(value)}
            className="w-24"
          />
        </div>
        <p className="text-sm font-medium">{`${count}/${total} results`}</p>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-3 leading-tight hover:opacity-80 disabled:opacity-30"
          >
            <icons.ChevronLeftIcon className="h-4 w-4" />
          </button>

          <ul className="flex items-center gap-2">
            {Array.from(Array(totalPages).keys()).map((idx) => {
              const pageNumber = idx + 1;
              const isLimitPage = pageNumber === 1 || pageNumber === totalPages;
              const isSurroundingCurrentPage =
                pageNumber > currentPage - 2 && pageNumber < currentPage + 2;
              if (
                (pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2) &&
                !isLimitPage
              ) {
                return (
                  <li
                    key={idx}
                    className="w-8 select-none border-2 border-transparent py-2 text-center text-sm font-medium"
                  >
                    ...
                  </li>
                );
              }
              if (!isSurroundingCurrentPage && !isLimitPage) {
                return null;
              }
              return (
                <li key={idx}>
                  <button
                    aria-current="page"
                    onClick={() => handlePageChange(pageNumber)}
                    className={tw(
                      "h-10 w-10 rounded-full border border-transparent text-sm font-medium hover:text-neutrals-dark-900",
                      pageNumber === currentPage &&
                        "border-gray-200 hover:border-neutrals-dark-200",
                    )}
                  >
                    {pageNumber}
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-3 leading-tight hover:opacity-80 disabled:opacity-30"
          >
            <icons.ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
