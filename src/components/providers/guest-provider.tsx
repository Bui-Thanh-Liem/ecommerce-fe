"use client"
import { useEffect } from "react"
import Cookies from "js-cookie"

export function GuestProvider() {
  useEffect(() => {
    const sessionId = Cookies.get("e_session") !== undefined

    if (!sessionId) {
      Cookies.set("e_session", crypto.randomUUID(), {
        expires: 365,
        path: "/",
      })
    }
  }, [])

  return null
}
