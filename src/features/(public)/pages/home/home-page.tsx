"use client"

import { ReactNode } from "react"
import { CategoryListSection } from "./category-list-section"
import { CustomerHistorySection } from "./customer-history-section"
import { MainBannerSection } from "./main-banner-section"
import { MarketingProgram01Section } from "./marketing-program-01/marketing-program-01-section"
import { MarketingProgram02Section } from "./marketing-program-02"
import { MarketingProgram03Section } from "./marketing-program-03"
import { IDetailHomeConfig } from "@/shared/interfaces/models/store-front/store-front-config.interface"
import { useGetStoreFront } from "@/hooks/use-get-store-front"
import { PopularSearchSection } from "./popular-search"
import { SuggestForYouSection } from "./suggest-for-you"
import { MarketingProgram04Section } from "./marketing-program-04"
import { MarketingProgram05Section } from "./marketing-program-05"
import { MarketingProgram06Section } from "./marketing-program-06"

export function HomePage() {
  const { order } = useGetStoreFront()

  /**
   * topBanner: null,
   * header: null,
   * menu: null,
   * Cố định thứ tự hiển thị các block trên trang chủ dựa trên mảng order trong IConfigHomeConfig
   */
  const mapOrder: Record<keyof IDetailHomeConfig, ReactNode> = {
    topBanner: null,
    header: null,
    menu: null,
    mainBanner: <MainBannerSection />,
    listCategories: <CategoryListSection />,
    historyProducts: <CustomerHistorySection />,
    marketingProgram01: <MarketingProgram01Section />,
    marketingProgram02: <MarketingProgram02Section />,
    marketingProgram03: <MarketingProgram03Section />,
    suggestForYou: <SuggestForYouSection />,
    marketingProgram04: <MarketingProgram04Section />,
    marketingProgram05: <MarketingProgram05Section />,
    marketingProgram06: <MarketingProgram06Section />,
    popularSearch: <PopularSearchSection />,
  }

  return (
    <div className="space-y-6 py-8">
      {order.map((key) => (
        <div key={key}>{mapOrder[key]}</div>
      ))}
    </div>
  )
}
