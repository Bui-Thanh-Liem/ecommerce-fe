"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { Smartphone } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function LoginPage() {
  const router = useRouter()

  const [isPhoneForm, setIsPhoneForm] = useState(true)

  function handlePhoneFormSuccess() {
    setIsPhoneForm(false)
  }

  function handleOtpFormSuccess() {
    setIsPhoneForm(true)
    router.replace("/")
  }

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2"></div>
      <div className="col-span-8 flex h-[calc(100vh-150px)] items-center justify-center gap-x-20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 500"
          className="mx-auto h-auto w-auto"
        >
          <defs>
            {/* Đổ bóng mờ ở phía chân đế */}
            <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="100%" stopColor="#111111" stopOpacity="0.15" />
            </linearGradient>

            {/* Hiệu ứng mờ dần (Fade) cho danh sách sản phẩm ở đáy điện thoại */}
            <linearGradient id="phoneContentFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="70%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* ================= 1. BACKGROUND BLOB & RIBBON ================= */}
          {/* Dải ruy băng màu xanh nhạt phía sau */}
          <path
            d="M150,360 C200,320 250,320 300,330 L300,380 C250,370 200,370 150,410 Z"
            fill="#D9E2FC"
          />
          <path
            d="M650,270 C700,290 750,330 800,370 L800,320 C750,280 700,240 650,220 Z"
            fill="#D9E2FC"
          />

          {/* Khối Blob nền lớn màu trắng xám */}
          <path
            d="M320,310 C260,300 240,400 320,430 C380,450 430,470 500,450 C620,420 780,450 780,310 C780,180 620,230 550,210 C480,190 400,230 320,310 Z"
            fill="#EAEAEA"
            className="opacity-70"
          />

          {/* Bóng mờ gradient dưới đáy */}
          <rect
            x="270"
            y="390"
            width="410"
            height="60"
            fill="url(#bottomFade)"
          />

          {/* Họa tiết hình học bay xung quanh */}
          <circle
            cx="230"
            cy="210"
            r="12"
            fill="none"
            stroke="#5C7A99"
            strokeWidth="4"
          />
          <path
            d="M320,350 Q330,330 340,350 T360,350"
            fill="none"
            stroke="#4A2E80"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <polygon
            points="630,190 650,195 640,215"
            fill="none"
            stroke="#D96670"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <line
            x1="630"
            y1="280"
            x2="645"
            y2="305"
            stroke="#E5A967"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="320"
            y1="255"
            x2="340"
            y2="250"
            stroke="#E59380"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Đường dashLine từ túi bay vào điện thoại */}
          <path
            d="M290,160 Q340,110 390,170"
            fill="none"
            stroke="#444444"
            strokeWidth="2"
            strokeDasharray="5,5"
            className="opacity-60"
          />

          {/* ================= 2. SMARTPHONE CONTAINER ================= */}
          <g id="smartphone">
            {/* Khung máy màu xanh cyan */}
            <rect
              x="370"
              y="100"
              width="230"
              height="370"
              rx="25"
              fill="#57D3F3"
            />
            {/* Màn hình bên trong */}
            <rect
              x="380"
              y="115"
              width="210"
              height="355"
              rx="15"
              fill="#EBF9FE"
            />

            {/* Thanh tìm kiếm / Header giả */}
            <rect
              x="395"
              y="140"
              width="50"
              height="10"
              rx="5"
              fill="#57D3F3"
            />
            <rect x="455" y="142" width="35" height="6" rx="3" fill="#BCEAF7" />
            <rect x="495" y="142" width="35" height="6" rx="3" fill="#BCEAF7" />
            <rect x="535" y="142" width="35" height="6" rx="3" fill="#BCEAF7" />

            {/* Nội dung danh sách sản phẩm (Bọc trong thẻ g để áp dụng mask/fade về sau nếu muốn) */}
            <g id="product-list">
              {/* Item 1 */}
              <rect
                x="390"
                y="165"
                width="190"
                height="65"
                rx="8"
                fill="#FFFFFF"
              />
              <rect
                x="402"
                y="175"
                width="45"
                height="45"
                rx="5"
                fill="#FFA3D1"
              />
              <path
                d="M402,210 L415,195 L428,208 L435,200 L447,215 Z"
                fill="#E070A6"
              />{" "}
              {/* Núi giả lập trong ảnh */}
              <rect
                x="460"
                y="178"
                width="100"
                height="6"
                rx="3"
                fill="#57D3F3"
              />
              <rect
                x="460"
                y="192"
                width="70"
                height="5"
                rx="2.5"
                fill="#A8ECFC"
              />
              <rect
                x="460"
                y="202"
                width="50"
                height="5"
                rx="2.5"
                fill="#A8ECFC"
              />
              {/* Item 2 */}
              <rect
                x="390"
                y="240"
                width="190"
                height="65"
                rx="8"
                fill="#FFFFFF"
              />
              <rect
                x="402"
                y="250"
                width="45"
                height="45"
                rx="5"
                fill="#FFA3D1"
              />
              <path
                d="M402,285 L415,270 L428,283 L435,275 L447,290 Z"
                fill="#E070A6"
              />
              <rect
                x="460"
                y="253"
                width="100"
                height="6"
                rx="3"
                fill="#57D3F3"
              />
              <rect
                x="460"
                y="267"
                width="70"
                height="5"
                rx="2.5"
                fill="#A8ECFC"
              />
              <rect
                x="460"
                y="277"
                width="50"
                height="5"
                rx="2.5"
                fill="#A8ECFC"
              />
              {/* Item 3 */}
              <rect
                x="390"
                y="315"
                width="190"
                height="65"
                rx="8"
                fill="#FFFFFF"
              />
              <rect
                x="402"
                y="325"
                width="45"
                height="45"
                rx="5"
                fill="#FFA3D1"
              />
              <path
                d="M402,360 L415,345 L428,358 L435,350 L447,365 Z"
                fill="#E070A6"
              />
              <rect
                x="460"
                y="328"
                width="100"
                height="6"
                rx="3"
                fill="#57D3F3"
              />
              <rect
                x="460"
                y="342"
                width="70"
                height="5"
                rx="2.5"
                fill="#A8ECFC"
              />
              <rect
                x="460"
                y="352"
                width="50"
                height="5"
                rx="2.5"
                fill="#A8ECFC"
              />
              {/* Item 4 (Mờ dần ở đáy) */}
              <rect
                x="390"
                y="390"
                width="190"
                height="65"
                rx="8"
                fill="#FFFFFF"
              />
              <rect
                x="402"
                y="400"
                width="45"
                height="45"
                rx="5"
                fill="#FFA3D1"
                className="opacity-50"
              />
              <rect
                x="460"
                y="403"
                width="100"
                height="6"
                rx="3"
                fill="#57D3F3"
                className="opacity-50"
              />
              <rect
                x="460"
                y="417"
                width="70"
                height="5"
                rx="2.5"
                fill="#A8ECFC"
                className="opacity-50"
              />
            </g>

            {/* Lớp che mờ màu trắng phủ lên đáy điện thoại */}
            <rect
              x="380"
              y="380"
              width="210"
              height="90"
              fill="url(#phoneContentFade)"
              pointerEvents="none"
            />
          </g>

          {/* ================= 3. SHOPPING BAGS (TOP LEFT) ================= */}
          <g id="shopping-bags">
            {/* Túi màu cam phía sau */}
            <g transform="translate(330, 85) rotate(10)">
              <path d="M10,20 L35,20 L40,70 L5,70 Z" fill="#E5A967" />
              <path
                d="M15,20 C15,5 30,5 30,20"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3"
              />
            </g>
            {/* Túi màu xanh phía trước */}
            <g transform="translate(300, 105) rotate(-5)">
              <path d="M5,25 L40,25 L45,75 L10,75 Z" fill="#5C7A99" />
              <path
                d="M18,25 C18,10 28,10 28,25"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3"
              />
              <ellipse
                cx="25"
                cy="50"
                rx="8"
                ry="12"
                fill="#475E75"
                className="opacity-40"
              />
            </g>
          </g>

          {/* ================= 4. CREDIT CARD (BOTTOM RIGHT) ================= */}
          {/* Thẻ tín dụng nằm đè lên góc phải điện thoại */}
          <g id="credit-card" transform="translate(530, 310) rotate(15)">
            {/* Thân thẻ màu vàng đồng nhạt */}
            <rect x="0" y="0" width="130" height="80" rx="10" fill="#F4CF9B" />
            {/* Đường sọc của thẻ */}
            <rect x="0" y="45" width="130" height="15" fill="#D3A66B" />
            {/* Chip hoặc hình tròn trang trí trên thẻ */}
            <circle cx="25" cy="25" r="10" fill="#D3A66B" />
          </g>

          {/* Họa tiết giỏ hàng nhỏ rớt ở góc dưới bên trái */}
          <g transform="translate(290, 390) rotate(-20)" className="opacity-80">
            <rect x="0" y="0" width="30" height="25" rx="5" fill="#E5A967" />
            <circle cx="15" cy="12" r="5" fill="#FFFFFF" />
          </g>
        </svg>
        <Card className="mr-54 text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Đăng nhập</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {isPhoneForm ? (
              <PhoneForm onSuccess={handlePhoneFormSuccess} />
            ) : (
              <OtpForm onSuccess={handleOtpFormSuccess} />
            )}
            <CardDescription>
              Nhấn “Tiếp tục” đồng nghĩa với việc bạn cho phép hệ thống gửi tin
              nhắn xác thực đến số điện thoại trên
            </CardDescription>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-2"></div>
    </div>
  )
}

function OtpForm({ onSuccess }: { onSuccess?: () => void }) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Giả lập thành công sau 1 giây
    setTimeout(() => {
      if (onSuccess) onSuccess()
    }, 1000)
  }

  return (
    <form className="flex flex-col items-center space-y-4">
      <Field className="w-fit">
        <InputOTP
          id="digits-only"
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          autoFocus
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
      <Button onClick={handleSubmit}>Tiếp tục</Button>
    </form>
  )
}

function PhoneForm({ onSuccess }: { onSuccess?: () => void }) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Giả lập thành công sau 1 giây
    setTimeout(() => {
      if (onSuccess) onSuccess()
    }, 1000)
  }

  return (
    <form className="flex flex-col items-center space-y-4">
      <InputGroup className="w-62 text-center">
        <InputGroupAddon align="inline-start">
          <Smartphone />
        </InputGroupAddon>
        <InputGroupInput
          type="tel"
          id="input-group-url"
          placeholder="Số điện thoại"
        />
      </InputGroup>
      <Button onClick={handleSubmit}>Tiếp tục</Button>
    </form>
  )
}
