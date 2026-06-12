import { ImagesCell } from "@/components/cell-in-table/images"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { IMarketingProgram } from "@/shared/interfaces/models/mkt-program/marketing-program.interface"
import { ColumnDef } from "@tanstack/table-core"
import { format } from "date-fns"

export const mktProgramColumns: ColumnDef<IMarketingProgram>[] = [
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
        <div className="w-45 space-y-2 py-1">
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      if (!status) return <p>-</p>
      return <Badge>{status}</Badge>
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
