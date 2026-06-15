"use client"

import { useFindOptionsPromotions } from "@/hooks/apis/mkt-program/use-promotion"
import { ICampaign } from "@/shared/interfaces/models/mkt-program/campaign.interface"
import { PromotionContent } from "./promotion-content"
import Image from "next/image"

export function CampaignContent({ campaign }: { campaign: ICampaign }) {
  const { id: campaignId, name, desc, mainImage } = campaign

  // Fetch danh sách các promotions thuộc Campaign
  const { data: promotionsRes, isLoading } = useFindOptionsPromotions({
    filters: { campaign: campaignId },
  })
  const promotions = promotionsRes?.metadata?.data || []

  // Trạng thái Loading với Skeleton bám sát cấu trúc UI mới
  if (isLoading) {
    return (
      <div className="mt-4 space-y-6">
        {/* Skeleton Header */}
        <div className="space-y-2 border-b pb-2">
          <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-96 animate-pulse rounded bg-gray-100" />
        </div>
        {/* Skeleton Khối Promotion cụm */}
        <div className="space-y-4 rounded-2xl border border-gray-100 p-4">
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-6">
      {/* Header chiến dịch */}
      <div className="border-b pb-3">
        <div className="flex items-center">
          {mainImage?.url && (
            <div className="h-6 w-12 overflow-hidden">
              <Image
                width={48}
                height={24}
                alt={name}
                src={mainImage.url}
                className="h-full w-full object-contain"
              />
            </div>
          )}
          <h3 className="text-xl font-bold text-sky-900">{name}</h3>
        </div>
        {desc && <p className="mt-1 text-sm text-gray-500">{desc}</p>}
      </div>

      {/* Danh sách các cụm chương trình khuyến mãi */}
      {promotions.length === 0 ? (
        <p className="py-4 text-sm text-gray-400 italic">
          Chưa có chương trình ưu đãi nào diễn ra trong chiến dịch này.
        </p>
      ) : (
        <div className="space-y-6">
          {promotions.map((promo) => (
            <PromotionContent key={promo.id} promotion={promo} />
          ))}
        </div>
      )}
    </div>
  )
}
