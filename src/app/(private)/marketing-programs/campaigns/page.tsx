import { CampaignPage } from "@/features/(private)/mkt-program/campaign/campaign-page"
import { Suspense } from "react"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <Suspense fallback={<div>Loading campaigns...</div>}>
            <CampaignPage />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
