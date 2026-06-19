"use client"

import { useState, useEffect, useMemo } from "react"
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs"
import { useFindOptionsCampaigns } from "@/hooks/apis/mkt-program/use-campaign"
import { CampaignContent } from "./campaign-content"
import { CampaignTrigger } from "./campaign-trigger"

export function CampaignTabs({ mktId }: { mktId: string }) {
  const { data: campaignsRes } = useFindOptionsCampaigns({
    filters: { marketingProgram: mktId },
  })

  const campaignsData = useMemo(
    () => campaignsRes?.metadata?.data || [],
    [campaignsRes]
  )

  // 1. Đưa logic sort vào useMemo để tránh tạo reference mới khi re-render
  const sortedCampaigns = useMemo(() => {
    const now = new Date().getTime()
    return [...campaignsData].sort((a, b) => {
      const startA = new Date(a.startDate).getTime()
      const startB = new Date(b.startDate).getTime()
      const endA = new Date(a.endDate).getTime()
      const endB = new Date(b.endDate).getTime()

      const isLiveA = now >= startA && now <= endA
      const isLiveB = now >= startB && now <= endB

      if (isLiveA && isLiveB) return endA - endB
      if (isLiveA && !isLiveB) return -1
      if (!isLiveA && isLiveB) return 1
      return startA - startB
    })
  }, [campaignsData]) // Chỉ sort lại khi dữ liệu gốc thay đổi

  // Quản lý tab Campaign hiện tại đang chọn
  const [selectedCampaignId, setSelectedCampaignId] = useState<
    string | undefined
  >()

  // 2. CHỈ ĐỒNG BỘ khi danh sách thực sự thay đổi (Ví dụ thay đổi mktId hoặc refetch dữ liệu)
  useEffect(() => {
    if (sortedCampaigns.length > 0) {
      // Chỉ tự động set tab đầu tiên nếu hiện tại chưa có tab nào được chọn
      // Hoặc khi danh sách mới không chứa tab đang chọn cũ nữa
      const isCurrentTabValid = sortedCampaigns.some(
        (c) => c.id === selectedCampaignId
      )
      if (!selectedCampaignId || !isCurrentTabValid) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedCampaignId(sortedCampaigns[0]?.id)
      }
    } else {
      setSelectedCampaignId(undefined)
    }
  }, [selectedCampaignId, sortedCampaigns])

  if (sortedCampaigns.length === 0) {
    return (
      <p className="mt-4 text-sm text-gray-400 italic">
        Không có chiến dịch khuyến mãi nào hoặc đã kết thúc.
      </p>
    )
  }

  return (
    <div className="mt-4">
      <Tabs value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
        <TabsList className="flex w-full items-center justify-center gap-4 bg-transparent">
          {sortedCampaigns.map((campaign) => (
            <CampaignTrigger
              key={campaign.id}
              campaign={campaign}
              isActive={selectedCampaignId === campaign.id}
            />
          ))}
        </TabsList>

        {sortedCampaigns.map((campaign) => (
          <TabsContent key={campaign.id} value={campaign.id}>
            {selectedCampaignId === campaign.id && (
              <CampaignContent campaign={campaign} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
