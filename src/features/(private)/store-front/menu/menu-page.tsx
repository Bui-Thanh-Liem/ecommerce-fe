"use client"

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Active } from "@/components/active"
import { IMenu } from "@/shared/interfaces/models/store-front/menu.interface"
import {
  useDeleteMenu,
  useFindAllMenus,
  useUpdateMenu,
} from "@/hooks/apis/store-front/use-menu"
import { useState } from "react"
import { DataCard } from "@/components/data-card"
import { MenuAction } from "./menu-action"
import { cn } from "@/lib/utils"

// Component xử lý đổi trạng thái Active/Inactive cho Menu
const ChangeActiveStatus = ({ menu }: { menu: IMenu }) => {
  const { mutate } = useUpdateMenu()

  function toggleActiveStatus() {
    mutate({
      id: menu.id,
      payload: {
        isActive: !menu.isActive,
      },
    })
  }

  return (
    <span
      className="cursor-pointer rounded-2xl bg-white"
      onClick={toggleActiveStatus}
    >
      <Active isActive={menu.isActive} />
    </span>
  )
}

// Component hiển thị cấu trúc Thẻ của từng Menu
function MenuCard({
  menu,
  onEdit,
  onDelete,
  isPending,
}: {
  menu: IMenu
  onEdit?: (menu: IMenu) => void
  onDelete?: (menu: IMenu) => void
  isPending?: boolean
}) {
  return (
    <Card className="group">
      <CardHeader>
        <CardAction className="space-x-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onEdit?.(menu)}
          >
            <Pencil />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="text-destructive"
            onClick={() => onDelete?.(menu)}
          >
            <Trash />
          </Button>
        </CardAction>
        <CardTitle>{menu.name}</CardTitle>
        <CardDescription className="flex items-center gap-x-2">
          <strong>Category slug</strong>: /{menu.categorySlug}
        </CardDescription>
        <ChangeActiveStatus menu={menu} />
      </CardHeader>

      <div className={cn("absolute inset-0 hidden", isPending && "flex")}>
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <span className="font-medium text-amber-700">Processing...</span>
        </div>
      </div>
    </Card>
  )
}

export function MenuPage() {
  const { mutateAsync, isPending } = useDeleteMenu()
  const { data } = useFindAllMenus()
  const metadataMenus = data?.metadata

  // State quản lý việc đóng mở Dialog và dữ liệu chỉnh sửa
  const [open, setOpen] = useState(false)
  const [dataEdit, setDataEdit] = useState<IMenu | null>(null)

  // Hàm xử lý khi đóng Dialog hành động
  function handleClose() {
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)

    return () => clearTimeout(id)
  }

  // Hàm xử lý xóa Menu
  async function handleDelete(menu: IMenu) {
    try {
      const res = await mutateAsync(menu.id)
      if (res?.statusCode === 200) {
        setOpen(false)
      }
    } catch (error) {
      console.log("Error delete menu :::", error)
    }
  }

  if (!metadataMenus) return null

  return (
    <>
      <DataCard
        dataSource={metadataMenus}
        renderCard={(menu) => (
          <MenuCard
            menu={menu}
            onEdit={(menu) => {
              setOpen(true)
              setDataEdit(menu)
            }}
            onDelete={(menu) => {
              handleDelete(menu)
            }}
            isPending={isPending}
          />
        )}
        onAddCard={() => setOpen(true)}
        // Tùy biến số lượng cột hiển thị theo kích thước container (ví dụ grid 2 hoặc 3 cột)
        className="gap-4 @xl/main:grid-cols-2 @4xl/main:grid-cols-3"
      />

      <MenuAction open={open} dataEdit={dataEdit} onClose={handleClose} />
    </>
  )
}
