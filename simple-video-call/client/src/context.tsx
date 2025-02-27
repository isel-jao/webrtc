import { BackendApi } from "@/lib/api/backend-api";
import { User } from "@/lib/api/types";

import { createContext, useContext } from "react";
import { createStore, StoreApi, useStore } from "zustand";

type State = {
  user: User | null;
  backendApi: BackendApi;
};

type Actions = {
  setUser: (user: User) => void;
};

type TGlobalContext = StoreApi<State & Actions>;
const GlobalContext = createContext<TGlobalContext | null>(null);

export function useGlobalContext<T>(selector: (state: State & Actions) => T) {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");

  return useStore(context, selector);
}

type GlobalProviderProps = {
  children: React.ReactNode;
  value: State;
};

export function GlobalProvider({
  children,
  value: initialState,
}: GlobalProviderProps) {
  return (
    <GlobalContext.Provider
      value={createStore<State & Actions>((set) => ({
        ...initialState,
        setUser: (user) => set((state) => ({ ...state, user })),
      }))}
    >
      {children}
    </GlobalContext.Provider>
  );
}
