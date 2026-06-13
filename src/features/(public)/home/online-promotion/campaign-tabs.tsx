"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs"
import { useFindOptionsCampaigns } from "@/hooks/apis/mkt-program/use-campaign"
import { CampaignContent } from "./campaign-content"
import { CampaignTrigger } from "./campaign-trigger"

interface CampaignTabsProps {
  mktId: string
}

export function CampaignTabs({ mktId }: CampaignTabsProps) {
  // Fetch danh sách campaigns thuộc mktId này
  const { data: campaignsRes } = useFindOptionsCampaigns({
    filters: { marketingProgram: mktId as any },
  })
  const campaignsData = campaignsRes?.metadata?.data || []

  // Quản lý tab Campaign hiện tại đang chọn
  const [selectedCampaignId, setSelectedCampaignId] = useState<
    string | undefined
  >(campaignsData[0]?.id)

  // Đồng bộ lại campaign đầu tiên khi danh sách campaignsData thay đổi
  useEffect(() => {
    if (campaignsData.length > 0) {
      setSelectedCampaignId(campaignsData[0].id)
    } else {
      setSelectedCampaignId(undefined)
    }
  }, [campaignsData])

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
        <TabsList className="flex h-auto w-full items-center justify-start gap-3 overflow-x-auto bg-transparent p-1">
          {campaignsData.map((campaign) => (
            <CampaignTrigger
              key={campaign.id}
              campaign={campaign}
              isActive={selectedCampaignId === campaign.id}
            />
          ))}
        </TabsList>

        {/* Nội dung chi tiết của Campaign được chọn */}
        {campaignsData.map((campaign) => (
          <TabsContent key={campaign.id} value={campaign.id}>
            {/* Chỉ render nội dung chi tiết khi tab đó thực sự được active để tối ưu API */}
            {selectedCampaignId === campaign.id && (
              <CampaignContent
                campaignId={campaign.id}
                name={campaign.name}
                desc={campaign.desc}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
