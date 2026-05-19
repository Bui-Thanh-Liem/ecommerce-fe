"use client"
import { Active } from "@/components/active"
import { Button } from "@/components/ui/button"
import { IStore } from "@/shared/interfaces/models/store.interface"
import L, { LatLngExpression } from "leaflet"
import { Clock, MapPin, PencilIcon, Phone, Trash2, User, X } from "lucide-react"
import Image from "next/image"
import React from "react"
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet"

// Chỉ cấu hình icon lỗi của Leaflet khi đang ở môi trường Client (Browser)
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  })
}

// Component lắng nghe sự kiện click trên bản đồ
function ClickHandler({
  setAddressInfo,
}: {
  setAddressInfo: (info: { address: string; lat: number; lng: number }) => void
}) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=vi`
        )
        const data = await response.json()
        setAddressInfo({
          address: data.display_name,
          lat,
          lng,
        })
      } catch (error) {
        console.error("Lỗi khi lấy địa chỉ:", error)
      }
    },
  })
  return null
}

// Component hiển thị vị trí hiện tại của người dùng
function LocationMarker() {
  const [position, setPosition] = React.useState<L.LatLng | null>(null)

  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
    locationerror() {
      alert("Không thể truy cập vị trí của bạn. Vui lòng cấp quyền.")
    },
  })

  React.useEffect(() => {
    // Bây giờ map đã là một Leaflet Map instance xịn nên gọi .locate() thoải mái
    map.locate()
  }, [map])

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Bạn đang ở đây !</Popup>
    </Marker>
  )
}

const handleGetLocation = (map: L.Map) => {
  if (!navigator.geolocation) {
    alert("Trình duyệt của bạn không hỗ trợ định vị.")
    return
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      map.flyTo([latitude, longitude], 15)
    },
    () => {
      alert("Không thể lấy vị trí. Hãy kiểm tra cài đặt quyền truy cập.")
    }
  )
}

interface StoreMapProps {
  stores: IStore[]
  onCreate?: (store: IStore) => void
  onEdit?: (store: IStore) => void
  onDelete?: (store: IStore) => void
}

export function StoreMap({
  stores,
  onCreate,
  onEdit,
  onDelete,
}: StoreMapProps) {
  const [map, setMap] = React.useState<L.Map | null>(null)
  const [selectedInfo, setSelectedInfo] = React.useState<{
    address: string
    lat: number
    lng: number
  } | null>(null)

  const center: LatLngExpression = [10.8231, 106.6297] // TP.HCM mặc định

  // Tạo icon đỏ tĩnh cho marker click chọn vị trí
  const redIcon = L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {selectedInfo && (
        <div className="absolute top-4 left-12 z-1000 max-w-sm space-y-2 rounded-xl bg-white p-4 shadow-md">
          <X
            className="ml-auto cursor-pointer"
            onClick={() => setSelectedInfo(null)}
          />
          <p className="text-sm font-bold">Selected address:</p>
          <p className="text-sm">{selectedInfo.address}</p>
          <p className="text-xs text-gray-500">
            Coordinates: {selectedInfo.lat.toFixed(5)},{" "}
            {selectedInfo.lng.toFixed(5)}
          </p>
          <Button
            onClick={() => onCreate && onCreate({ ...selectedInfo } as IStore)}
          >
            Add Store
          </Button>
        </div>
      )}

      <button
        onClick={() => map && handleGetLocation(map)}
        className="absolute right-10 bottom-10 z-1000 rounded-full bg-blue-500 p-3 text-white shadow-lg hover:bg-blue-600"
      >
        📍 Vị trí hiện tại
      </button>

      <MapContainer
        zoom={13}
        center={center}
        ref={setMap}
        style={{ height: "calc(100vh - 180px)", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker />
        <ClickHandler setAddressInfo={setSelectedInfo} />

        {selectedInfo && (
          <Marker
            position={[selectedInfo.lat, selectedInfo.lng]}
            icon={redIcon}
          >
            <Popup>
              <span className="font-bold text-red-500">Vị trí đã chọn:</span>
              <br />
              {selectedInfo.address}
            </Popup>
          </Marker>
        )}

        {stores.map((store) => {
          const position: LatLngExpression = [store.lat, store.lng]
          const opening = store.openingHours?.slice(0, 5) || "08:00"
          const closing = store.closingHours?.slice(0, 5) || "20:00"

          // Khởi tạo icon động từ store image vô cùng mượt mà
          const dynamicStoreIcon = L.icon({
            iconUrl: store.image?.url || "/images/dmx.jpg",
            iconSize: [35, 35],
            iconAnchor: [17, 35],
            popupAnchor: [0, -35],
            className:
              "rounded-full border-2 border-white object-cover bg-white shadow-md",
          })

          return (
            <Marker key={store.id} position={position} icon={dynamicStoreIcon}>
              <Popup
                minWidth={320}
                maxWidth={420}
                closeButton={false}
                className="custom-popup rounded-2xl"
              >
                <div className="space-y-3">
                  {store.image?.url && (
                    <Image
                      width={400}
                      height={200}
                      alt={store.name}
                      src={store.image.url}
                      className="h-auto w-full rounded-lg object-cover"
                    />
                  )}

                  <div>
                    <h3 className="flex items-center gap-x-2 text-lg leading-tight font-semibold">
                      {store.name}
                      <Active isActive={store.isActive} />
                      <div className="ml-auto flex items-center gap-x-3">
                        <Button
                          variant="outline"
                          className="h-7 w-7 rounded-full"
                          onClick={() => onEdit && onEdit(store)}
                        >
                          <PencilIcon className="size-4" />
                        </Button>
                        <Button
                          variant="outline"
                          className="h-7 w-7 rounded-full text-red-400 hover:text-red-300"
                          onClick={() => onDelete && onDelete(store)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </h3>
                  </div>

                  <div className="text-muted-foreground text-sm">
                    {store.country?.name || "N/A"},{" "}
                    {store.wardCommune?.name || "N/A"},{" "}
                    {store.districtTown?.name || "N/A"},{" "}
                    {store.provinceCity?.name || "N/A"}
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span>
                      <Clock size={20} />
                    </span>
                    <span>
                      <strong>{opening}</strong> - <strong>{closing}</strong>
                    </span>
                  </div>

                  {store.phone && store.phone.length > 0 && (
                    <div className="space-y-1 text-sm">
                      {store.phone.map((p, index: number) => (
                        <a
                          key={index}
                          href={`tel:${p.phone}`}
                          className="flex items-center gap-2"
                        >
                          <Phone size={18} /> {p.name ? `${p.name}: ` : ""}
                          <span className="font-medium">{p.phone}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  {store.manager && (
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <User size={20} /> Quản lý:{" "}
                      <span className="text-foreground font-medium">
                        {store.manager.fullName}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <span>
                      <MapPin size={20} />
                    </span>
                    {store.address}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
