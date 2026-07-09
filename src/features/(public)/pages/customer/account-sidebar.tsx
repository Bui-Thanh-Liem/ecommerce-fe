"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ICustomer } from "@/shared/interfaces/models/customer/customer.interface"
import { Gift, LogOut, MapPinned, ReceiptText } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  useSignOutCustomer,
  useUpdateProfileCustomer,
} from "@/hooks/apis/customer/use-customer"
import { useCustomerContext } from "@/context/customer.context"

export function AccountSidebar({ customer }: { customer: ICustomer }) {
  const { mutateAsync } = useUpdateProfileCustomer()
  const { mutateAsync: signOutMutateAsync } = useSignOutCustomer()
  const { setCustomer } = useCustomerContext()

  // State quản lý trạng thái edit và giá trị input
  const [isEditing, setIsEditing] = useState(false)
  const [fullname, setFullname] = useState(customer?.fullname || "")
  const formRef = useRef<HTMLFormElement>(null)

  // Đồng bộ lại state nếu prop customer thay đổi từ phía ngoài
  useEffect(() => {
    if (customer?.fullname) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFullname(customer.fullname)
    }
  }, [customer?.fullname])

  // Xử lý Click Outside để hủy hoặc lưu trạng thái edit
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsEditing(false)
      }
    }

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isEditing])

  // Xử lý submit form khi nhấn Enter
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullname.trim()) return

    try {
      const res = await mutateAsync({
        payload: { fullname },
      })

      if (res?.statusCode === 200) {
        setCustomer({ ...customer, fullname })
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Failed to update fullname:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOutMutateAsync()
    } catch (error) {
      console.error("Failed to logout:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        {/* Hiển thị Form Input hoặc Text dựa trên trạng thái isEditing */}
        {isEditing ? (
          <form ref={formRef} onSubmit={handleSubmit} className="pt-1">
            <Input
              autoFocus
              value={fullname}
              placeholder="Nhập họ tên..."
              className="h-8 text-base font-semibold"
              onChange={(e) => setFullname(e.target.value)}
            />
          </form>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <p onDoubleClick={() => setIsEditing(true)}>
                {customer?.fullname || "Chưa có tên"}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>Nhấn đúp chuột để chỉnh sửa</p>
            </TooltipContent>
          </Tooltip>
        )}

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

      <Button variant="destructive" className="w-full" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Đăng xuất
      </Button>

      <div className="rounded-4xl border bg-amber-50 p-5">
        <h4 className="font-semibold">Tổng điểm tích lũy</h4>
        <p className="mt-1 text-3xl font-bold text-orange-600">0</p>
        <p className="text-muted-foreground mt-2 text-sm">
          Điểm sẽ được cộng sau khi đơn hàng hoàn tất.
        </p>
      </div>
    </div>
  )
}
