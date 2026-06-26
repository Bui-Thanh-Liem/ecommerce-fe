"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useUpdateStoreFrontConfig } from "@/hooks/apis/store-front/use-store-front-config"
import { Button } from "@/components/ui/button"
import { Loader2, Save, X, ImageIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CustomCombobox } from "@/components/ui/custom-combobox"
import { IMarketingProgram } from "@/shared/interfaces/models/mkt-program/marketing-program.interface"
import { useFindOptionsMktPrograms } from "@/hooks/apis/mkt-program/use-mkt-program"
import { MktProgramOption } from "@/shared/interfaces/models/store-front/store-front-config.interface"

interface MarketingProgram03Props {
  idConfig: string
  mktProgram03: { title: string; mktPrograms: MktProgramOption[] } | undefined
}

const maxMktPrograms = 15

export function MarketingProgram03({
  idConfig,
  mktProgram03,
}: MarketingProgram03Props) {
  // Lấy danh sách các marketing chương trình có sẵn từ API công khai/options
  const { data } = useFindOptionsMktPrograms()
  const optionsMktPrograms = data?.metadata?.data || []

  // Hook update API cấu hình giao diện
  const { mutateAsync, isPending } = useUpdateStoreFrontConfig()

  // State lưu trữ tiêu đề và mảng các marketing chương trình đang được chọn
  const [titleValue, setTitleValue] = useState("")
  const [selectedMktPrograms, setSelectedMktPrograms] = useState<
    MktProgramOption[]
  >([])

  // Đồng bộ state khi dữ liệu ban đầu từ props cha thay đổi (khi fetch ngầm hoàn thành)
  useEffect(() => {
    if (mktProgram03) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitleValue(mktProgram03.title || "")
      if (mktProgram03.mktPrograms) {
        setSelectedMktPrograms(mktProgram03.mktPrograms)
      }
    }
  }, [mktProgram03])

  // Xử lý khi Combobox thay đổi danh sách ID được chọn
  const handleProgramsChange = (selectedIds: string[]) => {
    const updatedPrograms = selectedIds
      .map((id) => optionsMktPrograms.find((p) => p.id === id))
      .filter((p): p is IMarketingProgram => !!p)

    setSelectedMktPrograms(updatedPrograms)
  }

  // Hàm xóa nhanh 1 chương trình khỏi danh sách đã chọn
  const handleRemoveMktProgram = (idToRemove: string) => {
    setSelectedMktPrograms((prev) =>
      prev.filter((program) => program.id !== idToRemove)
    )
  }

  // Gửi dữ liệu lên server khi bấm Lưu
  async function onSubmit() {
    try {
      const payload = selectedMktPrograms.map((p) => ({
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
              marketingProgram03: {
                title: titleValue,
                mktPrograms: payload,
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
          Choose multiple marketing programs to display on the homepage. (Max{" "}
          {maxMktPrograms})
        </Label>
        <CustomCombobox
          options={optionsMktPrograms.map((p) => ({
            value: p.id!,
            label: p.name || "Untitled Program",
            image: p.mainImage, // Sử dụng mainImage theo interface IMarketingProgram
          }))}
          value={selectedMktPrograms.map((p) => p.id!)}
          onChange={(values) => {
            if (Array.isArray(values)) {
              handleProgramsChange(values)
            }
          }}
          multiple={true}
          maxItems={maxMktPrograms}
          placeholder={
            selectedMktPrograms.length > 0
              ? `${selectedMktPrograms.length} selected`
              : "Choose marketing programs..."
          }
          searchPlaceholder="Search program names..."
          emptyMessage="No marketing programs found."
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
          Preview ({selectedMktPrograms.length}):
        </Label>

        {selectedMktPrograms.length > 0 ? (
          <div className="grid max-h-[calc(100vh-740px)] gap-3 overflow-y-auto pr-1">
            {selectedMktPrograms.map((program, index) => (
              <div
                key={program.id || index}
                className="group bg-card relative flex items-center gap-4 rounded-xl border p-3 shadow-sm transition-all hover:shadow-md"
              >
                <div className="bg-muted text-muted-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                  {index + 1}
                </div>

                {program.mainImage?.url ? (
                  <div className="bg-muted relative h-16 w-32 overflow-hidden rounded-lg">
                    <Image
                      fill
                      className="object-contain"
                      src={program.mainImage.url}
                      alt={program.name || "Marketing program preview"}
                    />
                  </div>
                ) : (
                  <div className="bg-muted text-muted-foreground flex h-16 w-32 items-center justify-center rounded-lg border-2 border-dashed text-xs">
                    No image available
                  </div>
                )}

                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <span className="truncate text-sm font-semibold">
                    {program.name || "Chưa đặt tên chương trình"}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    slug: {program.slug || "N/A"}
                  </span>
                </div>

                {/* Nút xóa nhanh khỏi danh sách select */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                  onClick={() => handleRemoveMktProgram(program.id!)}
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
          disabled={isPending || selectedMktPrograms.length === 0}
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
