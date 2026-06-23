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
      name: "e_rl_c", // region-location-customer
      storage: createJSONStorage(() => localStorage),
    }
  )
)
