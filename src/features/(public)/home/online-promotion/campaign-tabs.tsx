"use client"

import { useState, useEffect, useMemo } from "react"
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs"
import { useFindOptionsCampaigns } from "@/hooks/apis/mkt-program/use-campaign"
import { CampaignContent } from "./campaign-content"
import { CampaignTrigger } from "./campaign-trigger"
import { ICampaign } from "@/shared/interfaces/models/mkt-program/campaign.interface"

export function CampaignTabs({ mktId }: { mktId: string }) {
  // Fetch danh sách campaigns thuộc mktId này
  const { data: campaignsRes } = useFindOptionsCampaigns({
    filters: { marketingProgram: mktId },
  })
  const campaignsData = useMemo(
    () => campaignsRes?.metadata?.data || [],
    [campaignsRes]
  )

  // Hàm sắp xếp và lọc chiến dịch theo thứ tự: LIVE trước, UPCOMING sau, END bỏ hẳn khỏi danh sách
  function CampaignTabsList(campaigns: ICampaign[]) {
    const now = new Date().getTime()

    return (
      [...campaigns]
        // 1. Lọc bỏ hoàn toàn các campaign đã kết thúc (nếu muốn sạch UI ngay từ đầu)
        .filter((c) => new Date(c.endDate).getTime() > now)
        // 2. Tiến hành sắp xếp
        .sort((a, b) => {
          const startA = new Date(a.startDate).getTime()
          const startB = new Date(b.startDate).getTime()
          const endA = new Date(a.endDate).getTime()
          const endB = new Date(b.endDate).getTime()

          const isLiveA = now >= startA && now <= endA
          const isLiveB = now >= startB && now <= endB

          // Trường hợp 1: Cả 2 đều đang LIVE -> Thằng nào hết hạn trước xếp trước
          if (isLiveA && isLiveB) return endA - endB

          // Trường hợp 2: Thằng A LIVE, thằng B UPCOMING -> Thằng A lên đầu
          if (isLiveA && !isLiveB) return -1

          // Trường hợp 3: Thằng B LIVE, thằng A UPCOMING -> Thằng B lên đầu
          if (!isLiveA && isLiveB) return 1

          // Trường hợp 4: Cả 2 đều chưa diễn ra (UPCOMING) -> Thằng nào chạy trước xếp trước
          return startA - startB
        })
    )
  }

  // Quản lý tab Campaign hiện tại đang chọn
  const [selectedCampaignId, setSelectedCampaignId] = useState<
    string | undefined
  >(CampaignTabsList(campaignsData)[0]?.id)

  // Đồng bộ lại campaign đầu tiên khi danh sách campaignsData thay đổi
  useEffect(() => {
    if (campaignsData.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCampaignId(CampaignTabsList(campaignsData)[0].id)
    } else {
      setSelectedCampaignId(undefined)
    }
  }, [campaignsData])

  //
  if (campaignsData.length === 0) {
    return (
      <p className="mt-4 text-sm text-gray-400 italic">
        Không có chiến dịch nào.
      </p>
    )
  }

  return (
    <div className="mt-4">
      <Tabs value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
        {/* Danh sách các nút chọn chiến dịch (Campaign) */}
        <TabsList className="flex w-full items-center justify-center gap-4 bg-transparent">
          {CampaignTabsList(campaignsData).map((campaign) => (
            <CampaignTrigger
              key={campaign.id}
              campaign={campaign}
              isActive={selectedCampaignId === campaign.id}
            />
          ))}
        </TabsList>

        {/* Nội dung chi tiết của Campaign được chọn */}
        {CampaignTabsList(campaignsData).map((campaign) => (
          <TabsContent key={campaign.id} value={campaign.id}>
            {/* Chỉ render nội dung chi tiết khi tab đó thực sự được active để tối ưu API */}
            {selectedCampaignId === campaign.id && (
              <CampaignContent campaign={campaign} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
