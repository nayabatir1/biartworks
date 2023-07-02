import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Store = {
  token: null | string;
  logout: () => void;
  authenticate: (arg0: string) => void;
};

const useStore = create<Store, [["zustand/persist", unknown]]>(
  persist(
    (set) => ({
      token: null,
      logout: () => set({ token: null }),
      authenticate: (token: string) => set({ token }),
    }),
    { name: "orcalean", storage: createJSONStorage(() => localStorage) }
  )
);

export default useStore;
