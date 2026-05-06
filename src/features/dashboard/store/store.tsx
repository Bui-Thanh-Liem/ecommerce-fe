"use client"
import { useFindAllStores } from "@/hooks/use-store"
import { StoreMap } from "./store-map"

export function StorePage() {
  const { data } = useFindAllStores()
  const stores = data?.metadata || []
  return <StoreMap stores={stores} />
}
