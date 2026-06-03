"use client"

import { useSearchParams } from "next/navigation"

export function AccountPage() {
  const searchParams = useSearchParams()
  const t = searchParams.get("t")
  return (
    <div>
      <p>Profile page is under construction</p>
      {Boolean(t) && <p>Hành động của bạn là bất thường</p>}
    </div>
  )
}
