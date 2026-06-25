import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFilters } from "@/hooks/use-filters"
import { useFindAllStores } from "@/hooks/apis/inventory/use-store"
import {
  LABEL_HEADQUARTER,
  VALUE_HEADQUARTER,
} from "@/shared/constants/team.constant"

export function StoreSelect() {
  const { setFilters, filters } = useFilters<{
    store: string
  }>()
  const safeFilters = filters as { store: string }
  const storeId = safeFilters.store || VALUE_HEADQUARTER

  const { data } = useFindAllStores()
  const stores = data?.metadata?.data || []

  const dataOptions = [
    { label: LABEL_HEADQUARTER, value: VALUE_HEADQUARTER },
    ...stores.map((s) => ({ label: s.name, value: s.id })),
  ]

  function onValueChange(value: string) {
    setFilters({ store: value })
  }

  return (
    <Select onValueChange={onValueChange} value={storeId}>
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
