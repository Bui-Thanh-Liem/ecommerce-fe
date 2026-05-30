import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
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
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useFindOptionsCampaigns } from "@/hooks/apis/use-campaign"
import { useFindOptionsLocationRegions } from "@/hooks/apis/use-location-region"
import { useFindOptionsProductVariants } from "@/hooks/apis/use-product-variant"
import {
  useCreatePromotion,
  useUpdatePromotion,
} from "@/hooks/apis/use-promotion"
import { useFindOptionsStores } from "@/hooks/apis/use-store"
import { useUploadCloudinary } from "@/hooks/apis/use-upload-cloudinary"

import {
  CreatePromotionSchema,
  UpdatePromotionSchema,
} from "@/shared/dtos/req/promotion.dto"
import { PromotionApplyScope } from "@/shared/enums/promotion-apply-scope.enum"
import { PromotionApplyType } from "@/shared/enums/promotion-apply-type.enum"
import { Provider } from "@/shared/enums/provider.enum"
import { IImage } from "@/shared/interfaces/common/image.interface"
import { IPromotion } from "@/shared/interfaces/models/promotion.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const initFormValue: z.infer<typeof CreatePromotionSchema> = {
  campaign: "",
  name: "",
  image: undefined,
  isActive: true,
  applyType: PromotionApplyType.CATEGORY,
  applyScope: PromotionApplyScope.ALL,
  discountPercentage: 0,
  productHighlighted: [],
  limitQuantity: 0,
  stores: [],
  locations: [],
  productPromotions: [],
  categoryPromotions: [],
}

