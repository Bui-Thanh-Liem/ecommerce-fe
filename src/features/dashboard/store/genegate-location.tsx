import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFindAllLocationRegions } from "@/hooks/use-location-region"
import {
  CreateStoreSchema,
  UpdateStoreSchema,
} from "@/shared/dtos/req/store.dto"
import { LocationRegionType } from "@/shared/enums/location-region-type.enum"
import { Controller, UseFormReturn } from "react-hook-form"
import z from "zod"

type FormValues =
  | z.infer<typeof CreateStoreSchema>
  | z.infer<typeof UpdateStoreSchema>

export function GenerateLocation({
  form,
}: {
  form: UseFormReturn<FormValues>
}) {
  //
  const countryId = form.watch("country")
  const provinceCityId = form.watch("provinceCity")
  const districtId = form.watch("districtTown")

  const { data: c } = useFindAllLocationRegions({
    filters: {
      type: LocationRegionType.COUNTRY,
    },
  })
  const countries = c?.metadata?.data || []

  const { data: p } = useFindAllLocationRegions({
    filters: {
      type: LocationRegionType.PROVINCE_CITY,
      parent: countryId as any,
    },
  })
  const provincesCities = p?.metadata?.data || []
  console.log("Provinces/Cities:", provincesCities)

  const { data: d } = useFindAllLocationRegions({
    filters: {
      type: LocationRegionType.DISTRICT_TOWN,
      parent: provinceCityId as any,
    },
  })
  const districtsTowns = d?.metadata?.data || []

  const { data: w } = useFindAllLocationRegions({
    filters: {
      type: LocationRegionType.WARD_COMMUNE,
      parent: districtId as any,
    },
  })
  const wardsCommunes = w?.metadata?.data || []

  return (
    <>
      <FieldGroup>
        <Controller
          name="country"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-country">Country</FieldLabel>

                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                    size="sm"
                    id="form-country"
                  >
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent align="end" className="z-3000">
                    <SelectGroup>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id}>
                          {country.name}
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
          name="provinceCity"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-province-city">
                  Province/City
                </FieldLabel>

                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                    size="sm"
                    id="form-province-city"
                  >
                    <SelectValue placeholder="Select a province/city" />
                  </SelectTrigger>
                  <SelectContent align="end" className="z-3000">
                    <SelectGroup>
                      {provincesCities.map((provinceCity) => (
                        <SelectItem
                          key={provinceCity.id}
                          value={provinceCity.id}
                        >
                          {provinceCity.name}
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
          name="districtTown"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-district-town">
                  District/Town
                </FieldLabel>

                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                    size="sm"
                    id="form-district-town"
                  >
                    <SelectValue placeholder="Select a district/town" />
                  </SelectTrigger>
                  <SelectContent align="end" className="z-3000">
                    <SelectGroup>
                      {districtsTowns.map((districtTown) => (
                        <SelectItem
                          key={districtTown.id}
                          value={districtTown.id}
                        >
                          {districtTown.name}
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
          name="wardCommune"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-ward-commune">
                  Ward/Commune
                </FieldLabel>

                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                    size="sm"
                    id="form-ward-commune"
                  >
                    <SelectValue placeholder="Select a ward/commune" />
                  </SelectTrigger>
                  <SelectContent align="end" className="z-3000">
                    <SelectGroup>
                      {wardsCommunes.map((wardCommune) => (
                        <SelectItem key={wardCommune.id} value={wardCommune.id}>
                          {wardCommune.name}
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
    </>
  )
}
