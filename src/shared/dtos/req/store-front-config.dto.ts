import { DETAIL_HOME_CONFIG_KEYS } from "@/shared/constants/home-config-keys.constant"
import z from "zod"

// --- 1. SCHEMAS THÀNH PHẦN CƠ BẢN (BASE SCHEMAS) ---

export const ImageSchema = z.object({
  url: z.url("Định dạng URL ảnh không hợp lệ"),
  alt: z.string().optional(),
})

// Dùng chung cho MktProgram và Campaign (id, slug, name, mainImage)
export const MktProgramSchema = z.object({
  id: z.string().min(1, "ID không được để trống"),
  slug: z.string().min(1, "Slug không được để trống"),
  name: z.string().min(1, "Name không được để trống"),
  mainImage: ImageSchema,
})

export const CampaignSchema = MktProgramSchema

// Dùng cho topBanner, mainBanner (id, slug, title, image)
export const BannerItemSchema = z.object({
  id: z.string().min(1, "ID không được để trống"),
  slug: z.string().min(1, "Slug không được để trống"),
  title: z.string().min(1, "Title không được để trống"),
  image: ImageSchema,
})

// Dùng cho menu (id, slug, name, link)
export const MenuItemSchema = z.object({
  id: z.string().min(1, "ID không được để trống"),
  slug: z.string().min(1, "Slug không được để trống"),
  name: z.string().min(1, "Name không được để trống"),
  link: z.string().min(1, "Link không được để trống"),
})

// Dùng cho listCategories (id, slug, name, image) - ĐÃ BỎ trường 'title' theo interface mới
export const CategoryItemSchema = z.object({
  id: z.string().min(1, "ID không được để trống"),
  slug: z.string().min(1, "Slug không được để trống"),
  name: z.string().min(1, "Name không được để trống"),
  minPrice: z.number().optional(),
  image: ImageSchema,
})

export const PopularSearchItemSchema = z.object({
  id: z.string().min(1, "ID không được để trống"),
  text: z.string().min(1, "Text không được để trống"),
})

export const PopularSearchSchema = z.object({
  title: z.string().min(1, "Title không được để trống"),
  searches: z.array(PopularSearchItemSchema),
})

// --- 2. SCHEMAS CHO CÁC KHỐI MARKETING (MARKETING BLOCKS) ---

// marketingProgram01 & marketingProgram03
export const MktSessionProgramSchema = z.object({
  title: z.string().min(1, "Title không được để trống"),
  mktPrograms: z.array(MktProgramSchema),
})

// marketingProgram02
export const MktSessionProgram02Schema = z.object({
  campaigns: z.array(CampaignSchema),
})

// marketingProgram04 & marketingProgram05 (Cho phép null)
export const MktSessionSingleCampaignSchema = z.object({
  title: z.string().min(1, "Title không được để trống"),
  campaign: CampaignSchema.nullable(), // Cập nhật theo interface mới: | null
})

// marketingProgram06
export const MktSessionMultiCampaignsSchema = z.object({
  title: z.string().min(1, "Title không được để trống"),
  campaigns: z.array(CampaignSchema),
})

// --- 3. SCHEMA CHÍNH CHO DetailHomeConfig ---

export const DetailHomeConfigSchema = z.object({
  topBanner: BannerItemSchema.nullable().optional(), // Cập nhật: Cho phép null
  header: z.string().optional(),
  menu: z.array(MenuItemSchema).optional(),
  mainBanner: z.array(BannerItemSchema).optional(),
  listCategories: z.array(CategoryItemSchema).optional(), // Đã chuẩn hóa theo CategoryItem mới
  historyProducts: z.string().optional(),
  suggestForYou: z.string().optional(),

  marketingProgram01: MktSessionProgramSchema.optional(),
  marketingProgram02: MktSessionProgram02Schema.optional(),
  marketingProgram03: MktSessionProgramSchema.optional(),
  marketingProgram04: MktSessionSingleCampaignSchema.optional(),
  marketingProgram05: MktSessionSingleCampaignSchema.optional(),
  marketingProgram06: MktSessionMultiCampaignsSchema.optional(),

  popularSearch: PopularSearchSchema.optional(),
})

// --- 4. SCHEMA CHO ConfigHome ---

export const ConfigHomeSchema = z.object({
  order: z
    .array(z.enum(DETAIL_HOME_CONFIG_KEYS as [string, ...string[]]), {
      message:
        "Mỗi phần tử trong order phải là một key hợp lệ của DetailHomeConfig",
    })
    .optional(),
  config: DetailHomeConfigSchema.optional(),
})

// --- 5. EXPORT CÁC SCHEMA CHÍNH VÀ TYPE INFERENCE ---

export const CreateStoreFrontConfigSchema = z.object({
  homeConfig: ConfigHomeSchema,
})

export const UpdateStoreFrontConfigSchema =
  CreateStoreFrontConfigSchema.partial()

// TypeScript Types trích xuất từ Zod để import sử dụng ở các Component FE
export type CreateStoreFrontConfigDto = z.infer<
  typeof CreateStoreFrontConfigSchema
>
export type UpdateStoreFrontConfigDto = z.infer<
  typeof UpdateStoreFrontConfigSchema
>
export type DetailHomeConfigDto = z.infer<typeof DetailHomeConfigSchema>
export type ConfigHomeDto = z.infer<typeof ConfigHomeSchema>
export type CategoryItemDto = z.infer<typeof CategoryItemSchema>
