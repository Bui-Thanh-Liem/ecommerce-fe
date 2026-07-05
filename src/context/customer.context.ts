import { create } from "zustand"
import { ICustomer } from "@/shared/interfaces/models/customer/customer.interface"
import { createJSONStorage, persist } from "zustand/middleware"

interface State {
  customer: ICustomer | null
  setCustomer: (customer: ICustomer) => void
  clearCustomer: () => void
}

export const useCustomerContext = create<State>()(
  persist(
    (set) => ({
      customer: null,
      setCustomer: (customer) => set({ customer }),
      clearCustomer: () => set({ customer: null }),
    }),
    {
      name: "e_c", // customer
      storage: createJSONStorage(() => localStorage),
    }
  )
)
