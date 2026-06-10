import * as React from "react"
import { Controller } from "react-hook-form"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { CustomCombobox } from "../ui/custom-combobox"
import { SelectInFormProps } from "@/shared/interfaces/common/props-select-in-form.interface"
import { useFindOptionsLocationRegions } from "@/hooks/apis/use-location-region"
import { ILocationRegion } from "@/shared/interfaces/models/location-region.interface"

export function LocationRegionSelectInForm({
  form,
  max = 5,
  name = "locationRegions",
  label = "Location Regions",
  multiple = false,
}: SelectInFormProps) {
  //
  const [searchTerm, setSearchTerm] = React.useState("")

  //
  const { data, isLoading } = useFindOptionsLocationRegions({
    filters: { name: searchTerm },
  })
  const locationRegionsData = data?.metadata?.data || []

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
  const comboboxOptions = locationRegionsData.map(
    (locationRegion: ILocationRegion) => ({
      value: locationRegion.id,
      label: locationRegion.name,
    })
  )

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
                multiple
                  ? "Select location regions..."
                  : "Select a location region..."
              }
              searchPlaceholder="Search location region name..."
              emptyMessage="No location regions found."
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
