"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DataCard } from "@/components/data-card"
import { TopBannerAction } from "./top-banner-action"
import { ITopBanner } from "@/shared/interfaces/models/store-front/top-banner.interface"
import {
  useDeleteTopBanner,
  useFindAllTopBanners,
  useUpdateTopBanner,
} from "@/hooks/apis/store-front/use-top-banner"
import { Badge } from "@/components/ui/badge"
import { Active } from "@/components/active"

const ChangeActiveStatus = ({ topBanner }: { topBanner: ITopBanner }) => {
  const { mutate } = useUpdateTopBanner()

  function toggleActiveStatus() {
    mutate({
      id: topBanner.id,
      payload: {
        isActive: !topBanner.isActive,
      },
    })
  }

  return (
    <span
      className="cursor-pointer rounded-2xl bg-white"
      onClick={toggleActiveStatus}
    >
      <Active isActive={topBanner.isActive} />
    </span>
  )
}

function TopBannerCard({
  onEdit,
  topBanner,
  onDelete,
  isPending,
}: {
  isPending?: boolean
  topBanner: ITopBanner
  onEdit?: (topBanner: ITopBanner) => void
  onDelete?: (topBanner: ITopBanner) => void
}) {
  return (
    <Card className="group relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
        style={{
          backgroundImage: `url(${topBanner.image?.url})`,
        }}
      />

      {/* Action Panel */}
      <CardContent className="absolute inset-x-0 bottom-0 z-10 p-0">
        <div className="translate-y-full transition-all duration-300 ease-out group-hover:translate-y-2">
          <div className="flex items-center justify-between gap-4 rounded-xl p-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Badge className="shrink-0 truncate text-sm font-semibold">
                {topBanner.title}
              </Badge>

              {topBanner.desc && (
                <>
                  <span className="bg-border h-4 w-px" />
                  <Badge
                    variant="secondary"
                    className="text-muted-foreground min-w-0 truncate text-xs"
                  >
                    {topBanner.desc}
                  </Badge>
                </>
              )}

              <span className="bg-border h-4 w-px" />

              <ChangeActiveStatus topBanner={topBanner} />
            </div>

            <div className="flex shrink-0 gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit?.(topBanner)}
              >
                <Pencil className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete?.(topBanner)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Loading */}
      {isPending && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="rounded-lg bg-white/90 px-4 py-2 text-sm font-medium shadow">
            Processing...
          </div>
        </div>
      )}
    </Card>
  )
}

export function TopBannerPage() {
  //
  const { mutateAsync, isPending } = useDeleteTopBanner()
  const { data } = useFindAllTopBanners()
  const metadataTopBanners = data?.metadata

  //
  const [open, setOpen] = useState(false)
  const [initialData, setInitialData] = useState<ITopBanner | null>(null)
  const [dataEdit, setDataEdit] = useState<ITopBanner | null>(null)

  // Hàm này sẽ được gọi khi dialog đóng, giúp reset dataEdit sau khi đóng dialog
  function handleClose() {
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)
    return () => clearTimeout(id)
  }

  // Hàm xóa main banner
  async function handleDelete(topBanner: ITopBanner) {
    try {
      const res = await mutateAsync(topBanner.id)
      if (res?.statusCode === 200) {
        setOpen(false)
      }
    } catch (error) {
      console.log("Error delete top banner :::", error)
    }
  }

  if (!metadataTopBanners) return null

  return (
    <>
      <DataCard
        dataSource={metadataTopBanners}
        renderCard={(topBanner) => (
          <TopBannerCard
            topBanner={topBanner}
            onEdit={(topBanner) => {
              setOpen(true)
              setDataEdit(topBanner)
            }}
            onDelete={(topBanner) => {
              handleDelete(topBanner)
            }}
            isPending={isPending}
          />
        )}
        onAddCard={() => {
          setOpen(true)
        }}
        className="@xl/main:grid-cols-1 @5xl/main:grid-cols-1"
      />
      <TopBannerAction
        open={open}
        dataEdit={dataEdit}
        onClose={handleClose}
        initialData={initialData}
      />
    </>
  )
}
