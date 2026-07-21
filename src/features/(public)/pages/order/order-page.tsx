"use client"

import Cookies from "js-cookie"
import {
  useChangeQuantityItemOrder,
  useFindOneOwnedOrder,
} from "@/hooks/apis/customer/use-order"
import Image from "next/image"
import { IOrderItem } from "@/shared/interfaces/models/customer/order-item.interface"
import { formatVND } from "@/utils/format-vnd.util"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, User } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function OrderPage() {
  const orderId = Cookies.get("e_order_session") || ""
  const { data, refetch } = useFindOneOwnedOrder(orderId)
  const { mutateAsync: updateQuantity } = useChangeQuantityItemOrder()
  const order = data?.metadata || null

  // Hàm xử lý khi nhấn nút Tăng / Giảm
  async function handleQuantityChange(
    item: IOrderItem,
    type: "increase" | "decrease"
  ) {
    if (!order) return

    const newQuantity =
      type === "increase" ? item.quantity + 1 : item.quantity - 1

    await updateQuantity({
      orderId: order.id,
      orderItemId: item.id,
      quantity: newQuantity,
      productId: item.product.id,
    })
    refetch() // Refresh lại data client
  }

  if (!order) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <p className="text-xl font-medium text-gray-500">
          Đơn hàng không tồn tại hoặc đã bị xóa.
        </p>
      </div>
    )
  }

  const orderItems = order.orderItems || []

  return (
    <div className="grid min-h-screen grid-cols-12 bg-gray-50 py-8">
      <div className="col-span-4"></div>
      <div className="col-span-4 space-y-6">
        {/* Section: Địa chỉ nhận hàng */}
        <div className="rounded-4xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold">Địa chỉ nhận hàng</h3>
          {order ? (
            <div className="bg-background group rounded-4xl border">
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <User className="text-primary h-5 w-5" />

                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{order.recipientName}</h3>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4 p-5">
                <div className="flex items-start gap-3">
                  <MapPin className="text-muted-foreground h-5 w-13" />

                  <div>{order.shoppingAddress}</div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="text-muted-foreground h-5 w-5" />

                  <span>{order.recipientPhone}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-6 text-center">
              <p className="text-base font-semibold text-gray-700">
                Bạn chưa cung cấp địa chỉ nhận hàng
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Vui lòng cung cấp địa chỉ nhận hàng
              </p>
            </div>
          )}
        </div>

        {/* Section: Danh sách sản phẩm trong đơn hàng */}
        <div className="divide-y divide-gray-100 rounded-4xl bg-white shadow-sm">
          <div className="p-6 pb-3">
            <h3 className="text-lg font-bold">Chi tiết sản phẩm</h3>
          </div>

          <div className="flex flex-col space-y-6 p-6">
            {orderItems.map((item, idx) => (
              <OrderItemCard
                key={`${item.product.id}-${idx}`}
                item={item}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>

          {/* Phần hiển thị tạm tính */}
          <div className="flex items-center justify-between rounded-b-2xl bg-gray-50/50 p-6">
            <span className="font-medium text-gray-700">
              Tạm tính (
              {orderItems.reduce((acc, item) => acc + item.quantity, 0)} sản
              phẩm):
            </span>
            <span className="text-xl font-bold text-red-600">
              {formatVND(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Section: Tổng thanh toán */}
        <div className="rounded-4xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold">
            Tổng thanh toán:{" "}
            <span className="text-red-600">{formatVND(order.totalAmount)}</span>
          </h3>
          <Button
            size="lg"
            className="w-full bg-amber-600 hover:bg-amber-700"
            onClick={() => {}}
          >
            Mua ngay
          </Button>
        </div>
      </div>
      <div className="col-span-4"></div>
    </div>
  )
}

interface OrderItemCardProps {
  item: IOrderItem
  onQuantityChange: (item: IOrderItem, type: "increase" | "decrease") => void
}

function OrderItemCard({ item, onQuantityChange }: OrderItemCardProps) {
  const prod = item.product.product
  const skuInfo = item.product

  const originalPrice = skuInfo.discountPercent
    ? skuInfo.price / (1 - skuInfo.discountPercent / 100)
    : null

  const optionAttributes =
    skuInfo.sku.split("-").slice(3).join(" / ") || "Mặc định"

  return (
    <div className="flex items-start gap-x-4 border-b border-gray-100 pb-6 last:border-none last:pb-0">
      {/* Khối Ảnh Sản Phẩm */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
        <Image
          fill
          src={prod.thumbnail.url}
          alt={prod.name}
          className="object-contain p-1"
        />
      </div>

      {/* Khối Nội Dung Ở Giữa */}
      <div className="flex flex-1 flex-col space-y-2">
        <h4 className="line-clamp-2 text-base leading-snug font-semibold text-gray-900">
          {prod.name}
        </h4>

        <div className="inline-flex self-start rounded bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
          Màu/Dung lượng: {optionAttributes}
        </div>

        {skuInfo.discountPercent > 0 && (
          <div className="text-xs font-medium text-blue-600">
            Tiết kiệm {skuInfo.discountPercent}%
          </div>
        )}
      </div>

      {/* Khối Giá & Bộ tăng giảm số lượng bên phải */}
      <div className="flex min-h-24 flex-col items-end justify-between text-right">
        <div className="space-y-0.5">
          <p className="text-base font-bold text-red-600">
            {formatVND(skuInfo.price)}
          </p>
          {originalPrice && (
            <p className="text-sm text-gray-400 line-through">
              {formatVND(originalPrice)}
            </p>
          )}
        </div>

        {/* Bộ tăng/giảm số lượng giống hệt UI mẫu */}
        <div className="flex items-center overflow-hidden rounded-md border border-gray-300 bg-white">
          <button
            onClick={() => onQuantityChange(item, "decrease")}
            className="border-r border-gray-300 bg-gray-50 px-3 py-1 font-bold text-gray-600 transition hover:bg-gray-100 active:bg-gray-200"
          >
            {item.quantity === 1 ? "✕" : "−"}{" "}
            {/* Đổi icon thành dấu Xóa nếu số lượng bằng 1 */}
          </button>

          <span className="min-w-9 px-4 py-1 text-center text-sm font-bold text-gray-900">
            {item.quantity}
          </span>

          <button
            onClick={() => onQuantityChange(item, "increase")}
            className="border-l border-gray-300 bg-gray-50 px-3 py-1 font-bold text-gray-600 transition hover:bg-gray-100 active:bg-gray-200"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
