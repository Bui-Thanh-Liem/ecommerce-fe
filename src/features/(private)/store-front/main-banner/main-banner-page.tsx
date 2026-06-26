"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DataCard } from "@/components/data-card"
import { cn } from "@/lib/utils"
import {
  useDeleteMainBanner,
  useFindAllMainBanners,
  useUpdateMainBanner,
} from "@/hooks/apis/store-front/use-main-banner"
import { MainBannerAction } from "./main-banner-action"
import { IMainBanner } from "@/shared/interfaces/models/store-front/main-banner.interface"
import { Active } from "@/components/active"
import { Badge } from "@/components/ui/badge"

const ChangeActiveStatus = ({ mainBanner }: { mainBanner: IMainBanner }) => {
  const { mutate } = useUpdateMainBanner()

  function toggleActiveStatus() {
    mutate({
      id: mainBanner.id,
      payload: {
        isActive: !mainBanner.isActive,
      },
    })
  }

  return (
    <span
      className="cursor-pointer rounded-2xl bg-white"
      onClick={toggleActiveStatus}
    >
      <Active isActive={mainBanner.isActive} />
    </span>
  )
}

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
    <Card className="group relative h-60 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
        style={{
          backgroundImage: `url(${mainBanner.image?.url})`,
        }}
      />

      <CardContent className="absolute bottom-4 w-full translate-y-4 px-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
        <div className="flex items-center justify-between rounded-2xl bg-gray-50/90 p-4 py-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Badge className="shrink-0 truncate text-sm font-semibold">
              {mainBanner.campaign.name}
            </Badge>

            {mainBanner.desc && (
              <>
                <span className="bg-border h-4 w-px" />
                <Badge
                  variant="secondary"
                  className="text-muted-foreground min-w-0 truncate text-xs"
                >
                  {mainBanner.desc}
                </Badge>
              </>
            )}

            <span className="bg-border h-4 w-px" />

            <ChangeActiveStatus mainBanner={mainBanner} />
          </div>
          <div className="space-x-2">
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
          </div>
        </div>
      </CardContent>

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
      console.error("Error delete main banner :::", error)
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
        className="@xl/main:grid-cols-1 @5xl/main:grid-cols-1"
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
