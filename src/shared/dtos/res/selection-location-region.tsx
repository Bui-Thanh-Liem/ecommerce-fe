import { ILocationRegion } from "@/shared/interfaces/models/inventory/location-region.interface"

export interface ISelectLocationRegion {
  wardCommune: ILocationRegion
  districtTown: ILocationRegion
  provinceCity: ILocationRegion
  country: ILocationRegion
  addressDetail: string
}
