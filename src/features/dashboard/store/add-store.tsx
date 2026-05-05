"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useCreateStore } from "@/hooks/use-store"
import { CreateStoreSchema } from "@/shared/dtos/req/create-store.dto"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import z from "zod"
import { GenerateLocation } from "./genegate-location"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFindAllStaffs } from "@/hooks/use-staff"
import { ImageIcon, Plus, Trash2, X } from "lucide-react"
import Image from "next/image"

interface StoreAddProps {
  address: string
  lat: number
  lng: number
}

export function StoreAdd({ address, lat, lng }: StoreAddProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [open, setOpen] = useState(false)
  const createStoreApi = useCreateStore()

  const { data: s } = useFindAllStaffs()
  const staffs = s?.metadata || []

  const form = useForm<z.infer<typeof CreateStoreSchema>>({
    resolver: zodResolver(CreateStoreSchema),
    defaultValues: {
      provinceCity: undefined,
      districtTown: undefined,
      wardCommune: undefined,
      address: address || "",
      lat: lat || 0,
      lng: lng || 0,

      isActive: true,
      name: "",
      imageUrl: "",
      openingHours: "08:00:00",
      closingHours: "20:00:00",
      phone: [
        {
          name: "",
          phone: "",
        },
      ],
      manager: undefined,
    },
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
  async function onSubmit(data: z.infer<typeof CreateStoreSchema>) {
    try {
      let finalImageUrl = ""

      // 1. Nếu có file được chọn, tiến hành upload lên S3
      if (selectedFile) {
        // Giả sử bạn có hàm uploadToS3 đã viết ở câu trước
        finalImageUrl = await uploadToS3(selectedFile)
      }

      // 2. Gán link S3 vào data trước khi gửi cho backend
      const payload = {
        ...data,
        imageUrl: finalImageUrl,
      }

      const res = await createStoreApi.mutateAsync(payload)

      if (res?.statusCode === 201) {
        form.reset()
        setSelectedFile(null)
        setPreviewUrl("")
      }
    } catch (error) {
      console.error("Lỗi khi tạo cửa hàng:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add store with this address</Button>
      </DialogTrigger>
      <DialogContent className="z-2000 sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add Store</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new store.
          </DialogDescription>
        </DialogHeader>
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

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {createStoreApi.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Hàm giả định để upload file lên server/S3 của bạn
async function uploadToS3(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/upload", {
    // Thay bằng endpoint thật của bạn
    method: "POST",
    body: formData,
  })

  const data = await response.json()
  return data.url // Trả về link S3
}
