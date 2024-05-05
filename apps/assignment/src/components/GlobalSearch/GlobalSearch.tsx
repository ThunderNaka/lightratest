import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CommandPalette, { filterItems, getItemIndex } from "react-cmdk";
import type { JsonStructure } from "react-cmdk";

import "react-cmdk/dist/cmdk.css";

import { useNavigate } from "react-router-dom";

import { useLogoutQuery } from "~/api/logout";
import { getDefaultSearchResults, getSearchResults } from "~/api/search";
import type { SearchResult, SearchResultItem } from "~/api/search";
import { useDebouncedQuery } from "~/hooks";
import { useGlobalSearchStore } from "~/stores";
import { errorToast } from "~/utils";
import {
  CommandPaletteLoading,
  CommandPaletteNoResults,
} from "./CommandPaletteComponents";
import { getEntityActions } from "./getEntityActions";
import { getEntityIcon } from "./getEntityIcon";

export const GlobalSearch = () => {
  const [page, setPage] = useState<"root" | "nested">("root");
  const [searchedText, setSearchedText] = useState<string | undefined>();
  const [selectedEntity, setSelectedEntity] = useState<
    SearchResultItem | undefined
  >();

  const { showGlobalSearch, setShowGlobalSearch } = useGlobalSearchStore();
  const navigate = useNavigate();

  const { data: searchResults, isLoading: isSearching } = useDebouncedQuery({
    queryFn: () => (searchedText ? getSearchResults(searchedText) : []),
    queryKey: ["getSearchResults", searchedText],
    onError: errorToast,
    select: (data) => data,
  });

  const { data: navigationResults, isInitialLoading } = useQuery({
    enabled: showGlobalSearch,
    queryFn: getDefaultSearchResults,
    queryKey: ["getDefaultSearchResults"],
    onError: errorToast,
  });
  const isLoading = isInitialLoading || isSearching;

  const { logoutMutation } = useLogoutQuery();

  const handleChangeOpen = useCallback(
    (isOpen: boolean) => {
      setShowGlobalSearch(isOpen);

      // fixes visual bugs
      if (isOpen) {
        setTimeout(() => {
          const searchInput = document.getElementById(
            "command-palette-search-input",
          );
          searchInput?.setAttribute("autocomplete", "off");
        }, 300);
      } else {
        setTimeout(() => {
          handleSearchReset();
        }, 300);
      }
    },
    [setShowGlobalSearch],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "k") {
        // CMD+K
        e.preventDefault();
        e.stopPropagation();
        handleChangeOpen(!showGlobalSearch);
      }
    },
    [handleChangeOpen, showGlobalSearch],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const getJsonStructure = (arr: SearchResult[]) =>
    arr.map((result) => ({
      ...result,
      items: result.items.map((item) => ({
        id: item.id,
        children: item.label,
        closeOnSelect: item.entityType === "navigation",
        icon: item.icon ?? getEntityIcon(item),
        showType: item.entityType !== "navigation",
        onClick: item.link
          ? () => {
              navigate(item.link ?? "");
            }
          : () => {
              setSearchedText(undefined);
              setPage("nested");
              setSelectedEntity({ ...item });
            },
      })),
    }));

  const items: JsonStructure = [
    ...getJsonStructure((searchResults as SearchResult[]) ?? []),
    ...getJsonStructure(navigationResults ?? []),
    {
      id: "Other",
      items: [
        {
          id: "log-out",
          children: "Log out",
          icon: "ArrowRightOnRectangleIcon",
          onClick: () => logoutMutation(),
        },
      ],
    },
  ];

  const handleSearchReset = () => {
    setSearchedText(undefined);
    setPage("root");
  };

  const handleInputSearchChange = (query: string) => {
    setSearchedText(query);
  };

  const filteredItems = filterItems(items, searchedText ?? "");

  const entityActions = filterItems(
    getEntityActions(selectedEntity, navigate, handleSearchReset),
    searchedText ?? "",
  );

  return (
    <CommandPalette
      onChangeSearch={handleInputSearchChange}
      onChangeOpen={handleChangeOpen}
      search={searchedText ?? ""}
      isOpen={showGlobalSearch}
      page={page}
    >
      <CommandPalette.Page id="root">
        {isLoading && <CommandPaletteLoading />}

        {filteredItems.length > 0
          ? filteredItems.map((list) => (
              <CommandPalette.List key={list.id} heading={list.id}>
                {list.items.map(({ id, ...rest }) => (
                  <CommandPalette.ListItem
                    key={id}
                    index={getItemIndex(filteredItems, id)}
                    {...rest}
                  />
                ))}
              </CommandPalette.List>
            ))
          : !isLoading && <CommandPaletteNoResults reset={handleSearchReset} />}
      </CommandPalette.Page>

      <CommandPalette.Page id="nested">
        {entityActions.map((list) => (
          <CommandPalette.List key={list.id} heading={list.id}>
            {list.items.map(({ id, ...rest }) => (
              <CommandPalette.ListItem
                key={id}
                index={getItemIndex(entityActions, id)}
                {...rest}
              />
            ))}
          </CommandPalette.List>
        ))}
      </CommandPalette.Page>
    </CommandPalette>
  );
};
