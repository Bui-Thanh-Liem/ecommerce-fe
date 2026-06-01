import { CreateCategoryPromotionSchema } from "@/shared/dtos/req/category-promotion.dto"
import z from "zod"

const initFormValue: z.infer<typeof CreateCategoryPromotionSchema> = {
  promotion: "",
  category: "",
  customDiscount: 0,
  priority: 0,
}

export function CategoryPromotionAction({}) {}
