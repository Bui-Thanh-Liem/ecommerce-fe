"use client"
import { Button } from "@/components/ui/button"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useFindAllStaffs } from "@/hooks/apis/use-staff"
import { useCreateStore, useUpdateStore } from "@/hooks/apis/use-store"
import { useUploadCloudinary } from "@/hooks/apis/use-upload-cloudinary"
import {
  CreateStoreSchema,
  UpdateStoreSchema,
} from "@/shared/dtos/req/store.dto"
import { Provider } from "@/shared/enums/provider.enum"
import { IImage } from "@/shared/interfaces/common/image.interface"
import { IStore } from "@/shared/interfaces/models/store.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImageIcon, Plus, Trash2, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { GenerateLocation } from "./generate-location"

const initFormValue: z.infer<typeof CreateStoreSchema> = {
  country: "",
  provinceCity: "",
  districtTown: "",
  wardCommune: "",
  address: "",
  lat: 0,
  lng: 0,
  isActive: true,
  name: "",
  image: {
    url: "",
    key: "",
    provider: Provider.LOCAL,
  },
  openingHours: "08:00:00",
  closingHours: "20:00:00",
  phone: [
    {
      name: "",
      phone: "",
    },
  ],
  manager: "",
}

export function StoreAction({
  open,
  onClose,
  dataEdit,
  initialData,
  onOpenChange: setOpen,
}: {
  open?: boolean
  onClose?: () => void
  dataEdit: IStore | null
  initialData?: IStore | null
  onOpenChange?: (open: boolean) => void
}) {
  const createApi = useCreateStore()
  const updateApi = useUpdateStore()
  const uploadApi = useUploadCloudinary()

  const { data: s } = useFindAllStaffs()
  const staffs = s?.metadata?.data || []

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [isPending, setIsPending] = useState(false)

  //
  const formSchema = !!dataEdit ? UpdateStoreSchema : CreateStoreSchema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initFormValue,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "phone", // Tên field trong schema
  })

  // Hàm xử lý khi chọn file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file) // Tạo link preview tạm thời
      setPreviewUrl(url)
    }
  }

  //
  useEffect(() => {
    if (dataEdit) {
      form.reset({
        country: dataEdit.country.id,
        name: dataEdit.name,
        provinceCity: dataEdit.provinceCity.id,
        districtTown: dataEdit.districtTown.id,
        wardCommune: dataEdit.wardCommune.id,
        address: dataEdit.address,
        lat: dataEdit.lat,
        lng: dataEdit.lng,
        isActive: dataEdit.isActive,
        openingHours: dataEdit.openingHours,
        closingHours: dataEdit.closingHours,
        phone: dataEdit.phone,
        manager: dataEdit.manager.id,
        image: dataEdit.image,
      })
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(dataEdit.image?.url || "")
    } else {
      form.reset(initFormValue)
      setPreviewUrl("")
    }
  }, [dataEdit, form])

  //
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        openingHours: initFormValue.openingHours,
        closingHours: initFormValue.closingHours,
        country: initialData.country?.id,
        provinceCity: initialData.provinceCity?.id,
        districtTown: initialData.districtTown?.id,
        wardCommune: initialData.wardCommune?.id,
        manager: initialData.manager?.id,
      })
    }
  }, [form, initialData])

  //
  const handleOpenChange = (open: boolean) => {
    setOpen?.(open)
    if (!open) {
      onClose?.() // Gọi onClose khi dialog đóng (overlay click, esc, hoặc nút close)
      setPreviewUrl("")
      setSelectedFile(null)
      form.reset(initFormValue)
    }
  }

  //
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsPending(true)
    try {
      let image: IImage | undefined = dataEdit?.image

      // 1. Nếu có file được chọn, tiến hành upload lên S3/Cloudinary
      if (selectedFile) {
        const res = await uploadApi.mutateAsync({
          payload: { folder: "stores" },
          file: selectedFile,
        })

        if (res.url && res.public_id) {
          image = {
            url: res.url,
            key: res.public_id,
            provider: Provider.CLOUDINARY,
          }
        }
      }

      if (!image) {
        toast.error("Image is required. Please select an image to upload.")
        return
      }

      // 2. Gán link cloudinary mới vào data để gửi lên API
      let res = null
      if (dataEdit) {
        res = await updateApi.mutateAsync({
          id: dataEdit.id,
          payload: {
            ...data,
            image: image,
          },
        })
      } else {
        res = await createApi.mutateAsync({
          ...data,
          image: image,
        } as z.infer<typeof CreateStoreSchema>)
      }

      if (res && [200, 201].includes(res?.statusCode)) {
        onClose?.()
        form.reset()
        setSelectedFile(null)
        setPreviewUrl("")
      }
    } catch (error) {
      toast.error(
        "Error saving store. Please try again. " +
          (error instanceof Error ? error.message : "")
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="z-2000 sm:max-w-4xl">
        <DialogHeaderAction
          title={!!dataEdit ? "Edit Store" : "Add New Store"}
          desc={`Fill in the details to ${!!dataEdit ? "update" : "create"} a new store.`}
        />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-h-[calc(100vh-340px)] space-y-6 overflow-x-hidden overflow-y-auto px-1"
        >
          <div className="grid grid-cols-2 gap-x-6">
            <div className="space-y-6">
              <FieldGroup>
                <Controller
                  name="isActive"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="form-isActive">Active</FieldLabel>
                        <Switch
                          id="form-isActive"
                          checked={field.value} // RHF lưu giá trị boolean
                          onCheckedChange={field.onChange} // Cập nhật lại giá trị vào RHF
                          aria-invalid={fieldState.invalid}
                        />
                      </div>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-name">
                        Name
                      </FieldLabel>
                      <Input
                        {...field}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Name"
                        autoComplete="name"
                        id="form-rhf-input-name"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <div className="flex justify-between gap-x-2">
                <FieldGroup>
                  <Controller
                    name="openingHours"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-input-openingHours">
                          Opening Hours
                        </FieldLabel>
                        <Input
                          {...field}
                          type="time"
                          aria-invalid={fieldState.invalid}
                          placeholder="Opening Hours"
                          autoComplete="opening-hours"
                          id="form-rhf-input-openingHours"
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
                    name="closingHours"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-input-closingHours">
                          Closing Hours
                        </FieldLabel>
                        <Input
                          {...field}
                          type="time"
                          aria-invalid={fieldState.invalid}
                          placeholder="Closing Hours"
                          autoComplete="closing-hours"
                          id="form-rhf-input-closingHours"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>

              <FieldGroup>
                <Controller
                  name="manager"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-manager">Manager</FieldLabel>

                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                            size="sm"
                            id="form-manager"
                          >
                            <SelectValue placeholder="Select a manager" />
                          </SelectTrigger>
                          <SelectContent align="end" className="z-3000">
                            <SelectGroup>
                              {staffs.map((staff) => (
                                <SelectItem key={staff.id} value={staff.id}>
                                  {staff.fullName}
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

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FieldLabel>Phone Numbers</FieldLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: "", phone: "" })}
                    disabled={fields.length >= 5} // Giới hạn tối đa 5 số
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Phone ({fields.length}/5)
                  </Button>
                </div>

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-x-2">
                      <div className="grid flex-1 grid-cols-2 gap-2">
                        {/* Tên định danh (VD: Hotline, CSKH) */}
                        <Controller
                          name={`phone.${index}.name`}
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <Input
                                {...field}
                                placeholder="Label (e.g. Hotline)"
                                aria-invalid={fieldState.invalid}
                              />
                            </Field>
                          )}
                        />
                        {/* Số điện thoại */}
                        <Controller
                          name={`phone.${index}.phone`}
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <Input
                                {...field}
                                placeholder="Phone number"
                                aria-invalid={fieldState.invalid}
                              />
                            </Field>
                          )}
                        />
                      </div>

                      {/* Nút xóa (chỉ hiện nếu có nhiều hơn 1 số hoặc cho phép xóa hết) */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1} // Giữ lại ít nhất 1 số nếu cần
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {/* Hiển thị lỗi chung cho mảng phone nếu có (ví dụ lỗi validate schema) */}
                  {form.formState.errors.phone?.root && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.phone.root.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <FieldGroup>
                <FieldLabel htmlFor="form-rhf-input-store-image">
                  Store Image
                </FieldLabel>
                <div className="mt-2 flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-4">
                  {previewUrl ? (
                    <div className="relative h-40 w-full overflow-hidden rounded-md border">
                      <Image
                        fill
                        alt="Preview"
                        src={previewUrl}
                        className="h-full w-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7"
                        onClick={() => {
                          setSelectedFile(null)
                          setPreviewUrl("")
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-4 text-center">
                      <ImageIcon className="text-muted-foreground/50 h-10 w-10" />
                      <p className="text-muted-foreground mt-2 text-sm">
                        Click or drag to select image
                      </p>
                    </div>
                  )}

                  <Input
                    type="file"
                    accept="image/*"
                    className="cursor-pointer"
                    onChange={handleFileChange}
                    id="form-rhf-input-store-image"
                  />
                </div>
              </FieldGroup>

              <GenerateLocation form={form} />

              <FieldGroup>
                <Controller
                  name="address"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-address">
                        Address
                      </FieldLabel>
                      <Textarea
                        {...field}
                        rows={2}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter address here..."
                        id="form-rhf-textarea-address"
                        className="resize-none"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <div className="flex justify-between gap-x-6">
                <FieldGroup>
                  <Controller
                    name="lat"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-input-lat">
                          Latitude
                        </FieldLabel>
                        <Input
                          {...field}
                          type="text"
                          aria-invalid={fieldState.invalid}
                          placeholder="Latitude"
                          autoComplete="latitude"
                          id="form-rhf-input-lat"
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
                    name="lng"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-input-lng">
                          Longitude
                        </FieldLabel>
                        <Input
                          {...field}
                          type="text"
                          aria-invalid={fieldState.invalid}
                          placeholder="Longitude"
                          autoComplete="longitude"
                          id="form-rhf-input-lng"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>
            </div>
          </div>

          <DialogFooterAction onClose={onClose} isPending={isPending} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
