"use client"
import { Button } from "@/components/ui/button"
import { ICustomerAddress } from "@/shared/interfaces/models/customer/customer-address.interface"
import L, { LatLngExpression } from "leaflet"
import { X } from "lucide-react"
import React from "react"
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet"
import { toast } from "sonner"

interface AddressMapProps {
  address: ICustomerAddress
  cb: (address: ICustomerAddress) => void
}

// Chỉ cấu hình icon lỗi của Leaflet khi đang ở môi trường Client (Browser)
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
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
        toast.success("Đã chọn vị trí này!")
      } catch (error) {
        console.error("Lỗi khi lấy địa chỉ:", error)
      }
    },
  })
  return null
}

// Component hiển thị vị trí hiện tại của người dùng
function LocationMarker({
  setAddressInfo,
}: {
  setAddressInfo: (info: { address: string; lat: number; lng: number }) => void
}) {
  const [position, setPosition] = React.useState<L.LatLng | null>(null)
  const [loading, setLoading] = React.useState(false)

  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
    locationerror() {
      toast.warning("Không thể truy cập vị trí của bạn. Vui lòng cấp quyền.")
    },
  })

  React.useEffect(() => {
    map.locate()
  }, [map])

  // Hàm xử lý lấy địa chỉ từ vị trí GPS hiện tại
  const handleSelectCurrentLocation = async () => {
    if (!position) return
    setLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.lat}&lon=${position.lng}&accept-language=vi`
      )
      const data = await response.json()

      // Gọi callback để truyền thông tin ra ngoài
      setAddressInfo({
        address: data.display_name || "Vị trí hiện tại",
        lat: position.lat,
        lng: position.lng,
      })
      toast.success("Đã chọn vị trí hiện tại!")
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ:", error)
      toast.error("Không thể lấy thông tin địa chỉ từ vị trí này.")
    } finally {
      setLoading(false)
    }
  }

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <div className="space-y-2 text-center">
          <p className="font-semibold">Bạn đang ở đây !</p>
          <Button size="sm" disabled={loading} onClick={handleSelectCurrentLocation}>
            {loading ? "Đang xử lý..." : "Lấy vị trí này"}
          </Button>
        </div>
      </Popup>
    </Marker>
  )
}

const handleGetLocation = (map: L.Map) => {
  if (!navigator.geolocation) {
    toast.warning("Trình duyệt của bạn không hỗ trợ định vị.")
    return
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      map.flyTo([latitude, longitude], 15)
    },
    () => {
      toast.warning("Không thể lấy vị trí. Hãy kiểm tra cài đặt quyền truy cập.")
    }
  )
}

export function AddressMap({ address, cb }: AddressMapProps) {
  const [map, setMap] = React.useState<L.Map | null>(null)
  const [selectedInfo, setSelectedInfo] = React.useState<{
    address: string
    lat: number
    lng: number
  } | null>(null)

  const center: LatLngExpression = [10.8231, 106.6297] // TP.HCM mặc định

  //
  const dynamicStoreIcon = L.icon({
    iconUrl: "/images/dmx.jpg",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
    className: "rounded-full border-2 border-white object-cover bg-white shadow-md",
  })
  const position: LatLngExpression = [address?.lat || 0, address?.lng || 0]

  // Tạo icon đỏ tĩnh cho marker click chọn vị trí
  const redIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

  //
  function handleSetAddressInfo(info: { address: string; lat: number; lng: number } | null) {
    setSelectedInfo(info)
    cb({
      ...address,
      address: info?.address || "",
      lat: info?.lat || 0,
      lng: info?.lng || 0,
    })
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {selectedInfo && (
        <div className="absolute top-4 left-12 z-1000 max-w-sm space-y-3 rounded-xl bg-white p-4 shadow-md">
          <p className="text-sm">{selectedInfo.address}</p>
          <p className="text-xs text-gray-500">
            Coordinates: {selectedInfo.lat.toFixed(5)}, {selectedInfo.lng.toFixed(5)}
          </p>
          <Button size="sm" className="w-full" variant="destructive" onClick={() => handleSetAddressInfo(null)}>
            Hủy
          </Button>
        </div>
      )}

      <button
        onClick={() => map && handleGetLocation(map)}
        className="absolute right-10 bottom-10 z-1000 rounded-full bg-blue-500 p-3 text-white shadow-lg hover:bg-blue-600"
      >
        📍 Vị trí hiện tại
      </button>

      <MapContainer zoom={13} center={center} ref={setMap} style={{ height: "calc(100vh - 380px)", width: "100%" }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker setAddressInfo={handleSetAddressInfo} />
        <ClickHandler setAddressInfo={handleSetAddressInfo} />

        {selectedInfo && (
          <Marker position={[selectedInfo.lat, selectedInfo.lng]} icon={redIcon}>
            <Popup>
              <span className="font-bold text-red-500">Vị trí đã chọn:</span>
              <br />
              {selectedInfo.address}
            </Popup>
          </Marker>
        )}

        <Marker position={position} icon={dynamicStoreIcon} />
      </MapContainer>
    </div>
  )
}
