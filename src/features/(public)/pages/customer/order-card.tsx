"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { OrderStatus } from "@/shared/enums/order-status.enum"
import Image from "next/image"
import Link from "next/link"

export interface IOrderItem {
  id: string
  productName: string
  variantName?: string
  image: string
  quantity: number
  price: number
}

export interface IOrderCard {
  id: string
  code: string
  createdAt: string
  status: OrderStatus
  total: number
  items: IOrderItem[]
}

const STATUS_COLOR: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "secondary",
  [OrderStatus.CONFIRMED]: "default",
  [OrderStatus.SHIPPING]: "default",
  [OrderStatus.DELIVERING]: "default",
  [OrderStatus.SUCCESS]: "default",
  [OrderStatus.CANCELLED]: "destructive",
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Chờ xử lý",
  [OrderStatus.CONFIRMED]: "Đã xác nhận",
  [OrderStatus.SHIPPING]: "Đang vận chuyển",
  [OrderStatus.DELIVERING]: "Đang giao",
  [OrderStatus.SUCCESS]: "Hoàn thành",
  [OrderStatus.CANCELLED]: "Đã huỷ",
}

interface Props {
  order: IOrderCard
}

export function OrderCard({ order }: Props) {
  return (
    <div className="bg-background rounded-xl border shadow-sm">
      {/* Header */}

      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h3 className="font-semibold">Đơn hàng #{order.code}</h3>

          <p className="text-muted-foreground mt-1 text-sm">
            {new Date(order.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>

        <Badge
          variant={
            STATUS_COLOR[order.status] as
              | "default"
              | "secondary"
              | "destructive"
          }
        >
          {STATUS_LABEL[order.status]}
        </Badge>
      </div>

      <Separator />

      {/* Products */}

      <div>
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-4 p-5 not-last:border-b">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border">
              <Image
                src={item.image}
                alt={item.productName}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-1 flex-col">
              <h4 className="font-medium">{item.productName}</h4>

              {item.variantName && (
                <p className="text-muted-foreground mt-1 text-sm">
                  {item.variantName}
                </p>
              )}

              <div className="mt-auto flex items-center justify-between">
                <span className="text-muted-foreground">
                  SL x{item.quantity}
                </span>

                <span className="font-semibold text-red-600">
                  {item.price.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Footer */}

      <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Tổng thanh toán</p>

          <p className="text-2xl font-bold text-red-600">
            {order.total.toLocaleString("vi-VN")}₫
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
