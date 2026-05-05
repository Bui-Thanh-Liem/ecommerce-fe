"use client"
import dynamic from "next/dynamic"
import L, { LatLngExpression } from "leaflet"
import { IStore } from "@/shared/interfaces/models/store.interface"
import Image from "next/image"
import { useMapEvents } from "react-leaflet"
import React from "react"
import { StoreAdd } from "./add-store"
import { X } from "lucide-react"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

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

// Tạo icon màu đỏ bằng cách sử dụng CSS filter lên icon mặc định của Leaflet
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

// Component để lắng nghe sự kiện click trên bản đồ
function ClickHandler({
  setAddressInfo,
}: {
  setAddressInfo: (info: { address: string; lat: number; lng: number }) => void
}) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng

      try {
        // Gọi API của Nominatim (OpenStreetMap)
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

// Component để hiển thị vị trí hiện tại của người dùng
function LocationMarker() {
  const [position, setPosition] = React.useState<L.LatLng | null>(null)

  const map = useMapEvents({
    // Khi bản đồ đã tìm thấy vị trí
    locationfound(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom()) // Bay tới vị trí đó với hiệu ứng mượt
    },
    // Nếu người từ chối cho phép lấy vị trí
    locationerror() {
      alert("Không thể truy cập vị trí của bạn. Vui lòng cấp quyền.")
    },
  })

  // Chạy lệnh tìm kiếm ngay khi component mount
  React.useEffect(() => {
    map.locate()
  }, [map])

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Bạn đang ở đây !</Popup>
    </Marker>
  )
}

// Hàm để lấy vị trí hiện tại của người dùng khi bấm nút
const handleGetLocation = (map: L.Map) => {
  if (!navigator.geolocation) {
    alert("Trình duyệt của bạn không hỗ trợ định vị.")
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      map.flyTo([latitude, longitude], 15) // Nhảy tới vị trí với zoom 15
    },
    () => {
      alert("Không thể lấy vị trí. Hãy kiểm tra cài đặt quyền truy cập.")
    }
  )
}

// Tạo icon cho marker của cửa hàng
const storeIcon = L.icon({
  iconUrl: "/images/dmx.jpg", // Đường dẫn đến file ảnh trong thư mục public
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [35, 35], // Kích thước icon [rộng, cao]
  iconAnchor: [17, 35], // Điểm của icon sẽ đặt chính xác vào tọa độ (thường là dưới cùng giữa)
  popupAnchor: [0, -35], // Điểm mà popup sẽ hiện ra so với iconAnchor
})

//
export function StoreMap({ stores }: { stores: IStore[] }) {
  const [map, setMap] = React.useState<L.Map | null>(null)
  const [selectedInfo, setSelectedInfo] = React.useState<{
    address: string
    lat: number
    lng: number
  } | null>(null)
  const center: LatLngExpression = [10.8231, 106.6297] // TP.HCM mặc định

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Hiển thị địa chỉ vừa chọn ở một góc bản đồ */}
      {selectedInfo && (
        <div className="absolute top-4 left-12 z-1000 max-w-sm space-y-2 rounded-xl bg-white p-4 shadow-md">
          <X className="ml-auto" onClick={() => setSelectedInfo(null)} />
          <p className="text-sm font-bold">Selected address:</p>
          <p className="text-sm">{selectedInfo.address}</p>
          <p className="text-xs text-gray-500">
            Coordinates: {selectedInfo.lat.toFixed(5)},{" "}
            {selectedInfo.lng.toFixed(5)}
          </p>
          <StoreAdd
            address={selectedInfo.address}
            lat={selectedInfo.lat}
            lng={selectedInfo.lng}
          />
        </div>
      )}

      {/* Nút bấm lấy vị trí */}
      <button
        onClick={() => map && handleGetLocation(map)}
        className="absolute right-10 bottom-10 z-1000 rounded-full bg-blue-500 p-3 text-white shadow-lg hover:bg-blue-600"
      >
        📍 Vị trí hiện tại
      </button>

      <MapContainer
        zoom={13}
        center={center}
        ref={setMap} // Lấy instance của map ở đây
        style={{ height: "calc(100vh - 120px)", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Hiển thị vị trí hiện tại của người dùng */}
        <LocationMarker />

        {/* Component lắng nghe sự kiện click */}
        <ClickHandler setAddressInfo={setSelectedInfo} />

        {/* Hiển thị Marker tại vị trí vừa click */}
        {selectedInfo && (
          <Marker
            position={[selectedInfo.lat, selectedInfo.lng]}
            icon={redIcon} // Đổi thành màu đỏ ở đây
          >
            <Popup>
              <span style={{ color: "red", fontWeight: "bold" }}>
                Vị trí đã chọn:
              </span>{" "}
              <br />
              {selectedInfo.address}
            </Popup>
          </Marker>
        )}

        {/* Hiển thị các điểm cửa hàng */}
        {stores.map((store) => {
          const position: LatLngExpression = [store.lat, store.lng]
          const open = [store.closingHours, store.openingHours]
          const provinceCity = store.provinceCity?.name || "N/A"
          const districtTown = store.districtTown?.name || "N/A"
          const wardCommune = store.wardCommune?.name || "N/A"
          const phone = store.phone || "N/A"

          return (
            <Marker key={store.id} position={position} icon={storeIcon}>
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
    </div>
  )
}
