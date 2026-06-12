import * as React from "react"
import { Controller } from "react-hook-form"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { CustomCombobox } from "../ui/custom-combobox"
import { SelectInFormProps } from "@/shared/interfaces/common/props-select-in-form.interface"
import { useFindOptionsInventories } from "@/hooks/apis/inventory/use-inventory"
import { IInventory } from "@/shared/interfaces/models/inventory/inventory.interface"

export function InventorySelectInForm({
  form,
  max = 5,
  name = "inventories",
  label = "Inventories",
  multiple = false,
}: SelectInFormProps) {
  //
  const [searchTerm, setSearchTerm] = React.useState("")

  //
  const { data, isLoading } = useFindOptionsInventories({
    filters: { name: searchTerm },
  })
  const inventoriesData = data?.metadata?.data || []

  //
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  //
  const handleSearchChange = (text: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      setSearchTerm(text)
    }, 400) // 400ms debounce time
  }

  // Dọn dẹp timeout nếu component unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Khớp định dạng data đầu vào cho Combobox
  const comboboxOptions = inventoriesData.map((inventory: IInventory) => ({
    value: inventory.id,
    label: inventory.store.name + " - " + inventory.productVariant.sku,
  }))

  return (
    <FieldGroup>
      <Controller
        name={name}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>{label}</FieldLabel>

            <CustomCombobox
              options={comboboxOptions}
              value={field.value}
              onChange={field.onChange}
              multiple={multiple}
              maxItems={max}
              placeholder={
                multiple ? "Select inventories..." : "Select an inventory..."
              }
              searchPlaceholder="Search inventory name..."
              emptyMessage="No inventories found."
              onSearchChange={handleSearchChange}
              isLoading={isLoading}
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  )
}
