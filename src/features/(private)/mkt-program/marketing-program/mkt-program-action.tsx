import { Button } from "@/components/ui/button"
import { DatePickerTime } from "@/components/ui/date-time-picker"
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
import { Textarea } from "@/components/ui/textarea"
import {
  useCreateMktProgram,
  useUpdateMktProgram,
} from "@/hooks/apis/mkt-program/use-mkt-program"
import { useUploadCloudinary } from "@/hooks/apis/use-upload-cloudinary"
import {
  CreateMktProgramSchema,
  UpdateMktProgramSchema,
} from "@/shared/dtos/req/mkt-program.dto"
import { MarketingProgramStatus } from "@/shared/enums/marketing-program-status.enum"
import { Provider } from "@/shared/enums/provider.enum"
import { IImage } from "@/shared/interfaces/common/image.interface"
import { IMarketingProgram } from "@/shared/interfaces/models/mkt-program/marketing-program.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const initFormValue: z.infer<typeof CreateMktProgramSchema> = {
  name: "",
  desc: "",
  campaigns: [],
  endDate: new Date(),
  mainImage: undefined,
  startDate: new Date(),
  status: MarketingProgramStatus.DRAFT,
}

//
export function MktProgramAction({
  open,
  onClose,
  dataEdit,
  initialData,
  onOpenChange: setOpen,
}: {
  open?: boolean
  onClose?: () => void
  dataEdit: IMarketingProgram | null
  initialData?: IMarketingProgram | null
  onOpenChange?: (open: boolean) => void
}) {
  const createApi = useCreateMktProgram()
  const updateApi = useUpdateMktProgram()
  const uploadApi = useUploadCloudinary()

  // Quản lý danh sách ảnh hiển thị (bao gồm cả ảnh cũ từ API lẫn ảnh mới upload)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPending, setIsPending] = useState(false)

  const formSchema = !!dataEdit
    ? UpdateMktProgramSchema
    : CreateMktProgramSchema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initFormValue,
  })

  // Theo dõi dữ liệu edit
  useEffect(() => {
    if (dataEdit) {
      form.reset({
        name: dataEdit.name,
        desc: dataEdit.desc,
        status: dataEdit.status,
        mainImage: dataEdit.mainImage,
        startDate: new Date(dataEdit.startDate),
        endDate: new Date(dataEdit.endDate),
        campaigns: dataEdit?.campaigns?.map((cam) => cam.id),
      })

      if (dataEdit.mainImage) {
        const existingMainImage = dataEdit.mainImage
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPreviewUrl(existingMainImage.url)
      }
    }
  }, [dataEdit, form])

  // Theo dõi initialData
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initFormValue,
      })
    }
  }, [form, initialData])

  //
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl)
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  //
  const handleOpenChange = (open: boolean) => {
    setOpen?.(open)
    if (!open) {
      onClose?.() // Gọi onClose khi dialog đóng (overlay click, esc, hoặc nút close)
      form.reset(initFormValue)
      setPreviewUrl("")
      setSelectedFile(null)
    }
  }

  //
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsPending(true)

    try {
      // Lọc ra những img không có key (tức là ảnh preview)
      let mainImage: IImage | undefined = dataEdit?.mainImage

      if (selectedFile) {
        const res = await uploadApi.mutateAsync({
          payload: { folder: "mkt-program-main-image" },
          file: selectedFile,
        })

        if (res.url && res.public_id) {
          mainImage = {
            url: res.url,
            key: res.public_id,
            provider: Provider.CLOUDINARY,
          }
        }
      }

      if (!mainImage) {
        toast.error("Main image is required. Please select an image to upload.")
        return
      }

      let res = null
      if (dataEdit) {
        res = await updateApi.mutateAsync({
          id: dataEdit.id,
          payload: {
            ...data,
            mainImage,
          },
        })
      } else {
        res = await createApi.mutateAsync({
          ...data,
          mainImage,
        } as z.infer<typeof CreateMktProgramSchema>)
      }

      if (res && [200, 201].includes(res?.statusCode)) {
        form.reset()
        onClose?.()
      }
    } catch (error) {
      console.error("Failed to process marketing program:", error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeaderAction
          title={
            !!dataEdit ? "Edit Marketing Program" : "Add New Marketing Program"
          }
          desc={`Fill in the details to ${!!dataEdit ? "update" : "create"} a new marketing program.`}
        />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-h-[calc(100vh-200px)] overflow-x-hidden overflow-y-auto px-1"
        >
          <div className="col-span-1 mb-4 space-y-6">
            {/* Main Image */}
            <FieldGroup className="gap-y-3">
              <FieldLabel htmlFor="form-rhf-input-main-image">
                Main Image
              </FieldLabel>
              <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-4">
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
                  onChange={handleMainImageChange}
                  id="form-rhf-input-main-image"
                />
              </div>
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-name">Name</FieldLabel>
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

            <FieldGroup>
              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-status">Status</FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                          id="form-status"
                        >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>

                        <SelectContent align="end">
                          <SelectGroup>
                            {Object.values(MarketingProgramStatus).map(
                              (status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              )
                            )}
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
                name="startDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-start-date">
                      Start Date
                    </FieldLabel>

                    <DatePickerTime
                      id="form-rhf-input-start-date"
                      value={field.value}
                      onChange={field.onChange}
                      aria-invalid={fieldState.invalid}
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
                name="endDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-end-date">
                      End Date
                    </FieldLabel>

                    <DatePickerTime
                      id="form-rhf-input-end-date"
                      value={field.value}
                      onChange={field.onChange}
                      aria-invalid={fieldState.invalid}
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
                name="desc"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-desc">
                      Description
                    </FieldLabel>
                    <Textarea
                      {...field}
                      rows={2}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter description here..."
                      id="form-rhf-textarea-desc"
                      className="resize-none"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
          <DialogFooterAction onClose={onClose} isPending={isPending} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
