"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useUpdateStoreFrontConfig } from "@/hooks/apis/store-front/use-store-front-config"
import { Button } from "@/components/ui/button"
import { Loader2, Save, X, ImageIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CustomCombobox } from "@/components/ui/custom-combobox"
import { CampaignOption } from "@/shared/interfaces/models/store-front/store-front-config.interface"
import { useFindOptionsCampaigns } from "@/hooks/apis/mkt-program/use-campaign"
import { ICampaign } from "@/shared/interfaces/models/mkt-program/campaign.interface"

interface MarketingProgram06Props {
  idConfig: string
  mktProgram06: { title: string; campaigns: CampaignOption[] } | undefined
}

const maxCampaigns = 4

export function MarketingProgram06({
  idConfig,
  mktProgram06,
}: MarketingProgram06Props) {
  // Lấy danh sách các marketing chương trình có sẵn từ API công khai/options
  const { data } = useFindOptionsCampaigns()
  const optionsCampaigns = data?.metadata?.data || []

  // Hook update API cấu hình giao diện
  const { mutateAsync, isPending } = useUpdateStoreFrontConfig()

  // State lưu trữ tiêu đề và mảng các marketing chương trình đang được chọn
  const [titleValue, setTitleValue] = useState("")
  const [selectedCampaigns, setSelectedCampaigns] = useState<CampaignOption[]>(
    []
  )

  // Đồng bộ state khi dữ liệu ban đầu từ props cha thay đổi (khi fetch ngầm hoàn thành)
  useEffect(() => {
    if (mktProgram06) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitleValue(mktProgram06.title || "")
      if (mktProgram06.campaigns) {
        setSelectedCampaigns(mktProgram06.campaigns)
      }
    }
  }, [mktProgram06])

  // Xử lý khi Combobox thay đổi danh sách ID được chọn
  const handleProgramsChange = (selectedIds: string[]) => {
    const updatedPrograms = selectedIds
      .map((id) => optionsCampaigns.find((p) => p.id === id))
      .filter((p): p is ICampaign => !!p)

    setSelectedCampaigns(updatedPrograms)
  }

  // Hàm xóa nhanh 1 chương trình khỏi danh sách đã chọn
  const handleRemoveCampaign = (idToRemove: string) => {
    setSelectedCampaigns((prev) =>
      prev.filter((campaign) => campaign.id !== idToRemove)
    )
  }

  // Gửi dữ liệu lên server khi bấm Lưu
  async function onSubmit() {
    try {
      const payload = selectedCampaigns.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        mainImage: p.mainImage,
      }))

      await mutateAsync({
        id: idConfig,
        payload: {
          homeConfig: {
            config: {
              marketingProgram06: {
                title: titleValue,
                campaigns: payload,
              },
            },
          },
        },
      })
    } catch (error) {
      console.error("Error updating marketing programs config:", error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Ô nhập tiêu đề của cụm Marketing */}
      <div className="space-y-2">
        <Label htmlFor="mkt-title" className="text-sm font-medium">
          Section Title
        </Label>
        <Input
          id="mkt-title"
          placeholder="e.g., Hot Deals / Flash Sale"
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
        />
      </div>

      {/* Dropdown Chọn Nhiều Marketing Program */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">
          Choose multiple campaigns to display on the homepage. (Max{" "}
          {maxCampaigns})
        </Label>
        <CustomCombobox
          options={optionsCampaigns.map((p) => ({
            value: p.id!,
            label: p.name || "Untitled Campaign",
            image: p.mainImage, // Sử dụng mainImage theo interface ICampaign
          }))}
          value={selectedCampaigns.map((p) => p.id!)}
          onChange={(values) => {
            if (Array.isArray(values)) {
              handleProgramsChange(values)
            }
          }}
          multiple={true}
          maxItems={maxCampaigns}
          placeholder={
            selectedCampaigns.length > 0
              ? `${selectedCampaigns.length} selected`
              : "Choose campaigns..."
          }
          searchPlaceholder="Search campaign names..."
          emptyMessage="No campaigns found."
          // Render item trong danh sách sổ xuống của Combobox
          renderItem={(option) => (
            <div className="flex w-full items-center gap-3 py-0.5 text-left">
              {option.image?.url ? (
                <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded">
                  <Image
                    src={option.image.url}
                    alt={option.label}
                    fill
                    className="object-contain"
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

      {/* Khu vực Xem trước danh sách các chương trình đã chọn (Preview) */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">
          Preview ({selectedCampaigns.length}):
        </Label>

        {selectedCampaigns.length > 0 ? (
          <div className="grid max-h-[calc(100vh-740px)] gap-3 overflow-y-auto pr-1">
            {selectedCampaigns.map((campaign, index) => (
              <div
                key={campaign.id || index}
                className="group bg-card relative flex items-center gap-4 rounded-xl border p-3 shadow-sm transition-all hover:shadow-md"
              >
                <div className="bg-muted text-muted-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                  {index + 1}
                </div>

                {campaign.mainImage?.url ? (
                  <div className="bg-muted relative h-16 w-32 overflow-hidden rounded-lg">
                    <Image
                      fill
                      className="object-contain"
                      src={campaign.mainImage.url}
                      alt={campaign.name || "Campaign preview"}
                    />
                  </div>
                ) : (
                  <div className="bg-muted text-muted-foreground flex h-16 w-32 items-center justify-center rounded-lg border-2 border-dashed text-xs">
                    No image available
                  </div>
                )}

                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <span className="truncate text-sm font-semibold">
                    {campaign.name || "Chưa đặt tên chiến dịch"}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    slug: {campaign.slug || "N/A"}
                  </span>
                </div>

                {/* Nút xóa nhanh khỏi danh sách select */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                  onClick={() => handleRemoveCampaign(campaign.id!)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground bg-muted/50 flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed text-sm">
            No marketing programs selected
          </div>
        )}
      </div>

      {/* Nút hành động */}
      <div className="flex">
        <Button
          onClick={onSubmit}
          disabled={isPending || selectedCampaigns.length === 0}
          className="ml-auto"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
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
