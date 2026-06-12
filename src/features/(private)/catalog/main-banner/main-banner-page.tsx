"use client"

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Pencil, Trash } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DataCard } from "@/components/data-card"
import { cn } from "@/lib/utils"
import {
  useDeleteMainBanner,
  useFindAllMainBanners,
} from "@/hooks/apis/catalog/use-main-banner"
import { MainBannerAction } from "./main-banner-action"
import { IMainBanner } from "@/shared/interfaces/models/catalog/main-banner.interface"

function MainBannerCard({
  onEdit,
  mainBanner,
  onDelete,
  isPending,
}: {
  isPending?: boolean
  mainBanner: IMainBanner
  onEdit?: (mainBanner: IMainBanner) => void
  onDelete?: (mainBanner: IMainBanner) => void
}) {
  return (
    <Card className="relative py-0">
      <div className="relative h-24">
        <Image
          fill // có abs sẵn
          alt={mainBanner.title}
          src={mainBanner.image?.url || "/placeholder-image.png"}
          className="object-cover"
        />
      </div>
      <CardHeader className="mb-6">
        <CardAction className="space-x-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onEdit?.(mainBanner)}
          >
            <Pencil />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="text-destructive"
            onClick={() => onDelete?.(mainBanner)}
          >
            <Trash />
          </Button>
        </CardAction>
        <CardTitle>
          <p className="line-clamp-1">{mainBanner.title}</p>
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {mainBanner.desc}
        </CardDescription>
      </CardHeader>

      <div className={cn("absolute inset-0 hidden", isPending && "flex")}>
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <span className="font-medium text-amber-700">Processing...</span>
        </div>
      </div>
    </Card>
  )
}

export function MainBannerPage() {
  //
  const { mutateAsync, isPending } = useDeleteMainBanner()
  const { data } = useFindAllMainBanners()
  const metadataMainBanners = data?.metadata

  //
  const [open, setOpen] = useState(false)
  const [initialData, setInitialData] = useState<IMainBanner | null>(null)
  const [dataEdit, setDataEdit] = useState<IMainBanner | null>(null)

  // Hàm này sẽ được gọi khi dialog đóng, giúp reset dataEdit sau khi đóng dialog
  function handleClose() {
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)
    return () => clearTimeout(id)
  }

  // Hàm xóa main banner
  async function handleDelete(mainBanner: IMainBanner) {
    try {
      const res = await mutateAsync(mainBanner.id)
      if (res?.statusCode === 200) {
        setOpen(false)
      }
    } catch (error) {
      console.log("Error delete main banner :::", error)
    }
  }

  if (!metadataMainBanners) return null

  return (
    <>
      <DataCard
        dataSource={metadataMainBanners}
        renderCard={(mainBanner) => (
          <MainBannerCard
            mainBanner={mainBanner}
            onEdit={(mainBanner) => {
              setOpen(true)
              setDataEdit(mainBanner)
            }}
            onDelete={(mainBanner) => {
              handleDelete(mainBanner)
            }}
            isPending={isPending}
          />
        )}
        onAddCard={() => {
          setOpen(true)
        }}
      />
      <MainBannerAction
        open={open}
        dataEdit={dataEdit}
        onClose={handleClose}
        initialData={initialData}
      />
    </>
  )
}
