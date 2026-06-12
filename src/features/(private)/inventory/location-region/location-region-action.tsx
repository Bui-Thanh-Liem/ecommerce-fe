import {
  Dialog,
  DialogContent,
  DialogFooterAction,
  DialogHeaderAction,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useCreateLocationRegion,
  useFindOptionsLocationRegions,
  useUpdateLocationRegion,
} from "@/hooks/apis/inventory/use-location-region"
import {
  CreateLocationRegionSchema,
  UpdateLocationRegionSchema,
} from "@/shared/dtos/req/location-region.dto"
import { LocationRegionType } from "@/shared/enums/location-region-type.enum"
import { ILocationRegion } from "@/shared/interfaces/models/inventory/location-region.interface"
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

const initFormValue: z.infer<typeof CreateLocationRegionSchema> = {
  name: "",
  parent: "",
  type: LocationRegionType.COUNTRY,
}

function generateTypeByParent(type: LocationRegionType) {
  switch (type) {
    case LocationRegionType.ROOT:
      return [{ label: "Country", value: LocationRegionType.COUNTRY }]
    case LocationRegionType.COUNTRY:
      return [
        { label: "Province/City", value: LocationRegionType.PROVINCE_CITY },
      ]
    case LocationRegionType.PROVINCE_CITY:
      return [
        { label: "District/Town", value: LocationRegionType.DISTRICT_TOWN },
      ]
    case LocationRegionType.DISTRICT_TOWN:
      return [{ label: "Ward/Commune", value: LocationRegionType.WARD_COMMUNE }]
    default:
      return []
  }
}

export function LocationRegionAction({
  open,
  onClose,
  dataEdit,
  initialData,
  onOpenChange: setOpen,
}: {
  open?: boolean
  onClose?: () => void
  dataEdit: ILocationRegion | null
  initialData?: ILocationRegion | null
  onOpenChange?: (open: boolean) => void
}) {
  const createApi = useCreateLocationRegion()
  const updateApi = useUpdateLocationRegion()
  const { data } = useFindOptionsLocationRegions()
  const locations = data?.metadata?.data || []

  //
  const formSchema = !!dataEdit
    ? UpdateLocationRegionSchema
    : CreateLocationRegionSchema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initFormValue,
  })

  //
  useEffect(() => {
    if (dataEdit) {
      form.reset({
        name: dataEdit.name || "",
        parent: dataEdit.parent?.id || "",
        type: dataEdit.type || LocationRegionType.COUNTRY,
      })
    } else {
      form.reset(initFormValue)
    }
  }, [dataEdit, form])

  //
  useEffect(() => {
    if (initialData) {
      const parent = initialData.parent
      if (!parent) return

      form.reset({
        ...initFormValue,
        parent: parent?.id,
        type: generateTypeByParent(parent.type)[0].value,
      })
    }
  }, [form, initialData])

  //
  const handleOpenChange = (open: boolean) => {
    setOpen?.(open)
    if (!open) {
      onClose?.() // Gọi onClose khi dialog đóng (overlay click, esc, hoặc nút close)
    }
  }

  //
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      let res = null
      if (dataEdit) {
        res = await updateApi.mutateAsync({
          id: dataEdit.id,
          payload: data,
        })
      } else {
        res = await createApi.mutateAsync(
          data as z.infer<typeof CreateLocationRegionSchema>
        )
      }

      if (res && [200, 201].includes(res?.statusCode)) {
        form.reset()
        onClose?.()
      }
    } catch (error) {
      console.error("Failed to create location region:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeaderAction
          title={
            !!dataEdit ? "Edit Location Region" : "Add New Location Region"
          }
          desc={`Fill in the details to ${!!dataEdit ? "update" : "create"} a new location region.`}
        />

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="parent"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-parent">
                      Parent location
                    </FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                        id="form-parent"
                      >
                        <SelectValue placeholder="Select a store" />
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectGroup>
                          {locations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Enter name..."
                    autoComplete="name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="type"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Type</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.values(LocationRegionType).map((t) => (
                          <SelectItem key={t} value={t}>
                            {t.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooterAction
            onClose={onClose}
            isPending={createApi.isPending || updateApi.isPending}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}
