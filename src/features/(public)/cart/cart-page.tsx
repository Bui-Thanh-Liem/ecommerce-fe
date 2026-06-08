import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CartPage() {
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2"></div>
      <div className="col-span-8 h-[calc(100vh-300px)]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 500"
          className="mx-auto h-auto w-full max-w-2xl"
        >
          {/* 1. NỀN BLOB PHÍA SAU */}
          <path
            fill="#E2E7F5"
            className="opacity-60"
            d="M190,120 C110,130 130,280 160,350 C180,400 130,440 220,460 C350,490 600,470 700,460 C780,450 710,310 730,250 C750,180 610,190 530,160 C460,130 490,60 380,80 C290,95 250,110 190,120 Z"
          />

          {/* Đường gạch chân đế */}
          <line
            x1="150"
            y1="465"
            x2="630"
            y2="465"
            stroke="#7B889B"
            strokeWidth="3"
            strokeLinecap="round"
            className="opacity-70"
          />
          <line
            x1="645"
            y1="465"
            x2="680"
            y2="465"
            stroke="#7B889B"
            strokeWidth="3"
            strokeLinecap="round"
            className="opacity-70"
          />

          {/* 2. ĐỒNG HỒ TREO TƯỜNG */}
          <circle
            cx="570"
            cy="235"
            r="35"
            fill="#E2E7F5"
            className="opacity-80"
          />
          <line
            x1="570"
            y1="235"
            x2="570"
            y2="215"
            stroke="#7B889B"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="570"
            y1="235"
            x2="585"
            y2="250"
            stroke="#7B889B"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* 3. TỦ VÀ CHẬU CÂY BÊN TRÁI */}
          {/* Chân tủ */}
          <path d="M235,435 L245,465 L260,465 L255,435 Z" fill="#BCC4D1" />
          {/* Thân tủ */}
          <rect
            x="215"
            y="285"
            width="220"
            height="150"
            fill="#F4F6FA"
            stroke="#D2D7E2"
            strokeWidth="2"
          />
          <line
            x1="325"
            y1="285"
            x2="325"
            y2="435"
            stroke="#D2D7E2"
            strokeWidth="2"
          />
          <line
            x1="325"
            y1="305"
            x2="435"
            y2="305"
            stroke="#D2D7E2"
            strokeWidth="2"
          />
          <circle cx="380" cy="295" r="3" fill="#A3AEBF" />

          {/* Chậu cây */}
          <path
            d="M250,242 L290,242 L282,285 L258,285 Z"
            fill="#A3AEBF"
            className="opacity-80"
          />
          {/* Các lá cây */}
          <path
            d="M270,242 C260,210 235,215 235,230 C235,245 260,240 270,242 Z"
            fill="#A3AEBF"
          />
          <path
            d="M270,242 C270,180 285,175 290,200 C292,220 275,235 270,242 Z"
            fill="#A3AEBF"
          />
          <path
            d="M270,242 C290,210 320,210 315,225 C310,240 285,240 270,242 Z"
            fill="#A3AEBF"
          />

          {/* 4. GIỎ HÀNG CHÍNH */}
          <g id="shopping-basket">
            {/* Bóng đổ của giỏ */}
            <ellipse
              cx="420"
              cy="467"
              rx="100"
              ry="6"
              fill="#7B889B"
              className="opacity-30"
            />

            {/* Thân giỏ xám */}
            <path
              d="M315,360 L525,360 L510,465 C510,470 500,472 495,472 L345,472 C340,472 330,470 325,465 Z"
              fill="#CBD5E1"
            />

            {/* Khối bóng đổ bên phải thân giỏ */}
            <path
              d="M485,360 L525,360 L510,465 C510,470 500,472 495,472 L470,472 Z"
              fill="#94A3B8"
              className="opacity-50"
            />

            {/* 5 lỗ dọc màu trắng */}
            <rect
              x="350"
              y="380"
              width="12"
              height="60"
              rx="6"
              fill="#FFFFFF"
            />
            <rect
              x="382"
              y="380"
              width="12"
              height="65"
              rx="6"
              fill="#FFFFFF"
            />
            <rect
              x="414"
              y="380"
              width="12"
              height="65"
              rx="6"
              fill="#FFFFFF"
            />
            <rect
              x="446"
              y="380"
              width="12"
              height="65"
              rx="6"
              fill="#FFFFFF"
            />
            <rect
              x="478"
              y="380"
              width="12"
              height="60"
              rx="6"
              fill="#FFFFFF"
            />

            {/* Vành giỏ màu xanh dương */}
            <rect
              x="300"
              y="335"
              width="240"
              height="26"
              rx="8"
              fill="#3B82F6"
            />

            {/* Quai giỏ bên trái */}
            <g id="left-handle">
              <rect
                x="350"
                y="290"
                width="18"
                height="95"
                rx="9"
                fill="#EAB308"
                transform="rotate(-30 350 290)"
              />
              <circle cx="363" cy="348" r="5" fill="#FFFFFF" />
            </g>

            {/* Quai giỏ bên phải */}
            <g id="right-handle">
              <rect
                x="472"
                y="300"
                width="18"
                height="95"
                rx="9"
                fill="#EAB308"
                transform="rotate(30 472 300)"
              />
              <circle cx="477" cy="348" r="5" fill="#FFFFFF" />
            </g>
          </g>
        </svg>
        <div className="space-y-2 text-center">
          <p className="font-bold">Giỏ hàng trống</p>
          <p className="text-gray-400">Không có sản phẩm nào trong giỏ hàng</p>
          <Link href="/">
            <Button className="mt-4 w-62" size="lg">
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      </div>
      <div className="col-span-2"></div>
    </div>
  )
}
