"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { OrderStatus } from "@/shared/enums/order-status.enum"
import { IOrder } from "@/shared/interfaces/models/customer/order.interface"
import Image from "next/image"
import Link from "next/link"

const STATUS_COLOR: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "secondary",
  [OrderStatus.CONFIRMED]: "default",
  [OrderStatus.SHIPPING]: "default",
  [OrderStatus.DELIVERING]: "default",
  [OrderStatus.SUCCESS]: "default",
  [OrderStatus.CANCELLED]: "destructive",
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Chờ xử lý",
  [OrderStatus.CONFIRMED]: "Đã xác nhận",
  [OrderStatus.SHIPPING]: "Đang vận chuyển",
  [OrderStatus.DELIVERING]: "Đang giao",
  [OrderStatus.SUCCESS]: "Hoàn thành",
  [OrderStatus.CANCELLED]: "Đã huỷ",
}

export function OrderCard({ order }: { order: IOrder }) {
  return (
    <div className="bg-background rounded-xl border shadow-sm">
      {/* Header */}

      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h3 className="font-semibold">Đơn hàng #{order.invoiceNumber}</h3>

          <p className="text-muted-foreground mt-1 text-sm">
            {new Date(order.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>

        <Badge variant={STATUS_COLOR[order.status] as any}>
          {ORDER_STATUS_LABEL[order.status]}
        </Badge>
      </div>

      <Separator />

      {/* Products */}

      <div>
        {order.orderItems.map((item) => {
          const variant = item.product
          const product = variant?.product
          const salesAttributes = variant?.salesAttributes

          return (
            <div key={item.id} className="flex gap-4 p-5 not-last:border-b">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border">
                <Image
                  fill
                  alt={product.name}
                  className="object-cover"
                  src={product.thumbnail.url}
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">{product.name}</h4>

                <div className="flex flex-wrap gap-1">
                  {salesAttributes.length > 0 &&
                    salesAttributes.map((attr, idx) => (
                      <span
                        key={`${attr}-${idx}`}
                        className="rounded bg-[#f1f1f1] px-2 py-0.5 text-[11px] text-[#555]"
                      >
                        {attr.desc}
                      </span>
                    ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    SL x{item.quantity}
                  </span>

                  <span className="font-semibold text-red-600">
                    {item.price.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Separator />

      {/* Footer */}

      <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Tổng thanh toán</p>

          <p className="text-2xl font-bold text-red-600">
            {order.totalAmount.toLocaleString("vi-VN")}₫
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline">Mua lại</Button>

          <Button asChild>
            <Link href={`/purchase/${order.id}`}>Xem chi tiết</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
