import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

import { tw } from "@lightit/shared";

interface Page {
  name: string;
  href: string;
}

export interface BreadcrumbsProps {
  pages: Page[];
}
export const Breadcrumbs = ({ pages }: BreadcrumbsProps) => {
  const navigate = useNavigate();
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ul className="flex items-center space-x-4">
        {pages.map((page, index) => (
          <li key={page.name}>
            <div className="flex">
              <button
                onClick={() => navigate(page.href)}
                type="button"
                className={tw(
                  `mr-4 text-sm hover:text-gray-700 ${
                    index + 1 == pages.length
                      ? "font-semibold text-primary-400"
                      : "font-medium text-primary-300"
                  }`,
                )}
              >
                {page.name}
              </button>
              {index < pages.length - 1 && (
                <ChevronRightIcon
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
};
