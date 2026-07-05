"use client"

import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useCustomerContext } from "@/context/customer.context"
import { AccountSidebar } from "./account-sidebar"
import { PurchaseOrderTab } from "./purchase-order-tab"
import { PurchaseAddressTab } from "./purchase-address-tab"
import { PurchaseCouponTab } from "./purchase-coupon-tab"

export function PurchaseHistoryPage() {
  const { customer } = useCustomerContext()

  return (
    <div className="grid grid-cols-12 py-12">
      <div className="col-span-2"></div>
      <div className="col-span-8 h-[calc(100vh-300px)]">
        <div className="container py-8">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <Tabs
              defaultValue="orders"
              orientation="vertical"
              className="grid gap-8 lg:grid-cols-[280px_1fr]"
            >
              <AccountSidebar customer={customer} />

              <div className="min-h-175 bg-red-400">
                <TabsContent value="orders" className="bg-red-600">
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
