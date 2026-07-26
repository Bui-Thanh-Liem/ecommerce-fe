import Link from "next/link"
import {
  XCircle,
  RotateCcw,
  HelpCircle,
  ArrowLeft,
  ShieldAlert,
  PhoneCall,
} from "lucide-react"

// Giả lập dữ liệu lỗi trả về từ Payment Gateway (VNPAY, Momo, Stripe...)
const mockErrorData = {
  orderId: "ORD-89210-VN",
  amount: 1450000,
  errorCode: "PAYMENT_DECLINED",
  reason: "Thẻ của bạn bị từ chối hoặc số dư không đủ để thực hiện giao dịch.",
  timestamp: "26/07/2026 - 22:45",
}

export default function PaymentErrorPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-6">
        {/* HEADER: Thông báo lỗi trực quan */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <XCircle className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Thanh toán không thành công
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Giao dịch của bạn đã bị hủy hoặc gặp sự cố trong quá trình xử lý.
          </p>

          {/* Banner trấn an về tiền bạc */}
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-left">
            <ShieldAlert className="h-5 w-5 flex-shrink-0 text-amber-600" />
            <p className="text-xs text-amber-800">
              <span className="font-semibold">Đừng lo lắng:</span> Tài khoản của
              bạn chưa bị trừ tiền. Nếu có bất kỳ khoản trừ tạm thời nào, ngân
              hàng sẽ tự động hoàn lại trong ngắn hạn.
            </p>
          </div>
        </div>

        {/* DETAILS: Chi tiết lỗi & Mã đơn hàng */}
        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold tracking-wider text-gray-400 uppercase">
            Chi tiết giao dịch
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-50 py-2">
              <span className="text-gray-500">Mã đơn hàng</span>
              <span className="font-mono font-semibold text-gray-800">
                {mockErrorData.orderId}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-50 py-2">
              <span className="text-gray-500">Số tiền cần thanh toán</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(mockErrorData.amount)}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-50 py-2">
              <span className="text-gray-500">Thời gian</span>
              <span className="text-gray-700">{mockErrorData.timestamp}</span>
            </div>
            <div className="py-2">
              <span className="mb-1 block text-gray-500">Lý do thất bại:</span>
              <p className="rounded-lg border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600 sm:text-sm">
                {mockErrorData.reason}
              </p>
            </div>
          </div>
        </div>

        {/* ACTIONS: Lối thoát & Thử lại */}
        <div className="space-y-3">
          <Link
            href="/checkout"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            <RotateCcw className="h-4 w-4" /> Thử lại / Chọn phương thức khác
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/cart"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" /> Quay lại giỏ hàng
            </Link>

            <Link
              href="/support"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <PhoneCall className="h-4 w-4 text-gray-500" /> Trợ giúp thanh
              toán
            </Link>
          </div>
        </div>

        {/* COMMON CAUSES & TIPS */}
        <div className="space-y-2 rounded-2xl bg-gray-100/70 p-5 text-xs text-gray-600">
          <p className="flex items-center gap-1.5 font-semibold text-gray-800">
            <HelpCircle className="h-4 w-4 text-gray-500" /> Gợi ý khắc phục
            nhanh:
          </p>
          <ul className="list-inside list-disc space-y-1 pl-1 text-gray-600">
            <li>Kiểm tra lại số dư hoặc hạn mức thẻ/ví điện tử.</li>
            <li>Đảm bảo bạn đã nhập đúng mã OTP/mật khẩu xác thực.</li>
            <li>
              Thử đổi sang phương thức thanh toán khác (như COD hoặc Quét mã
              QR).
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
