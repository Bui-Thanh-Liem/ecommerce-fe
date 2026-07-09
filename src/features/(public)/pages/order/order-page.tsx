"use client"

import { useFindAllOwnedOrders } from "@/hooks/apis/customer/use-order"
import { useFindOneIsDefaultCustomerAddress } from "@/hooks/apis/customer/user-customer-address"
import { AddressAction, AddressCard } from "../customer/purchase-address-tab"
import { ICustomerAddress } from "@/shared/interfaces/models/customer/customer-address.interface"
import { useState } from "react"

export function OrderPage() {
  const { data } = useFindAllOwnedOrders()
  const orders = data?.metadata?.data || []
  const order = orders[0] || null
  const { data: defaultAddress } = useFindOneIsDefaultCustomerAddress()
  const addressDefault = defaultAddress?.metadata || null

  //
  const [open, setOpen] = useState(false)
  const [dataEdit, setDataEdit] = useState<ICustomerAddress | null>(null)

  console.log("useFindAllOwnedOrders data", data)
  console.log("useFindOneIsDefaultCustomerAddress data", defaultAddress)

  //
  async function handleEdit(address: ICustomerAddress) {
    setOpen(true)
    setDataEdit(address)
  }

  //
  function handleClose() {
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)
    return () => clearTimeout(id)
  }

  return (
    <>
      <div className="grid grid-cols-12">
        <div className="col-span-2"></div>
        <div className="col-span-8 h-[calc(100vh-300px)] space-y-12 py-12">
          <div>
            {addressDefault ? (
              <AddressCard address={addressDefault} onEdit={handleEdit} />
            ) : (
              <div className="rounded-4xl bg-gray-50 py-4 text-center">
                <p className="text-lg font-bold">
                  Bạn chưa cung cấp địa chỉ nhận hàng
                </p>
                <p className="text-gray-500">
                  Vui lòng cung cấp địa chỉ nhận hàng bằng cách nhấn vào nút
                  phía trên bên phải
                </p>
              </div>
            )}
          </div>
          <div className="flex h-24 items-center gap-x-12 rounded-4xl bg-gray-50">
            <div className="w-52"></div>
            <div className="flex-1"></div>
          </div>
        </div>
        <div className="col-span-2"></div>
      </div>

      <AddressAction open={open} dataEdit={dataEdit} onClose={handleClose} />
    </>
  )
}
