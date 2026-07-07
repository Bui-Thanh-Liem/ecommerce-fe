"use client"

import { useFindAllOwnedOrders } from "@/hooks/apis/customer/use-order"

export function OrderPage() {
  const { data } = useFindAllOwnedOrders()
  const orders = data?.metadata?.data || []
  console.log("useFindAllOwnedOrders data", data)

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2"></div>
      <div className="col-span-8 h-[calc(100vh-300px)]">order page</div>
      <div className="col-span-2"></div>
    </div>
  )
}
