"use client"
import dynamic from "next/dynamic"
import L, { LatLngExpression } from "leaflet"
import { IStore } from "@/shared/interfaces/models/store.interface"
import Image from "next/image"
import { useMapEvents } from "react-leaflet"
import React from "react"
import { Clock, PencilIcon, Phone, Trash2, User, X } from "lucide-react"
import { Active } from "@/components/active"
import { Button } from "@/components/ui/button"

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
  // shadowUrl:
  //   "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [35, 35], // Kích thước icon [rộng, cao]
  iconAnchor: [17, 35], // Điểm của icon sẽ đặt chính xác vào tọa độ (thường là dưới cùng giữa)
  popupAnchor: [0, -35], // Điểm mà popup sẽ hiện ra so với iconAnchor
  className: "rounded-full border-2 border-white", // Thêm lớp CSS để làm tròn và viền trắng
})

interface StoreMapProps {
  stores: IStore[]
  onCreate?: (store: IStore) => void
  onEdit?: (store: IStore) => void
  onDelete?: (store: IStore) => void
}

//
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
          <Button
            onClick={() => onCreate && onCreate({ ...selectedInfo } as IStore)}
          >
            Add Store
          </Button>
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
        style={{ height: "calc(100vh - 180px)", width: "100%" }}
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

          const opening = store.openingHours?.slice(0, 5) || "08:00"
          const closing = store.closingHours?.slice(0, 5) || "20:00"

          const country = store.country?.name || "N/A"
          const province = store.provinceCity?.name || "N/A"
          const district = store.districtTown?.name || "N/A"
          const ward = store.wardCommune?.name || "N/A"

          return (
            <Marker key={store.id} position={position} icon={storeIcon}>
              <Popup
                className="custom-popup"
                minWidth={320}
                maxWidth={420}
                closeButton={false}
              >
                <div className="space-y-3">
                  {/* Image */}
                  {store.imageUrl && (
                    <Image
                      // width={400}
                      // height={300}
                      src={store.imageUrl}
                      alt={store.name}
                      className="h-auto w-full rounded-lg object-cover"
                    />
                  )}

                  {/* Thông tin chính */}
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
                    <p className="text-muted-foreground mt-1 text-sm">
                      {store.address}
                    </p>
                  </div>

                  {/* Giờ mở cửa */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">
                      <Clock size={20} />
                    </span>
                    <span>
                      <strong>{opening}</strong> - <strong>{closing}</strong>
                    </span>
                  </div>

                  {/* Địa chỉ hành chính */}
                  <div className="text-muted-foreground text-sm">
                    {country}, {ward}, {district}, {province}
                  </div>

                  {/* Số điện thoại */}
                  {store.phone && store.phone.length > 0 && (
                    <div className="space-y-1 text-sm">
                      {store.phone.map((p: any, index: number) => (
                        <a
                          key={index}
                          href={`tel:${p.phone}`}
                          className="hover:text-primary flex items-center gap-2 transition-colors"
                        >
                          <Phone size={20} /> {p.name ? `${p.name}: ` : ""}
                          <span className="font-medium">{p.phone}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Quản lý */}
                  {store.manager && (
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <User size={20} /> Quản lý:{" "}
                      <span className="text-foreground font-medium">
                        {store.manager.fullName}
                      </span>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
