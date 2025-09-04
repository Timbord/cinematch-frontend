import { create } from "zustand";

export const useSearchStore = create((set) => ({
  isOpen: false,
  setIsOpen: (boolean) => set(() => ({ isOpen: boolean })),
  query: "",
  setQuery: (query) => set(() => ({ query })),
  showGenre: false,
  setShowGenre: (boolean) => set(() => ({ showGenre: boolean })),
  chatOpen: false,
  setChatOpen: (boolean) => set(() => ({ chatOpen: boolean })),
}));
