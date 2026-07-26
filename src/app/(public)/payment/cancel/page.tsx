import Link from "next/link"
import {
  AlertCircle,
  ShoppingBag,
  CreditCard,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  Truck,
  ShieldCheck,
} from "lucide-react"

// Giả lập dữ liệu đơn hàng bị hủy thanh toán
const mockCancelledOrder = {
  orderId: "ORD-89210-VN",
  totalAmount: 1450000,
  itemCount: 3,
  itemsPreview: ["Áo Phông Cotton Premium (x2)", "Giày Sneaker RunFast (x1)"],
}

export default function PaymentCancelledPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-6">
        {/* HEADER: Thông báo hủy giao dịch */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <AlertCircle className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Thanh toán đã bị hủy
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Bạn đã hủy quá trình thanh toán. Đơn hàng của bạn hiện chưa được xác
            nhận.
          </p>

          {/* Nhắc nhở lưu giỏ hàng */}
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3.5 text-left">
            <ShoppingBag className="h-5 w-5 flex-shrink-0 text-blue-600" />
            <p className="text-xs text-blue-800">
              <span className="font-semibold">Đừng lo!</span> Các sản phẩm trong
              đơn vẫn được giữ trong giỏ hàng của bạn. Bạn có thể tiếp tục thanh
              toán bất cứ lúc nào.
            </p>
          </div>
        </div>

        {/* DETAILS: Tóm tắt đơn hàng đang chờ */}
        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
              Mã đơn tạm: {mockCancelledOrder.orderId}
            </span>
            <span className="text-sm font-bold text-indigo-600">
              {formatCurrency(mockCancelledOrder.totalAmount)}
            </span>
          </div>

          <div className="space-y-1.5 text-sm">
            <p className="text-xs font-medium text-gray-500">
              Sản phẩm trong đơn ({mockCancelledOrder.itemCount}):
            </p>
            <ul className="space-y-1 border-l-2 border-gray-200 pl-2 text-xs text-gray-700">
              {mockCancelledOrder.itemsPreview.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* ALTERNATIVE OPTIONS: Chuyển hướng sang COD hoặc Thử lại */}
        <div className="space-y-3">
          {/* Nút ưu tiên 1: Tiếp tục thanh toán / Đổi phương thức */}
          <Link
            href="/checkout"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            <CreditCard className="h-4 w-4" /> Hoàn tất thanh toán đơn hàng này
          </Link>

          {/* Nút ưu tiên 2: Chuyển sang COD (Nếu họ ngại chuyển khoản/thẻ) */}
          <Link
            href="/checkout?method=cod"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-100"
          >
            <Truck className="h-4 w-4 text-emerald-600" /> Đổi sang Thanh toán
            khi nhận hàng (COD)
          </Link>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <Link
              href="/cart"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 text-gray-500" /> Sửa giỏ hàng
            </Link>

            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Tiếp tục mua sắm <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* TRUST BADGES */}
        <div className="flex items-center justify-center gap-6 pt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-gray-400" /> Bảo mật 100%
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4 text-gray-400" /> Hỗ trợ 24/7
          </span>
        </div>
      </div>
    </div>
  )
}
