import { QueryDto } from "@/shared/dtos/common/query.dto"
import qs from "qs"

export function generateQueryParams(params: QueryDto): string {
  const { filters, ...rest } = params

  // Tạo một object mới để gửi đi
  const payload: any = { ...rest }

  // Chỉ thêm filters vào nếu nó có dữ liệu thực sự
  if (filters && Object.keys(filters).length > 0) {
    // Chuyển object {store: 'abc'} thành chuỗi '{"store":"abc"}'
    payload.filters = JSON.stringify(filters)
  }

  return qs.stringify(payload, {
    encodeValuesOnly: true,
    skipNulls: true, // Loại bỏ các giá trị null/undefined
  })
}
