import { create } from "zustand";

export interface GlobalSearchStoreState {
  showGlobalSearch: boolean;
  setShowGlobalSearch: (value: boolean) => void;
}

export const useGlobalSearchStore = create<GlobalSearchStoreState>()((set) => ({
  showGlobalSearch: false,
  setShowGlobalSearch: (value) =>
    set((_state) => ({ showGlobalSearch: value })),
}));
