"use client"

import { Button } from "@/components/ui/button"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ICustomer } from "@/shared/interfaces/models/customer/customer.interface"
import { Gift, LogOut, MapPinned, ReceiptText } from "lucide-react"

interface Props {
  customer?: ICustomer | null
}

export function AccountSidebar({ customer }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">{customer?.fullname}</h3>

        <p className="text-muted-foreground text-sm">{customer?.phone}</p>
      </div>

      <TabsList className="flex h-auto flex-col items-stretch gap-2 bg-transparent p-0">
        <TabsTrigger value="orders" className="justify-start gap-3 py-3">
          <ReceiptText size={18} />
          Đơn hàng đã mua
        </TabsTrigger>

        <TabsTrigger value="address" className="justify-start gap-3 py-3">
          <MapPinned size={18} />
          Sổ địa chỉ
        </TabsTrigger>

        <TabsTrigger value="coupon" className="justify-start gap-3 py-3">
          <Gift size={18} />
          Mã giảm giá
        </TabsTrigger>
      </TabsList>

      <Button variant="outline" className="w-full">
        <LogOut className="mr-2 h-4 w-4" />
        Đăng xuất
      </Button>

      <div className="rounded-xl border bg-amber-50 p-5">
        <h4 className="font-semibold">Tổng điểm tích lũy</h4>

        <p className="mt-1 text-3xl font-bold text-orange-600">0</p>

        <p className="text-muted-foreground mt-2 text-sm">
          Điểm sẽ được cộng sau khi đơn hàng hoàn tất.
        </p>
      </div>
    </div>
  )
}
