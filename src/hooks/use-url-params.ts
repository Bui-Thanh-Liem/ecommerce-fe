// hooks/use-url-params.ts
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export function useUrlParams<T extends Record<string, any>>(defaultValues: T) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const getParams = useCallback(() => {
    const params: Record<string, any> = { ...defaultValues }
    searchParams.forEach((value, key) => {
      if (typeof defaultValues[key] === "number") {
        params[key] = Number(value)
      } else {
        params[key] = value
      }
    })
    return params as T
  }, [searchParams, defaultValues])

  const setParams = useCallback(
    (newParams: Partial<T>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      Object.entries(newParams).forEach(([key, value]) => {
        // Nếu value bằng giá trị mặc định, hoặc null/undefined thì GỠ khỏi URL luôn cho sạch
        if (
          value === undefined ||
          value === null ||
          value === "" ||
          value === defaultValues[key]
        ) {
          current.delete(key)
        } else {
          current.set(key, String(value))
        }
      })

      const search = current.toString()
      const query = search ? `?${search}` : ""
      router.push(`${pathname}${query}`)
    },
    [router, pathname, searchParams, defaultValues]
  )

  return { params: getParams(), setParams }
}
