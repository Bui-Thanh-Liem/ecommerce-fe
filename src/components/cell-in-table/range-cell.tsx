import { format } from "date-fns"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { Progress } from "../ui/progress"
import { cn } from "@/lib/utils"

export function RangeCell({
  startDate,
  endDate,
}: {
  startDate: Date
  endDate: Date
}) {
  if (!startDate || !endDate) {
    return <span className="text-muted-foreground">-</span>
  }

  // eslint-disable-next-line react-hooks/purity
  const now = Date.now()
  const end = new Date(endDate).getTime()
  const start = new Date(startDate).getTime()

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
        <span
          className={cn(
            "text-orange-500",
            isNotStarted && "text-blue-500",
            isCompleted && "text-green-500"
          )}
        >
          {isNotStarted ? "Not Started" : isCompleted ? "Completed" : "Running"}
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
            <span className="text-muted-foreground">End:</span> {formattedEnd}
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
