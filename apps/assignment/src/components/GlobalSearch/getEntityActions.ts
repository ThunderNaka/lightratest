import type { JsonStructure } from "react-cmdk";
import type { NavigateFunction } from "react-router-dom";

import type { SearchResultItem } from "~/api/search";

const getNavigationLink = (entity: SearchResultItem): string => {
  switch (entity.entityType) {
    case "project":
      return `projects/${entity.id}`;
    case "client":
      return `clientForm/${entity.id}`;
    case "team":
      return `team-and-users/team/${entity.id}`;
    case "employee":
      return `employees/${entity.id}`;
    default:
      return "";
  }
};

export const getEntityActions = (
  entity: SearchResultItem | undefined,
  navigate: NavigateFunction,
  handleSearchReset: () => void,
): JsonStructure =>
  entity
    ? [
        {
          id: `${entity.entityType
            .charAt(0)
            .toUpperCase()}${entity.entityType.slice(1)} - ${entity?.label}`,
          items: [
            {
              id: "navigateTo",
              children: "Navigate",
              icon: "HomeIcon",
              showType: false,
              onClick: () => navigate(getNavigationLink(entity)),
            },
            {
              id: "goBack",
              children: "Go Back",
              icon: "ArrowLeftIcon",
              closeOnSelect: false,
              onClick: handleSearchReset,
            },
          ],
        },
      ]
    : [];
