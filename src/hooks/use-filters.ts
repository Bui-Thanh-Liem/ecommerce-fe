"use client"

import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type FilterValue = string | number | boolean | null | undefined

export type Filters = Record<string, FilterValue>

export function useFilters<T extends Filters = Filters>() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  /**
   * Parse filters từ URL
   * VD:
   * /team?f=%7B%22store%22%3A%22abc%22%7D
   */
  const filters = useMemo(() => {
    const raw = searchParams.get("f")

    if (!raw) return {} as T

    try {
      return JSON.parse(raw) as T
    } catch {
      return {} as T
    }
  }, [searchParams])

  /**
   * Update filters lên URL
   */
  const setFilters = useCallback(
    (newFilters: Partial<T>) => {
      const mergedFilters = {
        ...filters,
        ...newFilters,
      }

      // remove undefined/null/""
      const cleanedFilters = Object.fromEntries(
        Object.entries(mergedFilters).filter(
          ([, value]) => value !== undefined && value !== null && value !== ""
        )
      )

      const params = new URLSearchParams(searchParams.toString())

      if (Object.keys(cleanedFilters).length === 0) {
        params.delete("f")
      } else {
        params.set("f", JSON.stringify(cleanedFilters))
      }

      router.push(`${pathname}?${params.toString()}`)
    },
    [filters, pathname, router, searchParams]
  )

  /**
   * Remove 1 filter
   */
  const removeFilter = useCallback(
    (key: keyof T) => {
      const updatedFilters = { ...filters }

      delete updatedFilters[key]

      const params = new URLSearchParams(searchParams.toString())

      if (Object.keys(updatedFilters).length === 0) {
        params.delete("f")
      } else {
        params.set("f", JSON.stringify(updatedFilters))
      }

      router.push(`${pathname}?${params.toString()}`)
    },
    [filters, pathname, router, searchParams]
  )

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    params.delete("f")

    router.push(`${pathname}?${params.toString()}`)
  }, [pathname, router, searchParams])

  return {
    filters,
    setFilters,
    removeFilter,
    clearFilters,
  }
}
