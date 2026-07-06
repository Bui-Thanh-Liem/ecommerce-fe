"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Home, MapPin, Pencil, Phone, Plus, Trash2 } from "lucide-react"

interface ICustomerAddress {
  id: string
  fullname: string
  phone: string
  province: string
  district: string
  ward: string
  address: string
  isDefault: boolean
}

const mockAddresses: ICustomerAddress[] = [
  {
    id: "1",
    fullname: "Nguyễn Văn A",
    phone: "0987654321",
    province: "TP Hồ Chí Minh",
    district: "Quận 1",
    ward: "Phường Bến Nghé",
    address: "12 Nguyễn Huệ",
    isDefault: true,
  },
  {
    id: "2",
    fullname: "Nguyễn Văn A",
    phone: "0987654321",
    province: "TP Hồ Chí Minh",
    district: "Quận Bình Thạnh",
    ward: "Phường 25",
    address: "120 Điện Biên Phủ",
    isDefault: false,
  },
]

export function PurchaseAddressTab() {
  const addresses = mockAddresses

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Địa chỉ nhận hàng</h2>

        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm địa chỉ
        </Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyAddress />
      ) : (
        <div className="space-y-5">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      )}
    </div>
  )
}

function AddressCard({ address }: { address: ICustomerAddress }) {
  return (
    <div className="bg-background rounded-xl border">
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <Home className="text-primary h-5 w-5" />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{address.fullname}</h3>

              <Badge variant="secondary">{address.phone}</Badge>

              {address.isDefault && <Badge>Mặc định</Badge>}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>

          {!address.isDefault && (
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <MapPin className="text-muted-foreground mt-1 h-5 w-5" />

          <div>
            <p className="font-medium">{address.address}</p>

            <p className="text-muted-foreground">
              {address.ward}, {address.district}, {address.province}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="text-muted-foreground h-5 w-5" />

          <span>{address.phone}</span>
        </div>
      </div>
    </div>
  )
}

function EmptyAddress() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border">
      <MapPin
        className="text-muted-foreground mb-5 h-16 w-16"
        strokeWidth={1.5}
      />

      <h3 className="text-xl font-semibold">Bạn chưa có địa chỉ nào</h3>

      <p className="text-muted-foreground mt-2">
        Thêm địa chỉ để thanh toán nhanh hơn.
      </p>

      <Button className="mt-8">
        <Plus className="mr-2 h-4 w-4" />
        Thêm địa chỉ
      </Button>
    </div>
  )
}
