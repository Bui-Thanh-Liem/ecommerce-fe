"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useUpdateStoreFrontConfig } from "@/hooks/apis/store-front/use-store-front-config"
import { Button } from "@/components/ui/button"
import { Loader2, Save, X, ImageIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useFindOptionsMainBanners } from "@/hooks/apis/store-front/use-main-banner"
import { CustomCombobox } from "@/components/ui/custom-combobox"
import { MainBannerOption } from "@/shared/interfaces/models/store-front/store-front-config.interface"

interface MainBannerProps {
  idConfig: string
  mainBanner: MainBannerOption[] | undefined
}

export function MainBanner({ idConfig, mainBanner }: MainBannerProps) {
  // Lấy danh sách các banner có sẵn từ API
  const { data } = useFindOptionsMainBanners()
  const optionsMainBanners = data?.metadata?.data || []

  // Hook update API
  const { mutateAsync, isPending } = useUpdateStoreFrontConfig()

  // State lưu trữ mảng các banner đang được CHỌN
  const [selectedBanners, setSelectedBanners] = useState<MainBannerOption[]>([])

  // Đồng bộ state khi dữ liệu ban đầu từ props cha thay đổi
  useEffect(() => {
    if (mainBanner) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedBanners(mainBanner)
    }
  }, [mainBanner])

  // Xử lý khi Combobox thay đổi danh sách ID được chọn
  const handleBannersChange = (selectedIds: string[]) => {
    // Lọc và giữ lại các banner object dựa trên mảng IDs mới từ Combobox
    const updatedBanners = selectedIds
      .map((id) => optionsMainBanners.find((b) => b.id === id))
      .filter((b) => !!b) // Loại bỏ các giá trị undefined nếu có

    setSelectedBanners(updatedBanners)
  }

  // Hàm xóa nhanh 1 banner khỏi danh sách đã chọn
  const handleRemoveBanner = (idToRemove: string) => {
    setSelectedBanners((prev) =>
      prev.filter((banner) => banner.id !== idToRemove)
    )
  }

  // Gửi dữ liệu lên server khi bấm Lưu
  async function onSubmit() {
    try {
      //
      const payload = selectedBanners.map((b) => ({
        id: b.id,
        slug: b.slug,
        title: b.title,
        image: b.image,
      }))

      await mutateAsync({
        id: idConfig,
        payload: {
          homeConfig: { config: { mainBanner: payload } },
        },
      })
    } catch (error) {
      console.error("Error update main banner:", error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Dropdown Chọn Nhiều Banner */}
      <div className="space-y-4">
        <Label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Choose multiple banners to display on the homepage. (Max 5)
        </Label>
        <CustomCombobox
          options={optionsMainBanners.map((b) => ({
            value: b.id!,
            label: b.title || "Untitled Banner",
            image: b.image,
          }))}
          value={selectedBanners.map((b) => b.id!)}
          onChange={(values) => {
            if (Array.isArray(values)) {
              handleBannersChange(values)
            }
          }}
          multiple={true}
          maxItems={5}
          placeholder={
            selectedBanners.length > 0
              ? `${selectedBanners.length} selected`
              : "Choose banners..."
          }
          searchPlaceholder="Search banner names..."
          emptyMessage="No banners found."
          // Render item trong danh sách sổ xuống của Combobox
          renderItem={(option) => (
            <div className="flex w-full items-center gap-3 py-0.5 text-left">
              {option.image?.url ? (
                <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded border">
                  <Image
                    src={option.image.url}
                    alt={option.label}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="bg-muted flex h-10 w-16 shrink-0 items-center justify-center rounded border">
                  <ImageIcon className="text-muted-foreground h-4 w-4" />
                </div>
              )}
              <span className="truncate text-sm font-medium">
                {option.label}
              </span>
            </div>
          )}
          // Render tag hiển thị các item đã chọn trong khung input
          renderSelected={(option) => (
            <div className="flex items-center gap-1 text-xs font-normal">
              <span className="max-w-25 truncate">{option.label}</span>
            </div>
          )}
        />
      </div>

      {/* Khu vực Xem trước danh sách Banner (Preview) */}
      <div className="max-h-[calc(100vh-580px)] space-y-4 overflow-y-auto">
        <Label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Preview ({selectedBanners.length}):
        </Label>

        {selectedBanners.length > 0 ? (
          <div className="grid gap-3">
            {selectedBanners.map((banner, index) => (
              <div
                key={banner.id || index}
                className="group bg-card relative flex items-center gap-4 rounded-xl border p-3 shadow-sm transition-all hover:shadow-md"
              >
                <div className="bg-muted text-muted-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                  {index + 1}
                </div>

                {banner.image?.url ? (
                  <div className="bg-muted relative h-16 w-32 overflow-hidden rounded-lg border">
                    <Image
                      fill
                      className="object-cover"
                      src={banner.image.url}
                      alt={banner.title || "Main banner preview"}
                    />
                  </div>
                ) : (
                  <div className="bg-muted text-muted-foreground flex h-16 w-32 items-center justify-center rounded-lg border-2 border-dashed text-xs">
                    No image available
                  </div>
                )}

                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <span className="truncate text-sm font-semibold">
                    {banner.title || "Chưa đặt tiêu đề"}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    Slug: {banner.slug}
                  </span>
                </div>

                {/* Nút xóa nhanh banner khỏi danh sách select */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                  onClick={() => handleRemoveBanner(banner.id!)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground bg-muted/50 flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed text-sm">
            No banners selected
          </div>
        )}
      </div>

      {/* Nút hành động */}
      <div className="flex">
        <Button
          onClick={onSubmit}
          disabled={isPending || selectedBanners.length === 0}
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
