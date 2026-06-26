"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useUpdateStoreFrontConfig } from "@/hooks/apis/store-front/use-store-front-config"
import { Button } from "@/components/ui/button"
import { Loader2, Save, X, ImageIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { CustomCombobox } from "@/components/ui/custom-combobox"
import { useFindOptionsCategories } from "@/hooks/apis/catalog/use-category"
import { CategoryOption } from "@/shared/interfaces/models/store-front/store-front-config.interface"

interface ListCategoriesProps {
  idConfig: string
  listCategories: CategoryOption[] | undefined
}

const maxCategoriesToShow = 15

export function ListCategories({
  idConfig,
  listCategories,
}: ListCategoriesProps) {
  // Lấy danh sách các category có sẵn từ API
  const { data } = useFindOptionsCategories()
  const optionsCategories = data?.metadata?.data || []

  // Hook update API
  const { mutateAsync, isPending } = useUpdateStoreFrontConfig()

  // State lưu trữ mảng các category đang được CHỌN
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryOption[]
  >([])

  // Đồng bộ state khi dữ liệu ban đầu từ props cha thay đổi
  useEffect(() => {
    if (listCategories) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCategories(listCategories)
    }
  }, [listCategories])

  // Xử lý khi Combobox thay đổi danh sách ID được chọn
  const handleCategoriesChange = (selectedIds: string[]) => {
    // Lọc và giữ lại các category object dựa trên mảng IDs mới từ Combobox
    const updatedCategories = selectedIds
      .map((id) => optionsCategories.find((c) => c.id === id))
      .filter((c) => !!c)

    setSelectedCategories(updatedCategories)
  }

  // Hàm xóa nhanh 1 category khỏi danh sách đã chọn
  const handleRemoveCategory = (idToRemove: string) => {
    setSelectedCategories((prev) =>
      prev.filter((category) => category.id !== idToRemove)
    )
  }

  // Gửi dữ liệu lên server khi bấm Lưu
  async function onSubmit() {
    try {
      //
      const payload = selectedCategories.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        image: c.image!,
        minPrice: c.minPrice,
      }))

      await mutateAsync({
        id: idConfig,
        payload: {
          homeConfig: { config: { listCategories: payload } },
        },
      })
    } catch (error) {
      console.error("Error update list categories:", error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Dropdown Chọn Nhiều Category */}
      <div className="space-y-4">
        <Label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Choose multiple categories to display on the homepage. (Max{" "}
          {maxCategoriesToShow})
        </Label>
        <CustomCombobox
          options={optionsCategories.map((c) => ({
            value: c.id!,
            label: c.name || "Untitled Category",
            image: c.image,
          }))}
          value={selectedCategories.map((c) => c.id!)}
          onChange={(values) => {
            if (Array.isArray(values)) {
              handleCategoriesChange(values)
            }
          }}
          multiple={true}
          maxItems={maxCategoriesToShow}
          placeholder={
            selectedCategories.length > 0
              ? `${selectedCategories.length} selected`
              : "Choose categories..."
          }
          searchPlaceholder="Search category names..."
          emptyMessage="No categories found."
          // Render item trong danh sách sổ xuống của Combobox
          renderItem={(option) => (
            <div className="flex w-full items-center gap-3 py-0.5 text-left">
              {option.image?.url ? (
                <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded">
                  <Image
                    fill
                    src={option.image.url}
                    alt={option.label}
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

      {/* Khu vực Xem trước danh sách Category (Preview) */}
      <div className="max-h-[calc(100vh-620px)] space-y-4 overflow-y-auto">
        <Label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Preview ({selectedCategories.length}):
        </Label>

        {selectedCategories.length > 0 ? (
          <div className="grid gap-3">
            {selectedCategories.map((category, index) => (
              <div
                key={category.id || index}
                className="group bg-card relative flex items-center gap-4 rounded-xl border p-3 shadow-sm transition-all hover:shadow-md"
              >
                <div className="bg-muted text-muted-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                  {index + 1}
                </div>

                {category.image?.url ? (
                  <div className="bg-muted relative h-16 w-32 overflow-hidden rounded-lg">
                    <Image
                      fill
                      className="object-contain"
                      src={category.image.url}
                      alt={category.name || "Category preview"}
                    />
                  </div>
                ) : (
                  <div className="bg-muted text-muted-foreground flex h-16 w-32 items-center justify-center rounded-lg border-2 border-dashed text-xs">
                    No image available
                  </div>
                )}

                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <span className="truncate text-sm font-semibold">
                    {category.name || "Chưa đặt tên"}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    slug: {category.slug || "N/A"}
                  </span>
                </div>

                {/* Nút xóa nhanh category khỏi danh sách select */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                  onClick={() => handleRemoveCategory(category.id!)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground bg-muted/50 flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed text-sm">
            No categories selected
          </div>
        )}
      </div>

      {/* Nút hành động */}
      <div className="flex">
        <Button
          onClick={onSubmit}
          disabled={isPending || selectedCategories.length === 0}
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
