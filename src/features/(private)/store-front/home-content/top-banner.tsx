"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ITopBanner } from "@/shared/interfaces/models/store-front/top-banner.interface"
import { useUpdateStoreFrontConfig } from "@/hooks/apis/store-front/use-store-front-config"
import { useFindOptionsTopBanners } from "@/hooks/apis/store-front/use-top-banner"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import { Label } from "@/components/ui/label"
import { TopBannerOption } from "@/shared/interfaces/models/store-front/store-front-config.interface"

interface TopBannerProps {
  idConfig: string
  topBanner: TopBannerOption | null
}

export function TopBanner({ idConfig, topBanner }: TopBannerProps) {
  // Lấy danh sách các banner có sẵn để chọn
  const { data, isLoading: isLoadingOptions } = useFindOptionsTopBanners({})
  const optionsTopBanners = data?.metadata?.data || []

  // Hook update API
  const { mutateAsync, isPending } = useUpdateStoreFrontConfig()

  // State lưu trữ banner đang được CHỌN trên giao diện (local state)
  const [selectedBanner, setSelectedBanner] = useState<TopBannerOption | null>(
    topBanner
  )

  // Đồng bộ state nếu dữ liệu truyền từ props cha thay đổi
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedBanner(topBanner)
  }, [topBanner])

  // Xử lý khi người dùng chọn một banner khác từ dropdown
  const handleSelectBanner = (bannerId: string) => {
    const found = optionsTopBanners.find((b) => b.id === bannerId)
    if (found) {
      setSelectedBanner(found)
    }
  }

  // Gửi dữ liệu lên server khi bấm Lưu
  async function onSubmit() {
    if (!selectedBanner) return

    try {
      const payload = {
        id: selectedBanner.id,
        slug: selectedBanner.slug,
        title: selectedBanner.title,
        image: selectedBanner.image,
      }

      await mutateAsync({
        id: idConfig,
        payload: {
          homeConfig: { config: { topBanner: payload } },
        },
      })
    } catch (error) {
      console.error("Error updating top banner:", error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Dropdown Chọn Banner (Shadcn/ui Select) */}
      <div className="space-y-4">
        <Label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Choose a banner at the top of the page.:
        </Label>
        <Select
          value={selectedBanner?.id}
          onValueChange={handleSelectBanner}
          disabled={isLoadingOptions}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                isLoadingOptions ? "Loading options..." : "Select a banner..."
              }
            />
          </SelectTrigger>
          <SelectContent>
            {optionsTopBanners.map((banner) => (
              <SelectItem key={banner.id} value={banner.id!}>
                {banner.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Khu vực Xem trước Banner (Preview) */}
      <div className="space-y-4">
        <Label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Preview:
        </Label>
        {selectedBanner?.image?.url ? (
          <div className="bg-muted relative flex h-12 w-full items-center justify-center overflow-hidden rounded-lg">
            <Image
              fill
              priority
              className="object-cover"
              src={selectedBanner.image.url}
              alt={selectedBanner.title || "Banner preview"}
            />
          </div>
        ) : (
          <div className="text-muted-foreground bg-muted/50 flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed text-sm">
            No banner selected
          </div>
        )}
      </div>

      {/* Nút hành động */}
      <div className="flex">
        <Button
          onClick={onSubmit}
          disabled={isPending || !selectedBanner}
          className="ml-auto"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
