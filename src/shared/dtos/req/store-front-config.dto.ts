// --- 1. Định nghĩa các Sub-Schema tương ứng với các object lồng nhau ---

import { DETAIL_HOME_CONFIG_KEYS } from "@/shared/constants/home-config-keys.constant"
import z from "zod"

export const MktSessionProgramSchema = z.object({
  title: z.string().min(1, "Title không được để trống"),
  mktPrograms: z.array(z.record(z.string(), z.any())),
})

export const MktSessionSingleCampaignSchema = z.object({
  title: z.string().min(1, "Title không được để trống"),
  campaign: z.record(z.string(), z.any()),
})

export const MktSessionMultiCampaignsSchema = z.object({
  title: z.string().min(1, "Title không được để trống"),
  campaigns: z.array(z.record(z.string(), z.any())),
})

export const TopicSchema = z.object({
  title: z.string().min(1, "Title không được để trống"),
  topics: z.array(z.string()),
})

// --- 2. Schema tương ứng với DetailHomeConfigDto ---

export const DetailHomeConfigSchema = z.object({
  topBanner: z.record(z.string(), z.any()).optional(), // @IsOptional()
  header: z.string().min(1, "Header không được để trống"),
  menu: z.array(z.record(z.string(), z.any())),
  mainBanner: z.array(z.record(z.string(), z.any())),
  listCategories: z.array(z.record(z.string(), z.any())),
  historyProducts: z.array(z.record(z.string(), z.any())),

  mktSessionOne: MktSessionProgramSchema,
  mktSessionTwo: MktSessionProgramSchema, // Giữ nguyên typo "Tow" theo BE

  suggestForYou: z.array(z.record(z.string(), z.any())),

  mktSessionThree: MktSessionSingleCampaignSchema,
  mktSessionFour: MktSessionSingleCampaignSchema,
  mktSessionFive: MktSessionMultiCampaignsSchema,

  topic: TopicSchema,
})

// --- 3. Schema tương ứng với ConfigHomeDto ---

export const ConfigHomeSchema = z.object({
  // Sử dụng z.enum để validate các phần tử trong mảng order phải thuộc DETAIL_HOME_CONFIG_KEYS
  order: z.array(z.enum(DETAIL_HOME_CONFIG_KEYS), {
    message:
      "Mỗi phần tử trong order phải là một key hợp lệ của DetailHomeConfig",
  }),
  config: DetailHomeConfigSchema.optional(),
})

// --- 4. SCHEMA CHÍNH EXPORT ---

export const CreateStoreFrontConfigSchema = z.object({
  homeConfig: ConfigHomeSchema,
})

export const UpdateStoreFrontConfigSchema =
  CreateStoreFrontConfigSchema.partial()

// --- (Tùy chọn) Export Type cho TypeScript để sử dụng ở FE nếu cần ---
export type CreateStoreFrontConfigDto = z.infer<
  typeof CreateStoreFrontConfigSchema
>
export type UpdateStoreFrontConfigDto = z.infer<
  typeof UpdateStoreFrontConfigSchema
>
export type DetailHomeConfigDto = z.infer<typeof DetailHomeConfigSchema>
