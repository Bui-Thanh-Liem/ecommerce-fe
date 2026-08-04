"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  useDeleteOwnedCustomerAddress,
  useFindAllOwnedCustomerAddresses,
  useUpdateOwnedCustomerAddress,
} from "@/hooks/apis/customer/user-customer-address"
import { ICustomerAddress } from "@/shared/interfaces/models/customer/customer-address.interface"
import { Home, MapPin, Pencil, Phone, Plus, Trash2 } from "lucide-react"
import { useState  } from "react"
import { AddressAction } from "./address-action"

export function PurchaseAddressTab() {
  const { mutateAsync } = useDeleteOwnedCustomerAddress()
  const updateApi = useUpdateOwnedCustomerAddress()
  const { data } = useFindAllOwnedCustomerAddresses()
  const addresses = data?.metadata?.data || []

  //
  const [open, setOpen] = useState(false)
  const [dataEdit, setDataEdit] = useState<ICustomerAddress | null>(null)

  //
  function handleClose() {
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)
    return () => clearTimeout(id)
  }

  //
  async function handleDelete(address: ICustomerAddress) {
    try {
      const res = await mutateAsync(address.id)
      if (res?.statusCode === 200) {
        setOpen(false)
      }
    } catch (error) {
      console.error("Error delete customer address :::", error)
    }
  }

  //
  async function handleEdit(address: ICustomerAddress) {
    setOpen(true)
    setDataEdit(address)
  }

  //
  async function handleChangeDefault(address: ICustomerAddress) {
    try {
      await updateApi.mutateAsync({
        id: address.id,
        payload: {
          isDefault: true,
        },
      })
    } catch (error) {
      console.error("Error change default customer address :::", error)
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold">Địa chỉ nhận hàng</h2>
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm địa chỉ
          </Button>
        </div>

        {addresses.length === 0 ? (
          <EmptyAddress />
        ) : (
          <div className="space-y-5">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onChangeDefault={handleChangeDefault}
              />
            ))}
          </div>
        )}
      </div>
      <AddressAction open={open} dataEdit={dataEdit} onClose={handleClose} />
    </>
  )
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onChangeDefault,
}: {
  address: ICustomerAddress
  onEdit?: (address: ICustomerAddress) => void
  onDelete?: (address: ICustomerAddress) => void
  onChangeDefault?: (address: ICustomerAddress) => void
}) {
  return (
    <div className="bg-background group rounded-4xl border">
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <Home className="text-primary h-5 w-5" />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{address.recipientName}</h3>

              <Badge variant="secondary">{address.recipientPhone}</Badge>

              {address.isDefault ? (
                <Badge>Mặc định</Badge>
              ) : (
                <Badge
                  variant="outline"
                  onClick={() => onChangeDefault?.(address)}
                  className="hidden cursor-pointer opacity-0 transition-all duration-300 ease-in-out group-hover:block group-hover:opacity-100"
                >
                  Thay đổi mặc định
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit?.(address)}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          {!address.isDefault && (
            <Button
              size="icon"
              variant="destructive"
              onClick={() => onDelete?.(address)}
            >
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
              {address.wardCommune.name}, {address.districtTown.name},{" "}
              {address.provinceCity.name}, {address.country.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="text-muted-foreground h-5 w-5" />

          <span>{address.recipientPhone}</span>
        </div>
      </div>
    </div>
  )
}

function EmptyAddress() {
  return (
    <div className="flex min-h-100 flex-col items-center justify-center rounded-xl">
      <MapPin
        className="text-muted-foreground mb-5 h-16 w-16"
        strokeWidth={1.5}
      />

      <h3 className="text-xl font-semibold">Bạn chưa có địa chỉ nào</h3>

      <p className="text-muted-foreground mt-2">
        Thêm địa chỉ để thanh toán nhanh hơn.
      </p>
    </div>
  )
}
