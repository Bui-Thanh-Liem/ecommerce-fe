import { IStaff } from "@/shared/interfaces/models/management/staff.interface"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface State {
  staff: IStaff | null
  setStaff: (staff: IStaff) => void
  clearStaff: () => void
}

export const useStaffContext = create<State>()(
  persist(
    (set) => ({
      staff: null,
      setStaff: (staff) => set({ staff }),
      clearStaff: () => set({ staff: null }),
    }),
    {
      name: "e_s", // staff
      storage: createJSONStorage(() => localStorage),
    }
  )
)
