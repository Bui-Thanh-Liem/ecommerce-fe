import { Active } from "@/components/active"
import { ImagesCell } from "@/components/cell-in-table/images"
import { MktProgramCell } from "@/components/cell-in-table/mkt-program-cell"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useUpdateCampaign } from "@/hooks/apis/mkt-program/use-campaign"
import { ICampaign } from "@/shared/interfaces/models/mkt-program/campaign.interface"
import { ColumnDef, Row } from "@tanstack/table-core"
import { format } from "date-fns"
import Link from "next/link"

//
const StatusCell = ({ row }: { row: Row<ICampaign> }) => {
  const { mutate } = useUpdateCampaign()

  function toggleActiveStatus() {
    mutate({
      id: row.original.id,
      payload: {
        isActive: !row.original.isActive,
      },
    })
  }

  return (
    <span className="cursor-pointer" onClick={toggleActiveStatus}>
      <Active isActive={row.original.isActive} />
    </span>
  )
}

export const campaignColumns: ColumnDef<ICampaign>[] = [
  {
    accessorKey: "marketingProgram",
    header: "Marketing Program",
    cell: ({ row }) => {
      const marketingProgram = row.original.marketingProgram
      if (!marketingProgram) return <span>-</span>
      return <MktProgramCell mktProgram={marketingProgram} />
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <p className="max-w-60 overflow-auto whitespace-normal">
          {row.original.name || "-"}
        </p>
      )
    },
  },
  {
    accessorKey: "mainImage",
    header: "Main Image",
    cell: ({ row }) => {
      const mainImage = row.original.mainImage
      if (!mainImage) return <span>-</span>
      return <ImagesCell images={[mainImage]} />
    },
  },
  {
    accessorKey: "images",
    header: "Images",
    cell: ({ row }) => {
      const images = row.original.images || []
      if (images.length <= 0) return <span>-</span>
      return <ImagesCell images={images} />
    },
  },
  {
    accessorKey: "startDate",
    header: "Date range",
    cell: ({ row }) => {
      const { startDate, endDate } = row.original

      if (!startDate || !endDate) {
        return <span className="text-muted-foreground">-</span>
      }

      const start = new Date(startDate).getTime()
      const end = new Date(endDate).getTime()
      const now = Date.now()

      // 1. Tính toán phần trăm tiến độ
      let percentage = 0
      if (now >= end) {
        percentage = 100
      } else if (now <= start) {
        percentage = 0
      } else {
        const total = end - start
        const elapsed = now - start
        percentage = Math.round((elapsed / total) * 100)
      }

      // 2. Xác định màu sắc dựa trên trạng thái (Tùy chọn)
      const isCompleted = now >= end
      const isNotStarted = now < start

      const formattedStart = `${format(start, "MMM do, yyyy")} ${format(start, "hh:mm:ss a")}`
      const formattedEnd = `${format(end, "MMM do, yyyy")} ${format(end, "hh:mm:ss a")}`

      return (
        <div className="w-[180px] space-y-2 py-1">
          {/* Phần Text hiển thị % hoặc Trạng thái ngắn gọn */}
          <div className="text-muted-foreground flex justify-between text-xs font-medium">
            <span>
              {isNotStarted
                ? "Not Started"
                : isCompleted
                  ? "Completed"
                  : "Running"}
            </span>
            <span className="font-mono">{percentage}%</span>
          </div>

          {/* Thanh Progress tích hợp Tooltip khi hover vào sẽ hiện ngày chi tiết */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full cursor-help">
                <Progress
                  value={percentage}
                  className="h-2"
                  // Nếu dùng progress mặc định của Shadcn, có thể đổi màu tùy trạng thái qua indicatorClassName (nếu có)
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="space-y-1 p-2 text-xs">
              <p>
                <span className="text-muted-foreground">Start:</span>{" "}
                {formattedStart}
              </p>
              <p>
                <span className="text-muted-foreground">End:</span>{" "}
                {formattedEnd}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      )
    },
  },
  {
    accessorKey: "productHighlighted",
    header: "Product Highlighted",
    cell: ({ row }) => {
      const productHighlighted = row.original.productHighlighted || []
      if (!productHighlighted.length) return <span>-</span>
      return (
        <div className="space-y-1">
          {productHighlighted.map((p) => (
            <Tooltip key={p.id}>
              <TooltipTrigger asChild>
                <Badge className="cursor-help">{p.sku}</Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{p.product.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => <StatusCell row={row} />,
    enableHiding: false,
  },
  {
    accessorKey: "promotions",
    header: "Promotions",
    cell: ({ row }) => {
      const promotions = row.original.promotions
      if (!promotions?.length) return <p>-</p>
      return (
        <>
          {promotions.map((c) => (
            <Link
              key={c.id}
              href={`/marketing-programs/promotions/?id=${c.id}`}
              className="hover:underline"
            >
              <p className="max-w-60 overflow-auto whitespace-normal">
                {c.name}
              </p>
            </Link>
          ))}
        </>
      )
    },
  },
  {
    accessorKey: "desc",
    header: "Description",
    cell: ({ row }) => {
      const desc = row.original.desc
      if (!desc) return <p>-</p>

      return <Textarea value={desc} readOnly />
    },
  },
]
