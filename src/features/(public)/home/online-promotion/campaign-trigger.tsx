"use client"

import { useEffect, useState } from "react"
import { TabsTrigger } from "@/components/ui/tabs"
import { ICampaign } from "@/shared/interfaces/models/mkt-program/campaign.interface"

interface CampaignTriggerProps {
  campaign: ICampaign
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

    // Định dạng ngày giờ bắt đầu cho campaign sắp diễn ra (VD: 18:00 25/12)
    const startDateObj = new Date(campaign.startDate)
    const hoursStr = String(startDateObj.getHours()).padStart(2, "0")
    const minutesStr = String(startDateObj.getMinutes()).padStart(2, "0")
    const dateStr = String(startDateObj.getDate()).padStart(2, "0")
    const monthStr = String(startDateObj.getMonth() + 1).padStart(2, "0")

    // Bạn có thể tùy biến format hiển thị ở đây (VD: chỉ hiện giờ "18:00" hoặc cả ngày "18:00 - 25/12")
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStartTimeStr(`${hoursStr}:${minutesStr} - ${dateStr}/${monthStr}`)

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

    calculateTime()
    const timer = setInterval(calculateTime, 1000)

    return () => clearInterval(timer)
  }, [campaign.startDate, campaign.endDate])

  // 1. Nếu campaign đã kết thúc thì ẩn hoàn toàn
  if (status === "ENDED") return null

  // Định nghĩa CSS background & text color động theo trạng thái và việc tab có được chọn (isActive) hay không
  let dynamicStyles = ""
  if (status === "LIVE") {
    dynamicStyles = isActive
      ? "bg-sky-200! text-white"
      : "bg-sky-50 text-sky-700 border-sky-200"
  } else if (status === "UPCOMING") {
    dynamicStyles = isActive
      ? "bg-amber-200! text-white"
      : "bg-amber-50 text-amber-700 border-amber-200"
  }

  return (
    <TabsTrigger
      value={campaign.id}
      className={`flex flex-col items-center justify-center rounded-2xl py-6 transition-all ${dynamicStyles}`}
    >
      {/* 2. Trạng thái ĐANG DIỄN RA */}
      {status === "LIVE" && (
        <div className="flex items-center gap-x-2">
          <span className="tracking-wider uppercase opacity-80">Chỉ còn:</span>
          <div className="flex items-center gap-1 text-xs font-bold">
            <span
              className={`flex h-5 w-6 items-center justify-center rounded bg-sky-600 text-white`}
            >
              <span>{timeLeft.hours}</span>
            </span>
            <span>:</span>
            <span
              className={`flex h-5 w-6 items-center justify-center rounded bg-sky-600 text-white`}
            >
              <span>{timeLeft.minutes}</span>
            </span>
            <span>:</span>
            <span
              className={`flex h-5 w-6 items-center justify-center rounded bg-sky-600 text-white`}
            >
              <span>{timeLeft.seconds}</span>
            </span>
          </div>
        </div>
      )}

      {/* 3. Trạng thái SẮP DIỄN RA */}
      {status === "UPCOMING" && (
        <div className="flex items-center gap-x-2">
          <span className="tracking-wider uppercase opacity-80">
            Sắp diễn ra:
          </span>
          <span className="text-sm font-bold">{startTimeStr}</span>
        </div>
      )}
    </TabsTrigger>
  )
}
