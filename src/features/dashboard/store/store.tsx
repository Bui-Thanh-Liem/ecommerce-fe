"use client"
import dynamic from "next/dynamic"
import L, { LatLngExpression } from "leaflet"
import { useFindAllStores } from "@/hooks/use-store"
import { IStore } from "@/shared/interfaces/models/store.interface"
import Image from "next/image"

delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

export function StorePage() {
  const { data } = useFindAllStores()
  const stores = data?.metadata || []
  return <StoreMap stores={stores} />
}

// Dynamic import để tránh lỗi SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
})

function StoreMap({ stores }: { stores: IStore[] }) {
  const center: LatLngExpression = [10.8231, 106.6297] // TP.HCM mặc định

  return (
    <MapContainer
      zoom={13}
      center={center}
      style={{ height: "calc(100vh - 120px)", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {stores.map((store) => {
        const position: LatLngExpression = [store.lat, store.lng]
        const open = [store.closingHours, store.openingHours]
        const provinceCity = store.provinceCity?.name || "N/A"
        const districtTown = store.districtTown?.name || "N/A"
        const wardCommune = store.wardCommune?.name || "N/A"
        const phone = store.phone || "N/A"

        return (
          <Marker key={store.id} position={position}>
            <Popup>
              {store.imageUrl && (
                <Image
                  alt={store.name}
                  src={store.imageUrl}
                  style={{ width: "100%", height: "auto" }}
                />
              )}
              <br />
              <strong>{store.name}</strong>
              <br />
              {store.address}
              <br />
              <span>
                {open[0]} - {open[1]}
              </span>
              <br />
              <span>
                {wardCommune}, {districtTown}, {provinceCity}
              </span>
              <br />
              <span>
                {phone.map((p) => `${p.name}: ${p.phone}`).join(", ")}
              </span>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
