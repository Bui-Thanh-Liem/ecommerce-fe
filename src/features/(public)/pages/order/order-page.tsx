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
import { useSepayCheckout } from "@/hooks/apis/payment/use-sepay"
import { PaymentMethod } from "@/shared/enums/payment-method.enum"

interface OrderItemCardProps {
  item: IOrderItem
  onQuantityChange: (item: IOrderItem, type: "increase" | "decrease") => void
}

export function OrderPage() {
  const orderId = Cookies.get("e_order_session") || ""
  const { mutateAsync: checkout } = useSepayCheckout()
  const { data, refetch, isLoading } = useFindOneOwnedOrder(orderId)
  const { mutateAsync: updateQuantity } = useChangeQuantityItemOrder()
  const order = data?.metadata || null
  const orderItems = order?.orderItems || []

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

  //
  async function handleBuyNow() {
    if (!order) return

    try {
      const payload = {
        order: order.id,
        amount: order.totalAmount,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
      }

      // 1. Gọi API Backend của bạn để xin checkoutURL và checkoutFormFields
      const res = await checkout(payload)

      if (
        !res ||
        !res.metadata?.checkoutURL ||
        !res.metadata?.checkoutFormFields
      ) {
        console.error("Invalid response from checkout:", res)
        return
      }

      const { checkoutURL, checkoutFormFields } = res.metadata

      // 2. Tạo HTML Form ẩn
      const form = document.createElement("form")
      form.method = "POST"
      form.action = checkoutURL
      form.enctype = "application/x-www-form-urlencoded"
      form.style.display = "none"

      // 3. Map CHÍNH XÁC các field động từ backend trả về
      Object.entries(checkoutFormFields).forEach(([key, value]) => {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = key
        input.value = String(value ?? "")
        form.appendChild(input)
      })

      // 4. Submit form để trình duyệt REDIRECT hẳn sang SePay (Bỏ qua được CORS)
      document.body.appendChild(form)
      form.submit()
    } catch (error) {
      console.error("Error occurred while processing payment:", error)
    }
  }

  //
  if (!order && !isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <p className="text-xl font-medium text-gray-500">
          Đơn hàng không tồn tại hoặc đã bị xóa.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return <OrderPageSkeleton />
  }

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
                  <MapPin className="text-muted-foreground h-5 w-5" />

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
              {formatVND(order?.totalAmount)}
            </span>
          </div>
        </div>

        {/* Section: Tổng thanh toán */}
        <div className="rounded-4xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold">
            Tổng thanh toán:{" "}
            <span className="text-red-600">
              {formatVND(order?.totalAmount)}
            </span>
          </h3>
          <Button
            size="lg"
            className="w-full bg-amber-600 hover:bg-amber-700"
            onClick={handleBuyNow}
          >
            Mua ngay
          </Button>
        </div>
      </div>
      <div className="col-span-4"></div>
    </div>
  )
}

function OrderItemCard({ item, onQuantityChange }: OrderItemCardProps) {
  const variant = item.product
  const prod = variant.product
  const skuInfo = item.product

  const originalPrice = skuInfo.discountPercent
    ? skuInfo.price / (1 - skuInfo.discountPercent / 100)
    : null

  // const salesAttributes = variant.salesAttributes || []
  // const attributeValues =
  //   salesAttributes
  //     .filter((attr) => attr.isSKU)
  //     .slice(0, 4)
  //     .map((attr) => attr.desc) || []

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
        {/* 
        <div className="flex flex-wrap gap-1">
          {attributeValues.length > 0 &&
            attributeValues.map((attr, idx) => (
              <span
                key={`${attr}-${idx}`}
                className="rounded bg-[#f1f1f1] px-2 py-0.5 text-[11px] text-[#555]"
              >
                {attr}
              </span>
            ))}
        </div> */}

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

export function OrderPageSkeleton() {
  return (
    <div className="grid min-h-screen grid-cols-12 bg-gray-50 py-8">
      <div className="col-span-4" />

      <div className="col-span-4 animate-pulse space-y-6">
        {/* Địa chỉ */}
        <div className="rounded-4xl bg-white p-6 shadow-sm">
          <div className="mb-6 h-6 w-44 rounded bg-gray-200" />

          <div className="rounded-4xl border p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-gray-200" />
                <div className="h-3 w-24 rounded bg-gray-200" />
              </div>
            </div>

            <div className="my-5 h-px bg-gray-200" />

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1 h-5 w-5 rounded bg-gray-200" />
                <div className="h-4 w-full rounded bg-gray-200" />
              </div>

              <div className="flex gap-3">
                <div className="h-5 w-5 rounded bg-gray-200" />
                <div className="h-4 w-40 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="rounded-4xl bg-white shadow-sm">
          <div className="p-6">
            <div className="h-6 w-48 rounded bg-gray-200" />
          </div>

          <div className="space-y-6 p-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <OrderItemSkeleton key={index} />
            ))}
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-6">
            <div className="h-5 w-48 rounded bg-gray-200" />
            <div className="h-6 w-32 rounded bg-gray-200" />
          </div>
        </div>

        {/* Thanh toán */}
        <div className="rounded-4xl bg-white p-6 shadow-sm">
          <div className="mb-6 h-7 w-64 rounded bg-gray-200" />

          <div className="h-12 w-full rounded-xl bg-gray-200" />
        </div>
      </div>

      <div className="col-span-4" />
    </div>
  )
}

function OrderItemSkeleton() {
  return (
    <div className="flex items-start gap-4 border-b border-gray-100 pb-6 last:border-none">
      {/* Image */}
      <div className="h-24 w-24 rounded-lg bg-gray-200" />

      {/* Content */}
      <div className="flex-1 space-y-3">
        <div className="h-5 w-4/5 rounded bg-gray-200" />
        <div className="h-4 w-3/5 rounded bg-gray-200" />
        <div className="h-3 w-20 rounded bg-gray-200" />
      </div>

      {/* Price */}
      <div className="flex flex-col items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-5 w-24 rounded bg-gray-200" />
          <div className="h-4 w-16 rounded bg-gray-200" />
        </div>

        <div className="flex h-9 w-28 overflow-hidden rounded border border-gray-200">
          <div className="w-9 bg-gray-200" />
          <div className="flex-1 bg-gray-100" />
          <div className="w-9 bg-gray-200" />
        </div>
      </div>
    </div>
  )
}
