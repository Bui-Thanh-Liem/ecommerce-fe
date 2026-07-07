"use client"

import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useCustomerContext } from "@/context/customer.context"
import { AccountSidebar } from "./account-sidebar"
import { PurchaseOrderTab } from "./purchase-order-tab"
import { PurchaseAddressTab } from "./purchase-address-tab"
import { PurchaseCouponTab } from "./purchase-coupon-tab"

export function CustomerPage() {
  const { customer } = useCustomerContext()

  if (!customer) {
    return (
      <div className="grid grid-cols-12 py-12">
        <div className="col-span-2"></div>
        <div className="col-span-8 flex min-h-120 items-center justify-center">
          <p className="text-muted-foreground">
            Đang tải thông tin tài khoản và đơn hàng của bạn
          </p>
        </div>
        <div className="col-span-2"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12 py-12">
      <div className="col-span-2"></div>
      <div className="col-span-8">
        <div className="container py-8">
          <div className="w-full">
            <Tabs
              defaultValue="orders"
              orientation="vertical"
              className="grid w-full gap-8 lg:grid-cols-[280px_1fr]"
            >
              <AccountSidebar customer={customer} />

              <div className="w-full">
                <TabsContent value="orders" className="w-full">
                  <PurchaseOrderTab />
                </TabsContent>

                <TabsContent value="address">
                  <PurchaseAddressTab />
                </TabsContent>

                <TabsContent value="coupon">
                  <PurchaseCouponTab />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
      <div className="col-span-2"></div>
    </div>
  )
}
