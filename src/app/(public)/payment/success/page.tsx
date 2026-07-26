import Link from "next/link"
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Download,
  HelpCircle,
  Copy,
  Calendar,
} from "lucide-react"

// Giả lập dữ liệu đơn hàng (Trong thực tế sẽ fetch từ API/URL params)
const mockOrder = {
  id: "ORD-89210-VN",
  date: "27/07/2026",
  estimatedDelivery: "29/07/2026 - 31/07/2026",
  paymentMethod: "Chuyển khoản QR (VNPay)",
  totalAmount: 1450000,
  shippingFee: 30000,
  discount: 50000,
  customer: {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901 234 567",
    address: "123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
  },
  items: [
    {
      id: 1,
      name: "Áo Phông Cotton Premium - Đen / L",
      price: 350000,
      quantity: 2,
      image: "https://via.placeholder.com/80",
    },
    {
      id: 2,
      name: "Giày Sneaker RunFast - Trắng / 42",
      price: 800000,
      quantity: 1,
      image: "https://via.placeholder.com/80",
    },
  ],
}

export default function PaymentSuccessPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const handleCopyOrderCode = () => {
    navigator.clipboard.writeText(mockOrder.id)
    alert("Đã sao chép mã đơn hàng!")
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* HEADER: Thắng lợi & Trạng thái */}
        <div className="rounded-4xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Thanh toán thành công!
          </h1>
          <p className="mt-2 text-gray-600">
            Cảm ơn bạn đã mua hàng. Xác nhận đơn hàng đã được gửi tới{" "}
            <span className="font-semibold text-gray-800">
              {mockOrder.customer.email}
            </span>
          </p>

          {/* Mã đơn hàng nhanh */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm">
            <span className="text-gray-500">Mã đơn hàng:</span>
            <span className="font-mono font-bold text-gray-900">
              {mockOrder.id}
            </span>
            <button
              onClick={handleCopyOrderCode}
              className="ml-1 text-gray-400 hover:text-gray-600"
              title="Sao chép"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* TIMELINE: Tiến trình đơn hàng */}
        <div className="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Truck className="h-5 w-5 text-indigo-600" /> Tiến trình giao hàng
          </h2>
          <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
            <div className="rounded-xl border border-green-100 bg-green-50 p-3">
              <span className="block text-xs font-semibold text-green-700">
                ĐÃ XÁC NHẬN
              </span>
              <span className="text-sm text-gray-600">{mockOrder.date}</span>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <span className="block text-xs font-semibold text-gray-500">
                ĐANG ĐÓNG GÓI
              </span>
              <span className="text-sm text-gray-600">Dự kiến hôm nay</span>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <span className="block text-xs font-semibold text-gray-500">
                DỰ KIẾN NHẬN HÀNG
              </span>
              <span className="mt-0.5 flex items-center justify-center gap-1 text-sm font-medium text-indigo-600">
                <Calendar className="h-3.5 w-3.5" />{" "}
                {mockOrder.estimatedDelivery}
              </span>
            </div>
          </div>
        </div>

        {/* DETAILS: Chi tiết sản phẩm & Tổng tiền */}
        <div className="overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Package className="h-5 w-5 text-indigo-600" /> Danh sách sản phẩm
            </h2>
          </div>

          <ul className="divide-y divide-gray-100 p-6">
            {mockOrder.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          {/* Bảng tính tổng tiền */}
          <div className="space-y-2 border-t border-gray-100 bg-gray-50 p-6 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính</span>
              <span>{formatCurrency(1500000)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí vận chuyển</span>
              <span>{formatCurrency(mockOrder.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Giảm giá</span>
              <span>-{formatCurrency(mockOrder.discount)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900">
              <span>Tổng thanh toán</span>
              <span className="text-indigo-600">
                {formatCurrency(mockOrder.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* INFO: Thông tin giao hàng */}
        <div className="grid grid-cols-1 gap-6 rounded-4xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
              Địa chỉ nhận hàng
            </h3>
            <p className="text-sm font-semibold text-gray-900">
              {mockOrder.customer.name}
            </p>
            <p className="text-sm text-gray-600">{mockOrder.customer.phone}</p>
            <p className="mt-1 text-sm text-gray-600">
              {mockOrder.customer.address}
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
              Phương thức thanh toán
            </h3>
            <p className="text-sm font-medium text-gray-900">
              {mockOrder.paymentMethod}
            </p>
            <p className="mt-1 text-xs font-medium text-green-600">
              ✓ Đã xác nhận thanh toán
            </p>
          </div>
        </div>

        {/* ACTIONS: Các nút điều hướng */}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Link
            href="/orders"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            Theo dõi đơn hàng <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Download className="h-4 w-4" /> Tải hóa đơn
          </button>

          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Tiếp tục mua sắm
          </Link>
        </div>

        {/* FOOTER SUPPORT */}
        <div className="pt-4 text-center">
          <p className="flex items-center justify-center gap-1 text-xs text-gray-500">
            <HelpCircle className="h-3.5 w-3.5" /> Gặp vấn đề với đơn hàng?{" "}
            <Link
              href="/support"
              className="text-indigo-600 underline hover:text-indigo-800"
            >
              Liên hệ CSKH
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
