"use client"

import { useState, useEffect } from "react"
import { useUpdateStoreFrontConfig } from "@/hooks/apis/store-front/use-store-front-config"
import { Button } from "@/components/ui/button"
import { Loader2, Save, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { CustomCombobox } from "@/components/ui/custom-combobox"
import { IMenu } from "@/shared/interfaces/models/store-front/menu.interface"
import { useFindOptionsMenus } from "@/hooks/apis/store-front/use-menu"
import { MenuOption } from "@/shared/interfaces/models/store-front/store-front-config.interface"

interface MenuProps {
  idConfig: string
  menu: MenuOption[] | undefined
}

export function Menu({ idConfig, menu }: MenuProps) {
  // Lấy danh sách các menu có sẵn từ API
  const { data } = useFindOptionsMenus()
  const optionsMenus = data?.metadata?.data || []

  // Hook update API
  const { mutateAsync, isPending } = useUpdateStoreFrontConfig()

  // State lưu trữ mảng các menu đang được CHỌN
  const [selectedMenus, setSelectedMenus] = useState<MenuOption[]>([])

  // Đồng bộ state khi dữ liệu ban đầu từ props cha thay đổi
  useEffect(() => {
    if (menu) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedMenus(menu)
    }
  }, [menu])

  // Xử lý khi Combobox thay đổi danh sách ID được chọn
  const handleMenusChange = (selectedIds: string[]) => {
    // Lọc và giữ lại các menu object dựa trên mảng IDs mới từ Combobox
    const updatedMenus = selectedIds
      .map((id) => optionsMenus.find((b) => b.id === id))
      .filter((b): b is IMenu => !!b) // Loại bỏ các giá trị undefined nếu có

    setSelectedMenus(updatedMenus)
  }

  // Hàm xóa nhanh 1 menu khỏi danh sách đã chọn
  const handleRemoveMenu = (idToRemove: string) => {
    setSelectedMenus((prev) => prev.filter((menu) => menu.id !== idToRemove))
  }

  // Gửi dữ liệu lên server khi bấm Lưu
  async function onSubmit() {
    try {
      //
      const payload = selectedMenus.map((b) => ({
        id: b.id,
        name: b.name,
        category: b.category,
      }))

      await mutateAsync({
        id: idConfig,
        payload: {
          homeConfig: { config: { menu: payload } },
        },
      })
    } catch (error) {
      console.error("Error update menu:", error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Dropdown Chọn Nhiều Menu */}
      <div className="space-y-4">
        <Label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Choose multiple menus to display on the homepage. (Max 10)
        </Label>
        <CustomCombobox
          options={optionsMenus.map((b) => ({
            value: b.id!,
            label: b.name || "Unnamed menu",
          }))}
          value={selectedMenus.map((b) => b.id!)}
          onChange={(values) => {
            if (Array.isArray(values)) {
              handleMenusChange(values)
            }
          }}
          multiple={true}
          maxItems={10}
          placeholder={
            selectedMenus.length > 0
              ? `${selectedMenus.length} selected`
              : "Choose menus..."
          }
          searchPlaceholder="Search menu names..."
          emptyMessage="No menus found."
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

      {/* Khu vực Xem trước danh sách Menu (Preview) */}
      <div className="max-h-[calc(100vh-620px)] space-y-4 overflow-y-auto">
        <Label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Preview ({selectedMenus.length}):
        </Label>

        {selectedMenus.length > 0 ? (
          <div className="grid gap-3">
            {selectedMenus.map((menu, index) => (
              <div
                key={menu.id || index}
                className="group bg-card relative flex items-center gap-4 rounded-xl border p-3 shadow-sm transition-all hover:shadow-md"
              >
                <div className="bg-muted text-muted-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                  {index + 1}
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <span className="truncate text-sm font-semibold">
                    {menu.name || "Unnamed menu"}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    Category: {menu.category?.name}
                  </span>
                </div>

                {/* Nút xóa nhanh menu khỏi danh sách select */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                  onClick={() => handleRemoveMenu(menu.id!)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground bg-muted/50 flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed text-sm">
            No menus selected
          </div>
        )}
      </div>

      {/* Nút hành động */}
      <div className="flex">
        <Button
          onClick={onSubmit}
          disabled={isPending || selectedMenus.length === 0}
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
