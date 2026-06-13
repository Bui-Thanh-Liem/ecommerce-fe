"use client"

import { useEffect, useState } from "react"
import { TabsTrigger } from "@/components/ui/tabs"

interface CampaignTriggerProps {
  campaign: {
    id: string
    name: string
    startDate: string // Định dạng chuẩn ISO hoặc string convert được sang Date
    endDate: string
  }
  isActive: boolean
}

export function CampaignTrigger({ campaign, isActive }: CampaignTriggerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  })
  const [status, setStatus] = useState<"LIVE" | "UPCOMING" | "ENDED">(
    "UPCOMING"
  )
  const [startTimeStr, setStartTimeStr] = useState("")

  useEffect(() => {
    const start = new Date(campaign.startDate).getTime()
    const end = new Date(campaign.endDate).getTime()

    // Định dạng giờ bắt đầu hiển thị cho các campaign sắp diễn ra (VD: 18:00)
    const startDateObj = new Date(campaign.startDate)
    const hoursStr = String(startDateObj.getHours()).padStart(2, "0")
    const minutesStr = String(startDateObj.getMinutes()).padStart(2, "0")
    setStartTimeStr(`${hoursStr}:${minutesStr}`)

    const calculateTime = () => {
      const now = new Date().getTime()

      if (now < start) {
        setStatus("UPCOMING")
      } else if (now >= start && now <= end) {
        setStatus("LIVE")
        const difference = end - now

        const hrs = Math.floor(difference / (1000 * 60 * 60))
        const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const secs = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({
          hours: String(hrs).padStart(2, "0"),
          minutes: String(mins).padStart(2, "0"),
          seconds: String(secs).padStart(2, "0"),
        })
      } else {
        setStatus("ENDED")
      }
    }

    calculateTime() // Chạy ngay lập tức lần đầu
    const timer = setInterval(calculateTime, 1000) // Cập nhật mỗi giây

    return () => clearInterval(timer)
  }, [campaign.startDate, campaign.endDate])

  if (status === "ENDED") return null // Ẩn đi nếu campaign đã kết thúc

  return (
    <TabsTrigger
      value={campaign.id}
      className={`flex w-60 items-center justify-between overflow-hidden rounded-2xl border p-0 text-sm transition-all data-[state=active]:border-sky-600 data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:border-transparent data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-500`}
    >
      {/* KHỐI TRÁI: ĐANG DIỄN RA (CHỈ CÒN) */}
      <div
        className={`flex h-full flex-1 items-center justify-center px-3 transition-colors ${status === "LIVE" && isActive ? "bg-sky-500" : ""} ${status === "LIVE" && !isActive ? "bg-sky-100 text-sky-700" : ""} `}
      >
        <span className="text-xs font-medium opacity-90">Chỉ còn:</span>
        {status === "LIVE" ? (
          <div className="mt-1 flex items-center gap-1 text-xs font-bold">
            <span
              className={`rounded px-1 py-0.5 ${isActive ? "bg-white text-sky-600" : "bg-sky-600 text-white"}`}
            >
              {timeLeft.hours}
            </span>
            <span>:</span>
            <span
              className={`rounded px-1 py-0.5 ${isActive ? "bg-white text-sky-600" : "bg-sky-600 text-white"}`}
            >
              {timeLeft.minutes}
            </span>
            <span>:</span>
            <span
              className={`rounded px-1 py-0.5 ${isActive ? "bg-white text-sky-600" : "bg-sky-600 text-white"}`}
            >
              {timeLeft.seconds}
            </span>
          </div>
        ) : (
          <span className="mt-1 text-xs font-semibold opacity-60">Chờ mở</span>
        )}
      </div>

      {/* KHỐI PHẢI: SẮP DIỄN RA */}
      <div
        className={`flex h-full flex-1 items-center justify-center px-3 transition-colors ${status === "UPCOMING" && isActive ? "bg-amber-500" : ""} ${status === "UPCOMING" && !isActive ? "bg-amber-50 text-amber-700" : ""} `}
      >
        <span className="text-xs font-medium opacity-90">Sắp diễn ra</span>
        <span className="mt-0.5 text-base font-bold">{startTimeStr}</span>
      </div>
    </TabsTrigger>
  )
}
