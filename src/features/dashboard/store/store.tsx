"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useFindAllStores } from "@/hooks/use-store"
import { IStore } from "@/shared/interfaces/models/store.interface"

function StoreCard({ store }: { store: IStore }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{store.name}</CardTitle>
        <CardDescription>{store.address}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Additional store details can be displayed here.</p>
      </CardContent>
    </Card>
  )
}

export function StorePage() {
  const { data } = useFindAllStores()
  const stores = data?.metadata || []
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {stores.map((store) => (
        <StoreCard store={store} key={store.id} />
      ))}
    </div>
  )
}
