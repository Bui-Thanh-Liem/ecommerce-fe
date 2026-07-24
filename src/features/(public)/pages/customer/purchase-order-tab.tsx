"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFindAllOwnedOrders } from "@/hooks/apis/customer/use-order"
import { OrderStatus } from "@/shared/enums/order-status.enum"
import { CalendarDays, ShoppingBag } from "lucide-react"
import { ORDER_STATUS_LABEL, OrderCard } from "./order-card"
import { useState } from "react"

export function PurchaseOrderTab() {
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.SUCCESS)

  const { data } = useFindAllOwnedOrders({ filters: { status } })
  const orders = data?.metadata?.data || []
  console.log("orders :::", orders)

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <h2 className="text-3xl font-semibold">Đơn hàng đã mua</h2>

        <Button variant="ghost" className="w-fit">
          <CalendarDays className="mr-2 h-4 w-4" />
          05/07/2025 - 05/07/2026
        </Button>
      </div>
      <Tabs defaultValue={OrderStatus.SUCCESS} orientation="horizontal">
        <TabsList className="flex w-full flex-row! justify-between">
          {Object.values(OrderStatus).map((status) => (
            <TabsTrigger
              key={status}
              value={status}
              className="data-[state=active]:border-primary w-fit shrink-0 rounded-md border px-5 py-2"
              onClick={() => setStatus(status)}
            >
              {ORDER_STATUS_LABEL[status]}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.values(OrderStatus).map((status) => (
          <TabsContent key={status} value={status} className="mt-6">
            {orders.length === 0 ? (
              <EmptyOrder />
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function EmptyOrder() {
  return (
    <div className="bg-background flex min-h-125 flex-col items-center justify-center rounded-lg px-6 text-center">
      <ShoppingBag className="text-primary mb-6 h-24 w-24" strokeWidth={1.5} />

      <h3 className="text-3xl font-semibold">
        Rất tiếc, không tìm thấy đơn hàng nào phù hợp
      </h3>

      <p className="text-muted-foreground mt-3">
        Vẫn còn rất nhiều sản phẩm đang chờ bạn.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button variant="outline">Tivi</Button>
        <Button variant="outline">Tủ lạnh</Button>
        <Button variant="outline">Máy lạnh</Button>
        <Button variant="outline">Máy giặt</Button>
        <Button variant="outline">Gia dụng</Button>
      </div>

      <Button className="mt-10">Về trang chủ</Button>
    </div>
  )
}
