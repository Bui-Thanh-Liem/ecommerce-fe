import * as React from "react"
import { Controller } from "react-hook-form"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { CustomCombobox } from "../ui/custom-combobox"
import { SelectInFormProps } from "@/shared/interfaces/common/props-select-in-form.interface"
import { useFindOptionsRoles } from "@/hooks/apis/management/use-role"
import { IRole } from "@/shared/interfaces/models/management/role.interface"

export function RoleSelectInForm({
  form,
  max = 5,
  name = "roles",
  label = "Roles",
  multiple = false,
}: SelectInFormProps) {
  //
  const [searchTerm, setSearchTerm] = React.useState("")

  //
  const { data, isLoading } = useFindOptionsRoles({
    filters: { name: searchTerm },
  })
  const rolesData = data?.metadata?.data || []

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
  const comboboxOptions = rolesData.map((role: IRole) => ({
    value: role.id,
    label: role.name,
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
              placeholder={multiple ? "Select roles..." : "Select a role..."}
              searchPlaceholder="Search role name..."
              emptyMessage="No roles found."
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
