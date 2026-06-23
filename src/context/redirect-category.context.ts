import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface RedirectCategoryData {
  productSlug?: string
  categoryName?: string
  parentCategoryName?: string
}

interface State {
  data: RedirectCategoryData | null
  setData: (data: Partial<RedirectCategoryData>) => void
  clearData: () => void
}

export const useRedirectCategoryContext = create<State>()(
  persist(
    (set) => ({
      data: null,
      setData: (data) => set((state) => ({ data: { ...state.data, ...data } })),
      clearData: () => set({ data: null }),
    }),
    {
      name: "e_rc", // redirect-category
      storage: createJSONStorage(() => localStorage),
    }
  )
)
