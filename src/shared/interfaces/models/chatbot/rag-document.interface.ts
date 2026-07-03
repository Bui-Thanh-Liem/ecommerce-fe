import { IBase } from "@/shared/interfaces/common/base.interface"
import { DocumentStatus } from "@/shared/types/document.type"

export interface IRagDocument extends IBase {
  originalname: string
  filename: string
  filePath: string
  fileSize: number
  status: DocumentStatus
  chunkCount: number
}
