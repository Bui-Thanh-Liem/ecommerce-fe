import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFilters } from "@/hooks/use-filters"
import { useFindAllStores } from "@/hooks/use-store"
import {
  LABEL_COMPANY_ROOT,
  VALUE_COMPANY_ROOT,
} from "@/shared/constants/team.constant"

export function StoreSelect() {
  const { setFilters } = useFilters<{
    store: string
  }>()

  const { data } = useFindAllStores()
  const stores = data?.metadata || []

  const dataOptions = [
    { label: LABEL_COMPANY_ROOT, value: VALUE_COMPANY_ROOT },
    ...stores.map((s) => ({ label: s.name, value: s.id })),
  ]

  function onValueChange(value: string) {
    setFilters({ store: value })
  }

  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="w-70">
        <SelectValue placeholder="Select a store" />
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
