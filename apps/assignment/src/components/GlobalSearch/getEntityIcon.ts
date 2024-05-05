import type { IconName } from "react-cmdk";

import type { SearchResultItem } from "~/api/search";

export const getEntityIcon = (
  entity: SearchResultItem,
): IconName | undefined => {
  switch (entity.entityType) {
    case "project":
      return "FolderIcon";
    case "client":
      return "UserIcon";
    case "team":
      return "UsersIcon";
    case "employee":
      return "CodeBracketIcon";
    default:
      return;
  }
};
