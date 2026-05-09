import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFindAllStores } from "@/hooks/use-store"
import { VALUE_COMPANY_ROOT } from "@/shared/constants/team.constant"
import { useEffect } from "react"

export function StoreSelect({
  onValueChange,
  onLabelChange, // Thêm prop này
  value,
}: {
  onValueChange: (val: string) => void
  onLabelChange?: (label: string) => void
  value: string
}) {
  const { data } = useFindAllStores()
  const stores = data?.metadata || []

  const dataOptions = [
    { label: "Công ty (Tổng)", value: VALUE_COMPANY_ROOT },
    ...stores.map((s) => ({ label: s.name, value: s.id })),
  ]

  // Cập nhật label ra bên ngoài khi value thay đổi
  useEffect(() => {
    const selected = dataOptions.find((opt) => opt.value === value)
    if (selected && onLabelChange) {
      onLabelChange(selected.label)
    }
  }, [value, stores])

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-70">
        <SelectValue placeholder="Chọn cửa hàng / chi nhánh" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {dataOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
