import { PopularSearchPage } from "@/features/(private)/store-front/popular-search/popular-search-page"
import { Suspense } from "react"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <Suspense fallback={<div>Loading popular searches...</div>}>
            <PopularSearchPage />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
