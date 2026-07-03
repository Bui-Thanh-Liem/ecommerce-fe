"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  UploadCloud,
  FileText,
  Loader2,
  Search,
  Database,
  HardDrive,
  FileCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { toast } from "sonner"
import {
  useDeleteDocument,
  useFindAllRagDocuments,
  useIngestDocument,
} from "@/hooks/apis/chatbot/use-rag"
import { DataTable } from "@/components/data-table"
import { ragDocumentColumns } from "./document-column"
import { formatBytes } from "@/utils/format-byte.util"
import {
  IngestDocumentDto,
  IngestDocumentSchema,
} from "@/shared/dtos/req/rag-document.dto"

//
const storageCapacity = 100 * 1024 * 1024 // 100MB

//
export function PublicChatbotPage() {
  const { data } = useFindAllRagDocuments("public")
  const documents = data?.metadata?.data || []
  const { mutateAsync } = useIngestDocument()
  const { mutateAsync: deleteDocumentMutation } = useDeleteDocument()
  const usedCapacity = documents.reduce((acc, doc) => acc + doc.fileSize, 0)
  const embeddingStatus = documents.length
    ? Math.round(
        (documents.filter((doc) => doc.status === "ready").length /
          documents.length) *
          100
      )
    : 0

  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // 1. Khởi tạo React Hook Form
  const form = useForm<IngestDocumentDto>({
    resolver: zodResolver(IngestDocumentSchema),
  })

  // Theo dõi File biến động để render giao diện tên file theo thời gian thực
  const selectedFiles = form.watch("file")
  const currentFile = selectedFiles?.[0]

  // 2. Hàm kích hoạt Submit gửi dữ liệu lên Server NestJS
  async function onSubmit(values: IngestDocumentDto) {
    setIsUploading(true)
    const fileToUpload = values.file[0]

    // Khởi tạo FormData bóc tách đúng key 'file' khớp với @UseInterceptors(FileInterceptor('file', ...))
    const formData = new FormData()
    formData.append("file", fileToUpload)

    try {
      // Gọi tới API với param type cố định là 'internal' cho trang này
      await mutateAsync({ file: fileToUpload, type: "public" })

      toast.success(`Successfully uploaded document: ${fileToUpload.name}`)

      // Reset form sau khi upload thành công
      form.reset({ file: undefined })
    } catch (error) {
      console.error("Failed to ingest document:", error)
      toast.error(
        "Unable to upload and process the data file. Please try again.."
      )
    } finally {
      setIsUploading(false)
    }
  }

  async function handleDeleteDocument(id: string) {
    try {
      await deleteDocumentMutation({ id, type: "public" })
      toast.success("Document deleted successfully.")
    } catch (error) {
      console.error("Failed to delete document:", error)
      toast.error("Unable to delete the document. Please try again.")
    }
  }

  if (!data?.metadata) return null

  return (
    <div className="min-h-[calc(100vh-120px)] space-y-8 rounded-2xl bg-slate-50 p-8 text-slate-800">
      {/* TIÊU ĐỀ & MÔ TẢ */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="flex items-center gap-x-3 text-3xl font-bold tracking-tight text-slate-900">
            <span
              style={{ backgroundColor: "#0069A8" }}
              className="inline-block h-8 w-2 rounded-full"
            ></span>
            Database Management -{" "}
            <span className="inline-block rounded-4xl bg-blue-500 p-1 px-4 text-white">
              Public
            </span>{" "}
            Chatbot
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ingest and manage documents for the Public Chatbot, enabling AI to
            answer questions based on uploaded data.
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-[#0069A8] bg-blue-50 px-4 py-4 text-xs font-semibold tracking-wider text-[#0069A8] uppercase"
        >
          Power: Customer-Facing
        </Badge>
      </div>

      {/* KHU VỰC THỐNG KÊ NHANH */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex items-center gap-x-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div
            style={{ backgroundColor: "#0069A8" }}
            className="rounded-xl p-4 text-white"
          >
            <Database size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">
              Total Documents in VectorDB
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {documents.length} Files
            </p>
          </div>
        </div>
        <div className="flex items-center gap-x-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="rounded-xl bg-emerald-100 p-4 text-emerald-600">
            <FileCheck size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">
              Embedding Status
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {embeddingStatus}% Completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-x-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="rounded-xl bg-amber-100 p-4 text-amber-600">
            <HardDrive size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">
              Storage Capacity
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {formatBytes(usedCapacity)} / {formatBytes(storageCapacity)}
            </p>
          </div>
        </div>
      </div>

      {/* BỐ CỤC CHÍNH */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        {/* CỘT TRÁI: KHU VỰC ĐƯA FILE LÊN SERVER */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-8 flex items-center gap-x-2 text-lg font-bold text-slate-900">
            <UploadCloud size={20} style={{ color: "#0069A8" }} />
            Upload New Documents
          </h2>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="file"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="space-y-4"
                  >
                    <FieldLabel
                      htmlFor="form-rhf-input-file"
                      className="sr-only"
                    >
                      Select File
                    </FieldLabel>

                    <div className="group relative cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center transition-colors hover:border-[#0069A8]">
                      <input
                        type="file"
                        id="form-rhf-input-file"
                        name={field.name}
                        onBlur={field.onBlur}
                        accept=".pdf,.txt,.docx,.csv"
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                        aria-invalid={fieldState.invalid}
                        onChange={(e) => {
                          field.onChange(e.target.files)
                        }}
                      />
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="rounded-full bg-white p-3 shadow-sm transition-transform group-hover:scale-110">
                          <UploadCloud size={28} style={{ color: "#0069A8" }} />
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold text-[#0069A8]">
                            Click to select file
                          </span>{" "}
                          or drag and drop here
                        </div>
                        <p className="text-xs text-slate-400">
                          Supports PDF, TXT, CSV, DOCX up to 10MB
                        </p>
                      </div>
                    </div>

                    {/* Hiển thị tên file được chọn trực quan tức thì */}
                    {currentFile && !fieldState.error && (
                      <div className="animate-in fade-in flex items-center gap-x-2 rounded-xl border border-blue-100 bg-blue-50/50 p-2.5 text-xs font-medium text-[#0069A8] duration-200">
                        <FileText size={16} className="shrink-0" />
                        <span className="flex-1 truncate">
                          {currentFile.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({(currentFile.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                    )}

                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="text-xs font-medium text-rose-500"
                      />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type="submit"
              disabled={isUploading}
              style={{ backgroundColor: isUploading ? "#80b4d4" : "#0069A8" }}
              className="mt-7 h-11 w-full font-medium text-white shadow-md transition-opacity hover:opacity-95"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing RAG & Embedding...
                </>
              ) : (
                "Start Ingesting Data"
              )}
            </Button>
          </form>
        </div>

        {/* CỘT PHẢI: KHU VỰC SHOW CÁC FILES ĐÃ INGEST THÀNH CÔNG */}
        <div className="space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Document List
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Chatbot AI data being learned for internal question answering
              </p>
            </div>

            {/* Bộ lọc tìm kiếm */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search document name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 border-slate-200 pr-4 pl-9 focus-visible:ring-[#0069A8]"
              />
            </div>
          </div>

          {/* Bảng hiển thị dữ liệu */}
          <DataTable
            columns={ragDocumentColumns}
            dataSource={data?.metadata}
            onDeleteRow={(row) => handleDeleteDocument(row.original.id)}
          />
        </div>
      </div>
    </div>
  )
}