//
export function PromotionAction({
  open,
  onClose,
  dataEdit,
  initialData,
  onOpenChange: setOpen,
}: {
  open?: boolean
  onClose?: () => void
  dataEdit: IPromotion | null
  initialData?: IPromotion | null
  onOpenChange?: (open: boolean) => void
}) {
  const pvAnchor = useComboboxAnchor()
  const storeAnchor = useComboboxAnchor()
  const locationAnchor = useComboboxAnchor()
  const ppAnchor = useComboboxAnchor()
  const cpAnchor = useComboboxAnchor()

  const createApi = useCreatePromotion()
  const updateApi = useUpdatePromotion()
  const uploadApi = useUploadCloudinary()

  const { data: productVariantsData } = useFindOptionsProductVariants()
  const productVariants = productVariantsData?.metadata?.data || []
  const { data: campaignsData } = useFindOptionsCampaigns()
  const campaigns = campaignsData?.metadata?.data || []
  const { data: storesData } = useFindOptionsStores()
  const stores = storesData?.metadata?.data || []
  const { data: locationRegionsData } = useFindOptionsLocationRegions()
  const locationRegions = locationRegionsData?.metadata?.data || []

  // Quản lý danh sách ảnh hiển thị (bao gồm cả ảnh cũ từ API lẫn ảnh mới upload)
  // Quản lý danh sách ảnh hiển thị (bao gồm cả ảnh cũ từ API lẫn ảnh mới upload)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPending, setIsPending] = useState(false)

  const formSchema = !!dataEdit ? UpdatePromotionSchema : CreatePromotionSchema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initFormValue,
  })

  // Theo dõi dữ liệu edit
  useEffect(() => {
    if (dataEdit) {
      form.reset({
        name: dataEdit.name,
        campaign: dataEdit.campaign.id,
        isActive: dataEdit.isActive,
        applyType: dataEdit.applyType,
        applyScope: dataEdit.applyScope,
        discountPercentage: dataEdit.discountPercentage,
        productHighlighted: dataEdit.productHighlighted?.map((p) => p.id) || [],
        limitQuantity: dataEdit.limitQuantity,
        stores: dataEdit.stores?.map((s) => s.id) || [],
        locations: dataEdit.locations?.map((l) => l.id) || [],
        productPromotions: dataEdit.productPromotions?.map((pp) => pp.id) || [],
        categoryPromotions:
          dataEdit.categoryPromotions?.map((cp) => cp.id) || [],
      })

      if (dataEdit.image) {
        const existingMainImage = dataEdit.image
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
        campaign: initialData.campaign.id,
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
      let image: IImage | undefined = dataEdit?.image

      if (selectedFile) {
        const res = await uploadApi.mutateAsync({
          payload: { folder: "promotion" },
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
        toast.error("Main image is required. Please select an image to upload.")
        return
      }

      let res = null
      if (dataEdit) {
        res = await updateApi.mutateAsync({
          id: dataEdit.id,
          payload: {
            ...data,
            image,
          },
        })
      } else {
        res = await createApi.mutateAsync({
          ...data,
          image,
        } as z.infer<typeof CreatePromotionSchema>)
      }

      if (res && [200, 201].includes(res?.statusCode)) {
        form.reset()
        onClose?.()
      }
    } catch (error) {
      console.error("Failed to process promotion:", error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeaderAction
          title={!!dataEdit ? "Edit Promotion" : "Add New Promotion"}
          desc={`Fill in the details to ${!!dataEdit ? "update" : "create"} a new promotion.`}
        />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-h-[calc(100vh-200px)] overflow-x-hidden overflow-y-auto px-1"
        >
          <div className="col-span-1 mb-2 space-y-6">
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

            {/*  */}
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
                name="campaign"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-campaign">Campaign</FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                          id="form-campaign"
                        >
                          <SelectValue placeholder="Select a campaign" />
                        </SelectTrigger>

                        <SelectContent align="end">
                          <SelectGroup>
                            {campaigns.map((campaign) => (
                              <SelectItem key={campaign.id} value={campaign.id}>
                                {campaign.name}
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

            <div className="grid grid-cols-2 gap-x-4">
              <FieldGroup>
                <Controller
                  name="applyType"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-apply-type">
                          Apply Type
                        </FieldLabel>

                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                            id="form-apply-type"
                          >
                            <SelectValue placeholder="Select an apply type" />
                          </SelectTrigger>

                          <SelectContent align="end">
                            <SelectGroup>
                              {Object.values(PromotionApplyType).map(
                                (applyType) => (
                                  <SelectItem key={applyType} value={applyType}>
                                    {applyType}
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
                  name="applyScope"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-apply-scope">
                          Apply Scope
                        </FieldLabel>

                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                            id="form-apply-scope"
                          >
                            <SelectValue placeholder="Select an apply scope" />
                          </SelectTrigger>

                          <SelectContent align="end">
                            <SelectGroup>
                              {Object.values(PromotionApplyScope).map(
                                (applyScope) => (
                                  <SelectItem
                                    key={applyScope}
                                    value={applyScope}
                                  >
                                    {applyScope}
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
            </div>

            <div className="grid grid-cols-2 gap-x-4">
              <FieldGroup>
                <Controller
                  name="discountPercentage"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-discount-percentage">
                        Discount Percentage
                      </FieldLabel>

                      <InputGroup>
                        <Input
                          {...field}
                          type="number"
                          aria-invalid={fieldState.invalid}
                          autoComplete="name"
                          placeholder="Discount Percentage"
                          onChange={(e) => {
                            const value = e.target.valueAsNumber

                            if (isNaN(value)) {
                              field.onChange(0) // Nếu không phải số, đặt về 0
                            } else if (value < 0) {
                              field.onChange(0) // Không cho nhập số âm
                            } else {
                              field.onChange(value)
                            }
                          }}
                          id="form-rhf-input-discount-percentage"
                        />

                        <InputGroupAddon align="inline-end">%</InputGroupAddon>
                      </InputGroup>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <FieldGroup>
                <Controller
                  name="limitQuantity"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-limit-quantity">
                        Limit Quantity
                      </FieldLabel>

                      <InputGroup>
                        <Input
                          {...field}
                          type="number"
                          aria-invalid={fieldState.invalid}
                          autoComplete="name"
                          placeholder="Limit Quantity"
                          onChange={(e) => {
                            const value = e.target.valueAsNumber

                            if (isNaN(value)) {
                              field.onChange(0) // Nếu không phải số, đặt về 0
                            } else if (value < 0) {
                              field.onChange(0) // Không cho nhập số âm
                            } else {
                              field.onChange(value)
                            }
                          }}
                          id="form-rhf-input-limit-quantity"
                        />

                        <InputGroupAddon align="inline-end">
                          item
                        </InputGroupAddon>
                      </InputGroup>

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
                name="productHighlighted"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-product-highlighted">
                      Highlighted Products
                    </FieldLabel>

                    <Combobox
                      multiple
                      autoHighlight
                      items={productVariants}
                      id="form-product-highlighted"
                      value={field.value || []}
                      onValueChange={(values) => {
                        if (values.length <= 10) {
                          field.onChange(values)
                        }
                      }}
                    >
                      <ComboboxChips ref={pvAnchor} className="w-full">
                        <ComboboxValue>
                          {(values: string[]) => (
                            <>
                              {values.map((value) => {
                                const productName = productVariants.find(
                                  (p) => p.id === value
                                )?.product?.name
                                return (
                                  <ComboboxChip key={value}>
                                    {productName || "Unknown Product"}
                                  </ComboboxChip>
                                )
                              })}
                              <ComboboxChipsInput placeholder="Select products..." />
                            </>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>

                      <ComboboxContent
                        anchor={pvAnchor}
                        className="pointer-events-auto"
                      >
                        <ComboboxEmpty>No products found.</ComboboxEmpty>
                        <ComboboxList>
                          {(
                            variant // ← dùng render prop
                          ) => (
                            <ComboboxItem key={variant.id} value={variant.id}>
                              {variant.product?.name}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="stores"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-stores">Stores</FieldLabel>

                    <Combobox
                      multiple
                      autoHighlight
                      items={stores}
                      id="form-stores"
                      value={field.value || []}
                      onValueChange={(values) => {
                        if (values.length <= 10) {
                          field.onChange(values)
                        }
                      }}
                    >
                      <ComboboxChips ref={storeAnchor} className="w-full">
                        <ComboboxValue>
                          {(values: string[]) => (
                            <>
                              {values.map((value) => {
                                const storeName = stores.find(
                                  (s) => s.id === value
                                )?.name
                                return (
                                  <ComboboxChip key={value}>
                                    {storeName || "Unknown Store"}
                                  </ComboboxChip>
                                )
                              })}
                              <ComboboxChipsInput placeholder="Select stores..." />
                            </>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>

                      <ComboboxContent
                        anchor={storeAnchor}
                        className="pointer-events-auto"
                      >
                        <ComboboxEmpty>No stores found.</ComboboxEmpty>
                        <ComboboxList>
                          {(
                            variant // ← dùng render prop
                          ) => (
                            <ComboboxItem key={variant.id} value={variant.id}>
                              {variant?.name}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="locations"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-locations">Locations</FieldLabel>

                    <Combobox
                      multiple
                      autoHighlight
                      items={locationRegions}
                      id="form-locations"
                      value={field.value || []}
                      onValueChange={(values) => {
                        if (values.length <= 10) {
                          field.onChange(values)
                        }
                      }}
                    >
                      <ComboboxChips ref={locationAnchor} className="w-full">
                        <ComboboxValue>
                          {(values: string[]) => (
                            <>
                              {values.map((value) => {
                                const locationName = locationRegions.find(
                                  (l) => l.id === value
                                )?.name
                                return (
                                  <ComboboxChip key={value}>
                                    {locationName || "Unknown Location"}
                                  </ComboboxChip>
                                )
                              })}
                              <ComboboxChipsInput placeholder="Select locations..." />
                            </>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>

                      <ComboboxContent
                        anchor={locationAnchor}
                        className="pointer-events-auto"
                      >
                        <ComboboxEmpty>No locations found.</ComboboxEmpty>
                        <ComboboxList>
                          {(
                            variant // ← dùng render prop
                          ) => (
                            <ComboboxItem key={variant.id} value={variant.id}>
                              {variant?.name}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>

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
