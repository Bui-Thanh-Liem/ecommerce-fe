"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useUpdateStoreFrontConfig } from "@/hooks/apis/store-front/use-store-front-config"
import { Button } from "@/components/ui/button"
import { Loader2, Save, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { CustomCombobox } from "@/components/ui/custom-combobox"
import { useFindOptionsMenus } from "@/hooks/apis/store-front/use-menu"
import { MenuOption } from "@/shared/interfaces/models/store-front/store-front-config.interface"

interface MenuProps {
  idConfig: string
  menu: MenuOption[] | undefined
}

export function Menu({ idConfig, menu }: MenuProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMenus, setSelectedMenus] = useState<MenuOption[]>([])

  // Tạo bộ nhớ đệm để lưu lại tất cả các menu đã từng xuất hiện hoặc đã chọn
  const [menuCache, setMenuCache] = useState<Record<string, MenuOption>>({})

  // Gọi API lấy danh sách menu theo search term
  const { data, isLoading } = useFindOptionsMenus({
    filters: { name: searchTerm },
    page: 1,
    limit: 50,
  })
  const optionsMenus = data?.metadata?.data || []

  // Đồng bộ menu từ props vào selectedMenus khi lần đầu load trang
  useEffect(() => {
    if (menu) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedMenus(menu)

      // Đưa luôn các menu mặc định này vào cache
      setMenuCache((prev) => {
        const nextCache = { ...prev }
        menu.forEach((item) => {
          if (item.categorySlug) nextCache[item.categorySlug] = item
        })
        return nextCache
      })
    }
  }, [menu])

  // Mỗi khi API trả về data mới, gộp chúng vào cache để không bị mất khi tìm kiếm từ khóa khác
  useEffect(() => {
    if (optionsMenus.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMenuCache((prev) => {
        const nextCache = { ...prev }
        optionsMenus.forEach((item) => {
          if (item.categorySlug) nextCache[item.categorySlug] = item
        })
        return nextCache
      })
    }
  }, [optionsMenus])

  // Chuyển đổi cache thành mảng options truyền cho Combobox (giúp hiển thị đủ Badge)
  const comboboxOptions = useMemo(() => {
    return Object.values(menuCache).map((b) => ({
      value: b.categorySlug!,
      label: b.name || "Unnamed menu",
    }))
  }, [menuCache])

  // Xử lý Debounce cho ô tìm kiếm
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const handleSearchChange = (text: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setSearchTerm(text)
    }, 400)
  }

  // Dọn dẹp timeout khi unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Cập nhật danh sách khi chọn/bỏ chọn trên Combobox
  const handleMenusChange = (selectedSlugs: string[]) => {
    const updatedMenus = selectedSlugs
      .map((slug) => menuCache[slug]) // Tìm trực tiếp trong cache bằng slug (chính xác 100%)
      .filter((b): b is MenuOption => !!b)

    setSelectedMenus(updatedMenus)
  }

  // Nút xóa nhanh ở phần Preview
  const handleRemoveMenu = (slugToRemove: string) => {
    setSelectedMenus((prev) =>
      prev.filter((item) => item.categorySlug !== slugToRemove)
    )
  }

  const { mutateAsync, isPending } = useUpdateStoreFrontConfig()

  async function onSubmit() {
    try {
      const payload = selectedMenus.map((b) => ({
        id: b.id,
        name: b.name,
        categorySlug: b.categorySlug,
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
          options={comboboxOptions} // Sử dụng danh sách đã được gộp từ cache
          value={selectedMenus.map((b) => b.categorySlug!)}
          onChange={(values) => {
            if (Array.isArray(values)) {
              handleMenusChange(values)
            }
          }}
          multiple={true}
          maxItems={10}
          isLoading={isLoading}
          placeholder={
            selectedMenus.length > 0
              ? `${selectedMenus.length} selected`
              : "Choose menus..."
          }
          searchPlaceholder="Search menu names..."
          emptyMessage="No menus found."
          onSearchChange={handleSearchChange}
          renderItem={(option) => (
            <div className="flex w-full items-center gap-3 py-0.5 text-left">
              <span className="truncate text-sm font-medium">
                {option.label}
              </span>
            </div>
          )}
          renderSelected={(option) => (
            <div className="flex items-center gap-1 text-xs font-normal">
              <span className="max-w-25 truncate">{option.label}</span>
            </div>
          )}
        />
      </div>

      {/* Khu vực Xem trước danh sách Menu (Preview) */}
      <div className="max-h-[calc(100vh-620px)] space-y-4 overflow-y-auto pr-1">
        <Label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Preview ({selectedMenus.length}):
        </Label>

        {selectedMenus.length > 0 ? (
          <div className="grid gap-3">
            {selectedMenus.map((menuItem, index) => (
              <div
                key={menuItem.id || menuItem.categorySlug || index}
                className="group bg-card relative flex items-center gap-4 rounded-xl border p-3 shadow-sm transition-all hover:shadow-md"
              >
                <div className="bg-muted text-muted-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                  {index + 1}
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <span className="truncate text-sm font-semibold">
                    {menuItem.name || "Unnamed menu"}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    Category slug: {menuItem.categorySlug}
                  </span>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                  onClick={() => handleRemoveMenu(menuItem.categorySlug!)}
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
