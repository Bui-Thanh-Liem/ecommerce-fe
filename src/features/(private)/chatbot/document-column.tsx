import { type ColumnDef } from "@tanstack/react-table"
import { IRagDocument } from "@/shared/interfaces/models/chatbot/rag-document.interface"
import {
  AlertCircle,
  CheckCircle2,
  FileCode2,
  FileSpreadsheet,
  FileText,
  Loader2,
} from "lucide-react"
import { DocumentStatus } from "@/shared/types/document.type"
import { Badge } from "@/components/ui/badge"
import { formatBytes } from "@/utils/format-byte.util"

export const ragDocumentColumns: ColumnDef<IRagDocument>[] = [
  {
    accessorKey: "originalname",
    header: "Filename",
    cell: ({ row }) => {
      const filename = row.original.originalname
      const ext = filename.split(".").pop()?.toLowerCase()

      const fileConfig = {
        pdf: {
          icon: FileText,
          color: "text-red-500 bg-red-50",
        },
        doc: {
          icon: FileText,
          color: "text-blue-500 bg-blue-50",
        },
        docx: {
          icon: FileText,
          color: "text-blue-500 bg-blue-50",
        },
        csv: {
          icon: FileSpreadsheet,
          color: "text-emerald-500 bg-emerald-50",
        },
        txt: {
          icon: FileCode2,
          color: "text-slate-500 bg-slate-100",
        },
      } as const

      const config = fileConfig[ext as keyof typeof fileConfig] ?? {
        icon: File,
        color: "text-gray-500 bg-gray-100",
      }

      const Icon = config.icon

      return (
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.color}`}
          >
            <Icon size={18} />
          </div>

          <div className="min-w-0">
            <p className="truncate max-w-62 font-medium text-slate-900" title={filename}>
              {filename}
            </p>

            <p className="text-xs tracking-wide text-slate-500 uppercase">
              {ext ?? "Unknown"}
            </p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "fileSize",
    header: "Storage Capacity",
    cell: ({ row }) => {
      const doc = row.original
      return <span>{formatBytes(doc.fileSize)}</span>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Upload Time",
    cell: ({ row }) => {
      const doc = row.original
      return <span>{new Date(doc.createdAt).toLocaleString()}</span>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const doc = row.original
      return <StatusCell status={doc.status} />
    },
  },
]

export function StatusCell({ status }: { status: DocumentStatus }) {
  // Cấu hình mapping màu sắc, icon và text theo từng trạng thái
  const statusConfig = {
    processing: {
      className:
        "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50",
      icon: <Loader2 size={12} className="animate-spin text-amber-600" />,
    },
    ready: {
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
      icon: <CheckCircle2 size={12} className="text-emerald-600" />,
    },
    failed: {
      className: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-50",
      icon: <AlertCircle size={12} className="text-rose-600" />,
    },
  }

  const currentStatus = statusConfig[status] || statusConfig.ready

  return (
    <Badge
      variant="outline"
      className={`flex w-fit items-center gap-x-1 px-2 py-0.5 font-medium shadow-none ${currentStatus.className}`}
    >
      {currentStatus.icon}
      {status}
    </Badge>
  )
}
