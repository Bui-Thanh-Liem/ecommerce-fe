"use client"

import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useCustomerContext } from "@/context/customer.context"
import { AccountSidebar } from "./account-sidebar"
import { PurchaseOrderTab } from "./purchase-order-tab"
import { PurchaseAddressTab } from "./purchase-address-tab"
import { PurchaseCouponTab } from "./purchase-coupon-tab"
import { LoginPage } from "./login-page"

export function PurchaseHistoryPage() {
  const { customer } = useCustomerContext()

  return (
    <div className="grid grid-cols-12 py-12">
      <div className="col-span-2"></div>
      <div className="col-span-8">
        {customer ? (
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
        ) : (
          <LoginPage />
        )}
      </div>
      <div className="col-span-2"></div>
    </div>
  )
}
