import { LocationRegionType } from "@/shared/enums/location-region-type.enum"

export function generateTypeByParent(type: LocationRegionType) {
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
