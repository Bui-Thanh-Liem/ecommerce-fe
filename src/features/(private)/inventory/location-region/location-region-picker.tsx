"use client"
import { toast } from "sonner"
import L from "leaflet"
import { useDebounce } from "@/hooks/use-debounce"
import { MapRef } from "react-leaflet/MapContainer"
import { useState, useRef, useEffect } from "react"
import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from "react-leaflet"
import {
  NominatimGeoJSON,
  NominatimSearchResponse,
} from "@/shared/interfaces/models/inventory/location-region.interface"
import "@geoman-io/leaflet-geoman-free"

export function LocationRegionPicker({
  name,
  onSave,
}: {
  name: string | undefined
  onSave: (districtData: { name: string; boundary: NominatimGeoJSON }) => void
}) {
  const nameDebounced = useDebounce(name, 800) || ""
  const [polygonGeometry, setPolygonGeometry] = useState<NominatimGeoJSON | null>(null)

  const featureGroupRef = useRef(null)
  const mapRef = useRef<MapRef>(null)

  const initGeoman = () => {
    const map = mapRef.current
    if (!map) return

    map.pm.addControls({
      position: "topleft",
      drawMarker: false,
      drawPolyline: false,
      drawCircle: false,
      drawCircleMarker: false,
      drawRectangle: true,
      drawPolygon: true,
      editMode: true,
      dragMode: true,
      removalMode: true,
    })

    map.on("pm:create", (e) => {
      const layer = e.layer as L.Polygon
      const geoJson = layer.toGeoJSON()
      setPolygonGeometry(geoJson.geometry as NominatimGeoJSON)
    })
  }

  const handleFetchBoundary = async () => {
    if (!nameDebounced.trim()) return

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=${encodeURIComponent(nameDebounced)}`
      )
      const data = (await response.json()) as NominatimSearchResponse

      if (data && data.length > 0) {
        const resultWithBoundary =
          data.find(
            (item) => item.geojson && (item.geojson.type === "Polygon" || item.geojson.type === "MultiPolygon")
          ) || data[0]

        if (resultWithBoundary.geojson) {
          const geojson = resultWithBoundary.geojson
          setPolygonGeometry(geojson)

          // CONVERT STRING SANG FLOAT ---
          if (mapRef.current && resultWithBoundary.boundingbox) {
            const bbox = resultWithBoundary.boundingbox
            const south = parseFloat(bbox[0])
            const north = parseFloat(bbox[1])
            const west = parseFloat(bbox[2])
            const east = parseFloat(bbox[3])

            // Leaflet fitBounds nhận dạng [[south, west], [north, east]]
            const bounds: L.LatLngBoundsExpression = [
              [south, west],
              [north, east],
            ]

            // Tự động di chuyển góc nhìn bản đồ bao trọn Vùng
            mapRef.current.fitBounds(bounds, {
              padding: [20, 20], // Thêm padding cho dễ nhìn
              animate: true,
            })

            //
            onSave({
              boundary: geojson,
              name: resultWithBoundary.display_name,
            })
          }
        } else {
          toast.info("Tìm thấy địa điểm nhưng không có dữ liệu Ranh giới vùng!")
        }
      } else {
        toast.info("Không tìm thấy ranh giới vùng này!")
      }
    } catch (err) {
      toast.error("Lỗi khi lấy ranh giới vùng: " + (err as Error).message)
    }
  }

  // Effect fetch dữ liệu khi nameDebounced thay đổi
  useEffect(() => {
    if (nameDebounced) {
      ;(async () => {
        await handleFetchBoundary()
      })()
    }
  }, [nameDebounced])

  // TỰ ĐỘNG ZOOM VÀO GEOJSON KHI POLYGON THAY ĐỔI VỚI L.geoJSON
  useEffect(() => {
    if (mapRef.current && polygonGeometry) {
      try {
        const geoJsonLayer = L.geoJSON(polygonGeometry as any)
        const bounds = geoJsonLayer.getBounds()

        if (bounds.isValid()) {
          mapRef.current.fitBounds(bounds, {
            padding: [30, 30],
            animate: true,
          })
        }
      } catch (e) {
        console.error("Không thể fitBounds cho Polygon này", e)
      }
    }
  }, [polygonGeometry])

  return (
    <div className="m-0 mx-auto max-w-[50vw]">
      <div className="h-[60vh] w-[50vw] overflow-hidden rounded-lg border border-gray-300">
        <MapContainer
          zoom={13}
          ref={mapRef}
          whenReady={initGeoman}
          center={[10.7769, 106.7009]}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <FeatureGroup ref={featureGroupRef} />

          {polygonGeometry && (
            <GeoJSON
              data={polygonGeometry}
              key={JSON.stringify(polygonGeometry)}
              style={{ color: "#ff2d55", weight: 3, fillColor: "#ff2d55", fillOpacity: 0.2 }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  )
}
