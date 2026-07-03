import z from "zod"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const IngestDocumentSchema = z.object({
  file: z
    .custom<FileList>()
    .refine(
      (files) => files && files.length === 1,
      "Please select a document file."
    )
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "File size cannot exceed 10MB."
    )
    .refine((files) => {
      if (!files?.[0]) return false
      const type = files[0].type
      const name = files[0].name
      // Kiểm tra qua cả Mime-type lẫn đuôi mở rộng để tránh lỗi nhận diện trên một số hệ điều hành
      return (
        [
          "application/pdf",
          "text/plain",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/csv",
        ].includes(type) || /\.(pdf|txt|docx|csv)$/i.test(name)
      )
    }, "Only PDF, TXT, DOCX, or CSV formats are supported."),
})

export type IngestDocumentDto = z.infer<typeof IngestDocumentSchema>
