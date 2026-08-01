import { LocationRegionType } from "@/shared/enums/location-region-type.enum"
import { IBase } from "../../common/base.interface"

export type NominatimGeoJSON =
  | {
      type: "Point"
      coordinates: [number, number] // [lng, lat]
    }
  | {
      type: "LineString" | "MultiPoint"
      coordinates: [number, number][]
    }
  | {
      type: "Polygon" | "MultiLineString"
      coordinates: [number, number][][] // Tọa độ Vùng (Polygon)
    }
  | {
      type: "MultiPolygon"
      coordinates: [number, number][][][] // Tọa độ Đa Vùng (MultiPolygon)
    }

export interface NominatimSearchResult {
  place_id: number
  licence: string
  osm_type: "node" | "way" | "relation" | string
  osm_id: number

  // Bounding box format [south, north, west, east]
  boundingbox: [string, string, string, string]

  lat: string
  lon: string
  display_name: string
  class: string
  type: string
  importance: number
  icon?: string

  // Trường quan trọng nhất khi truyền param polygon_geojson=1
  geojson?: NominatimGeoJSON
}

export type NominatimSearchResponse = NominatimSearchResult[]

export type Position = [longitude: number, latitude: number]

export interface ILocationRegion extends IBase {
  name: string
  type: LocationRegionType
  parent: ILocationRegion | null
  area?: NominatimGeoJSON

  //
  children?: ILocationRegion[]
}
