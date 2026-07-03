import {
  ShieldAlert,
  Globe,
  ArrowUpRight,
  CheckCircle2,
  Bot,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

export function ChatbotPage() {
  const publicFeatures = [
    "Product Information & Categories",
    "Return & Warranty Policy",
    "Current Offers & Promotions",
    "Support for answering customer FAQs",
  ]

  const internalFeatures = [
    ...publicFeatures,
    "Revenue & KPI Reports",
    "Search Personnel Records & Information",
    "Standard Operating Procedure (SOP)",
    "Automated IT Helpdesk Support",
  ]

  return (
    <div className="grid h-[calc(100vh-120px)] grid-cols-4 items-center gap-x-6 p-6">
      {/* 1. CHATBOT NỘI BỘ (Sử dụng màu chủ đạo #0069A8 làm nền chính) */}
      <div
        style={{ backgroundColor: "#0069A8" }}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-4xl p-8 text-white transition-all duration-300 hover:shadow-2xl hover:shadow-[#0069A8]/30"
      >
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl transition-all group-hover:bg-white/20"></div>

        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0069A8] shadow-inner">
              <ShieldAlert size={28} />
            </div>
            <h3 className="mb-2 text-2xl font-bold tracking-tight">
              Internal Chatbot
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-blue-100">
              A highly secure AI assistant dedicated to employees, deeply
              integrated into the enterprise&apos;s internal data systems..
            </p>

            {/* LIST CHẤM XANH LÁ (TRÊN NỀN XANH CHỦ ĐẠO) */}
            <div className="border-t border-white/20 pt-5">
              <p className="mb-3 text-xs font-semibold tracking-wider text-blue-200 uppercase">
                Data Scope:
              </p>
              <ul className="space-y-2.5">
                {internalFeatures.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-x-2.5 text-sm text-white"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-emerald-300"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-white/20 pt-4">
            <span className="text-xs font-semibold tracking-wider text-blue-200 uppercase">
              Internal AI
            </span>
            <Link
              href="/chatbot/internal"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white hover:text-[#0069A8]"
            >
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. CHATBOT PUBLIC (Nền trắng, text và icon dùng màu chủ đạo #0069A8) */}
      <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-4xl border border-slate-100 bg-white p-8 text-slate-800 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200">
        <div
          style={{ backgroundColor: "#0069A8" }}
          className="absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-[0.03] blur-2xl"
        ></div>

        <div className="flex h-full flex-col justify-between">
          <div>
            <div
              style={{ backgroundColor: "#0069A8" }}
              className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-white"
            >
              <Globe size={28} />
            </div>
            <h3 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
              Public Chatbot
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-500">
              Provide 24/7 customer support across public channels, optimizing
              user experience and conversion rates.
            </p>

            {/* LIST CHẤM XANH LÁ (TRÊN NỀN TRẮNG) */}
            <div className="border-t border-slate-100 pt-5">
              <p className="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Data Scope:
              </p>
              <ul className="space-y-2.5">
                {publicFeatures.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-x-2.5 text-sm text-slate-600"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
            <span
              style={{ color: "#0069A8" }}
              className="text-xs font-semibold tracking-wider uppercase"
            >
              Customer-Facing
            </span>
            <Link
              href="/chatbot/public"
              style={{ backgroundColor: "#0069A8" }}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-all hover:opacity-90"
            >
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. ITEM TRỐNG CHỜ PHÁT TRIỂN */}
      <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-4xl border-2 border-dashed border-slate-200 bg-white/50 p-8 transition-colors hover:bg-white">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400 transition-transform group-hover:scale-110">
            <Bot size={32} className="opacity-60" />
          </div>
          <p className="text-sm font-medium text-slate-400">
            Tính năng đang phát triển
          </p>
        </div>
      </div>

      {/* 4. ITEM TRỐNG CHỜ PHÁT TRIỂN */}
      <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-4xl border-2 border-dashed border-slate-200 bg-white/50 p-8 transition-colors hover:bg-white">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400 transition-transform group-hover:scale-110">
            <MessageSquare size={32} className="opacity-60" />
          </div>
          <p className="text-sm font-medium text-slate-400">
            Tính năng đang phát triển
          </p>
        </div>
      </div>
    </div>
  )
}
