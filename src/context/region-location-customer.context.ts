import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface State {
  location: string
  setLocation: (location: string) => void
}

export const useRLCustomerContext = create<State>()(
  persist(
    (set) => ({
      location: "",
      setLocation: (location) => set({ location }),
    }),
    {
      name: "rl_customer_storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
