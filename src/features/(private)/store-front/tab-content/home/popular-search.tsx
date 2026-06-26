"use client"

import { useState, useEffect } from "react"
import { useUpdateStoreFrontConfig } from "@/hooks/apis/store-front/use-store-front-config"
import { Button } from "@/components/ui/button"
import { Loader2, Save, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CustomCombobox } from "@/components/ui/custom-combobox"
import { useFindOptionsPopularSearches } from "@/hooks/apis/store-front/use-popular-search"
import { PopularSearchOption } from "@/shared/interfaces/models/store-front/store-front-config.interface"
import { IPopularSearch } from "@/shared/interfaces/models/store-front/popular-search.interface"

interface PopularSearchProps {
  idConfig: string
  popularSearch: { title: string; searches: PopularSearchOption[] } | undefined
}

export function PopularSearch({ idConfig, popularSearch }: PopularSearchProps) {
  // Lấy danh sách các marketing chương trình có sẵn từ API công khai/options
  const { data } = useFindOptionsPopularSearches()
  const optionsPopularSearches = data?.metadata?.data || []

  // Hook update API cấu hình giao diện
  const { mutateAsync, isPending } = useUpdateStoreFrontConfig()

  // State lưu trữ tiêu đề và mảng các marketing chương trình đang được chọn
  const [titleValue, setTitleValue] = useState("")
  const [selectedSearches, setSelectedSearches] = useState<
    PopularSearchOption[]
  >([])

  // Đồng bộ state khi dữ liệu ban đầu từ props cha thay đổi (khi fetch ngầm hoàn thành)
  useEffect(() => {
    if (popularSearch) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitleValue(popularSearch.title || "")
      if (popularSearch.searches) {
        setSelectedSearches(popularSearch.searches)
      }
    }
  }, [popularSearch])

  // Xử lý khi Combobox thay đổi danh sách ID được chọn
  const handleProgramsChange = (selectedIds: string[]) => {
    const updatedPrograms = selectedIds
      .map((id) => optionsPopularSearches.find((p) => p.id === id))
      .filter((p): p is IPopularSearch => !!p)

    setSelectedSearches(updatedPrograms)
  }

  // Hàm xóa nhanh 1 chương trình khỏi danh sách đã chọn
  const handleRemoveSearch = (idToRemove: string) => {
    setSelectedSearches((prev) =>
      prev.filter((search) => search.id !== idToRemove)
    )
  }

  // Gửi dữ liệu lên server khi bấm Lưu
  async function onSubmit() {
    try {
      const payload = selectedSearches.map((p) => ({
        id: p.id,
        text: p.text,
      }))

      await mutateAsync({
        id: idConfig,
        payload: {
          homeConfig: {
            config: {
              popularSearch: {
                title: titleValue,
                searches: payload,
              },
            },
          },
        },
      })
    } catch (error) {
      console.error("Error updating popular searches config:", error)
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
          Choose multiple popular searches to display on the homepage.
        </Label>
        <CustomCombobox
          options={optionsPopularSearches.map((p) => ({
            value: p.id!,
            label: p.text || "Untitled Search",
          }))}
          value={selectedSearches.map((p) => p.id!)}
          onChange={(values) => {
            if (Array.isArray(values)) {
              handleProgramsChange(values)
            }
          }}
          multiple={true}
          placeholder={
            selectedSearches.length > 0
              ? `${selectedSearches.length} selected`
              : "Choose searches..."
          }
          searchPlaceholder="Search searches..."
          emptyMessage="No searches found."
          // Render item trong danh sách sổ xuống của Combobox
          renderItem={(option) => (
            <div className="flex w-full items-center gap-3 py-0.5 text-left">
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
          Preview ({selectedSearches.length}):
        </Label>

        {selectedSearches.length > 0 ? (
          <div className="grid max-h-[calc(100vh-800px)] gap-3 overflow-y-auto pr-1">
            {selectedSearches.map((search, index) => (
              <div
                key={search.id || index}
                className="group bg-card relative flex items-center gap-4 rounded-xl border p-3 shadow-sm transition-all hover:shadow-md"
              >
                <div className="bg-muted text-muted-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                  {index + 1}
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <span className="truncate text-sm font-semibold">
                    {search.text || "Chưa đặt tên tìm kiếm"}
                  </span>
                </div>

                {/* Nút xóa nhanh khỏi danh sách select */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                  onClick={() => handleRemoveSearch(search.id!)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground bg-muted/50 flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed text-sm">
            No searches selected
          </div>
        )}
      </div>

      {/* Nút hành động */}
      <div className="flex">
        <Button
          onClick={onSubmit}
          disabled={isPending || selectedSearches.length === 0}
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
