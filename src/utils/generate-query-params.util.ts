import { QueryDto } from "@/shared/dtos/common/query.dto"
import qs from "qs"

export function generateQueryParams({
  params,
  isOption = false,
}: {
  params?: QueryDto
  isOption?: boolean
}): string {
  // 1. Thiết lập giá trị mặc định nếu params không tồn tại
  const { filters, ...rest } = params || { page: 1, limit: isOption ? 50 : 10 }

  // 2. Hàm helper để loại bỏ các giá trị falsy khỏi một object
  const removeFalsy = (obj: Record<string, any>) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => {
        // Giữ lại nếu giá trị là truthy (loại bỏ "", 0, false, null, undefined)
        // Nếu bạn MUỐN GIỮ LẠI số 0 hoặc false, hãy đổi thành: value !== null && value !== undefined && value !== ""
        return Boolean(value)
      })
    )
  }

  // 3. Lọc sạch các param cơ bản (page, limit, sort, v.v...)
  const cleanRest = removeFalsy(rest)
  const payload: any = { ...cleanRest }

  // 4. Xử lý filters nếu có
  if (filters && Object.keys(filters).length > 0) {
    // Lọc sạch các trường falsy bên trong filters trước
    const cleanFilters = removeFalsy(filters)

    // Chỉ thêm vào payload nếu sau khi lọc, filters vẫn còn item
    if (Object.keys(cleanFilters).length > 0) {
      payload.filters = JSON.stringify(cleanFilters)
    }
  }

  // 5. Build query string
  return qs.stringify(payload, {
    encodeValuesOnly: true,
    skipNulls: true,
  })
}
