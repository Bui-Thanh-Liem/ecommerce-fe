import { PromotionPage } from "@/features/(private)/mkt-program/promotion/promotion-page"
import { Suspense } from "react"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <Suspense fallback={<div>Loading...</div>}>
            <PromotionPage />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
