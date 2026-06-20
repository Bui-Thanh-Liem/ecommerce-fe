export function Footer() {
  const supportHotlines = [
    { label: "Gọi mua", number: "1900 232 461", time: "(8:00 - 21:30)" },
    { label: "Khiếu nại", number: "1800.1063", time: "(8:00 - 21:30)" },
    { label: "Bảo hành", number: "1900 232 465", time: "(8:00 - 21:00)" },
  ]

  const companyLinks = [
    "Giới thiệu công ty (MWG.vn)",
    "Tuyển dụng",
    "Gửi góp ý, khiếu nại",
    "Tìm siêu thị (2948 shop)",
  ]

  const otherLinks = [
    "Tích điểm Quà tặng VIP",
    "Lịch sử mua hàng",
    "Đăng ký bán hàng CTV chiết khấu cao",
    "Tìm hiểu về mua trả chậm",
  ]

  return (
    <footer className="grid w-full grid-cols-12 border-t border-gray-100 bg-white py-6 font-sans text-[#333] select-none">
      <div className="col-span-2"></div>
      <div className="col-span-8 grid grid-cols-4">
        {/* Cột 1: Tổng đài hỗ trợ */}
        <div className="">
          <h3 className="mb-3 text-[15px] font-bold text-gray-800">
            Tổng đài hỗ trợ
          </h3>
          <ul className="space-y-2.5 text-[14px]">
            {supportHotlines.map((item, index) => (
              <li key={index} className="leading-snug">
                <span className="text-gray-600">{item.label}: </span>
                <a
                  href={`tel:${item.number.replace(/\s|\./g, "")}`}
                  className="font-bold text-blue-600 hover:underline"
                >
                  {item.number}
                </a>
                <span className="ml-1 text-[13px] text-gray-500">
                  {item.time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 2: Về công ty */}
        <div className="">
          <h3 className="mb-3 text-[15px] font-bold text-gray-800">
            Về công ty
          </h3>
          <ul className="space-y-2.5 text-[14px]">
            {companyLinks.map((link, index) => (
              <li key={index}>
                <a
                  href="#"
                  className="text-gray-600 transition-colors hover:text-blue-600"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 3: Thông tin khác */}
        <div className="">
          <h3 className="mb-3 text-[15px] font-bold text-gray-800">
            Thông tin khác
          </h3>
          <ul className="mb-2 space-y-2.5 text-[14px]">
            {otherLinks.map((link, index) => (
              <li key={index}>
                <a
                  href="#"
                  className="text-gray-600 transition-colors hover:text-blue-600"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
          {/* Nút Xem thêm */}
          <button className="flex items-center gap-1 text-[14px] text-gray-600 hover:text-blue-600">
            Xem thêm
            <svg
              className="h-3 w-3 pt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Cột 4: Website cùng tập đoàn & MXH */}
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="mb-3 text-[15px] font-bold text-gray-800">
              Website cùng tập đoàn
            </h3>
            {/* Giả lập lưới các logo thương hiệu (Thế giới di động, Điện máy xanh, Topzone...) */}
            <div className="grid max-w-[240px] grid-cols-4 gap-1.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-7 items-center justify-center rounded border border-gray-200 bg-gray-100 text-[9px] font-medium tracking-wider text-gray-400 uppercase"
                  title="Brand Logo Placeholder"
                >
                  Logo
                </div>
              ))}
            </div>
          </div>

          {/* Mạng xã hội & Chứng nhận */}
          <div className="flex flex-col gap-3 text-[13px]">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600">
              <a
                href="#"
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <span className="font-bold text-blue-600">f</span> 3886.8k Fan
              </a>
              <a
                href="#"
                className="flex items-center gap-1 hover:text-red-600"
              >
                <span className="font-bold text-red-600">▶</span> 695k Đăng ký
              </a>
              <a
                href="#"
                className="flex items-center gap-1 hover:text-blue-500"
              >
                <span className="rounded bg-blue-500 px-0.5 text-[9px] font-bold text-white">
                  Zalo
                </span>{" "}
                ĐMX
              </a>
            </div>

            {/* Khối chứng nhận Bộ Công Thương / DMCA */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex h-6 w-16 items-center justify-center rounded bg-red-600 px-1 text-center text-[8px] leading-tight font-bold text-white">
                ĐÃ ĐĂNG KÝ BỘ CÔNG THƯƠNG
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-800 text-[8px] font-bold text-white">
                WEB
              </div>
              <div className="flex h-6 w-20 items-center justify-center rounded bg-gray-800 px-1 text-[9px] font-bold tracking-tight text-white">
                DMCA PROTECTED
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2"></div>
    </footer>
  )
}
