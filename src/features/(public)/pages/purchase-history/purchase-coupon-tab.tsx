"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Percent, TicketPercent } from "lucide-react"

interface ICoupon {
  id: string
  code: string
  title: string
  description: string
  discount: string
  expiredAt: string
  isExpired: boolean
}

const mockCoupons: ICoupon[] = [
  {
    id: "1",
    code: "WELCOME10",
    title: "Giảm 10%",
    description: "Đơn hàng từ 500.000đ",
    discount: "10%",
    expiredAt: "31/12/2026",
    isExpired: false,
  },
  {
    id: "2",
    code: "SALE200K",
    title: "Giảm 200.000đ",
    description: "Đơn hàng từ 2.000.000đ",
    discount: "200.000đ",
    expiredAt: "15/08/2026",
    isExpired: false,
  },
  {
    id: "3",
    code: "OLD50",
    title: "Giảm 50.000đ",
    description: "Đơn hàng từ 500.000đ",
    discount: "50.000đ",
    expiredAt: "01/01/2025",
    isExpired: true,
  },
]

export function PurchaseCouponTab() {
  const coupons = mockCoupons

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Mã giảm giá của bạn</h2>

        <Badge variant="secondary">{coupons.length} Voucher</Badge>
      </div>

      {coupons.length === 0 ? (
        <EmptyCoupon />
      ) : (
        <div className="space-y-5">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      )}
    </div>
  )
}

function CouponCard({ coupon }: { coupon: ICoupon }) {
  return (
    <div className="bg-background overflow-hidden rounded-xl border">
      <div className="flex">
        {/* Left */}

        <div className="bg-primary text-primary-foreground flex w-44 flex-col items-center justify-center">
          <TicketPercent className="h-10 w-10" />

          <div className="mt-3 text-center">
            <p className="text-sm">Voucher</p>

            <p className="text-2xl font-bold">{coupon.discount}</p>
          </div>
        </div>

        {/* Right */}

        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{coupon.title}</h3>

              {coupon.isExpired ? (
                <Badge variant="destructive">Hết hạn</Badge>
              ) : (
                <Badge>Còn hiệu lực</Badge>
              )}
            </div>

            <p className="text-muted-foreground mt-2">{coupon.description}</p>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <Percent className="h-4 w-4" />

              <span>
                Mã:
                <span className="bg-muted ml-2 rounded px-2 py-1 font-semibold">
                  {coupon.code}
                </span>
              </span>
            </div>

            <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4" />
              HSD: {coupon.expiredAt}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button disabled={coupon.isExpired}>Dùng ngay</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyCoupon() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border">
      <TicketPercent
        className="text-muted-foreground mb-5 h-20 w-20"
        strokeWidth={1.5}
      />

      <h3 className="text-xl font-semibold">Bạn chưa có mã giảm giá</h3>

      <p className="text-muted-foreground mt-2">
        Hãy theo dõi các chương trình khuyến mãi để nhận voucher.
      </p>

      <Button className="mt-8">Mua sắm ngay</Button>
    </div>
  )
}
