"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFindOptionsMktPrograms } from "@/hooks/apis/mkt-program/use-mkt-program"
import Image from "next/image"
import { CampaignTabs } from "./campaign-tabs" // Import component vừa tách

export function OnlinePromotion() {
  // Lấy danh sách Marketing Programs
  const { data: mktData } = useFindOptionsMktPrograms()
  const mktProgramsData = mktData?.metadata?.data || []

  // State lưu ID của Marketing Program đang chọn
  const [selectedMktId, setSelectedMktId] = useState<string | undefined>(
    mktProgramsData[0]?.id
  )

  // Đồng bộ hóa khi data từ API đổ về
  useEffect(() => {
    if (mktProgramsData.length > 0 && !selectedMktId) {
      setSelectedMktId(mktProgramsData[0].id)
    }
  }, [mktProgramsData, selectedMktId])

  if (mktProgramsData.length === 0) return null

  return (
    <div className="space-y-4 rounded-4xl border-2 border-sky-700 bg-white p-4 px-6">
      <h2 className="text-xl font-bold text-sky-900">Khuyến mãi online</h2>

      <div>
        <Tabs value={selectedMktId} onValueChange={setSelectedMktId}>
          {/* Tab lớn: Các chương trình Marketing */}
          <TabsList variant="line" className="justify-start gap-4 border-b">
            {mktProgramsData.map((mp) => (
              <TabsTrigger key={mp.id} value={mp.id} className="pb-2">
                {mp.mainImage ? (
                  <div className="relative h-[35px] w-[62px]">
                    <Image
                      src={mp.mainImage.url}
                      alt={mp.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <span className="font-medium">{mp.name}</span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Nội dung bên trong từng Chương trình Marketing */}
          {mktProgramsData.map((mp) => (
            <TabsContent key={mp.id} value={mp.id}>
              {/* Chỉ truyền mktId vào component con khi tab này đang active */}
              {selectedMktId === mp.id && <CampaignTabs mktId={mp.id} />}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
