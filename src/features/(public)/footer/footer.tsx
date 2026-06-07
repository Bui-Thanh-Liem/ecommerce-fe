export function Footer() {
  const supportHotline = {
    ["Gọi mua"]: "1900 232 461 (8:00 - 21:30)",
    ["Khiếu nại"]: "1800.1063 (8:00 - 21:30)",
    ["Bảo hành"]: "1900 232 465 (8:00 - 21:00)",
  }

  const companyInfo = [
    "Giới thiệu công ty (MWG.vn)",
    "Tuyển dụng",
    "Gửi góp ý, khiếu nại",
    "Tìm siêu thị (2948 shop)",
    "Thông tin khác",
  ]

  const others = [
    "Tích điểm Quà tặng VIP",
    "Lịch sử mua hàng",
    "Đăng ký bán hàng CTV chiết khấu cao",
    "Tìm hiểu về mua trả chậm",
  ]

  return (
    <footer className="grid h-16 grid-cols-12">
      <div className="col-span-2"></div>

      <div className="col-span-8 grid grid-cols-12 gap-4 p-4">
        <div className="col-span-3">
          <h3>Tổng đài hỗ trợ</h3>
          <ul>
            {Object.entries(supportHotline).map(([key, value]) => (
              <li key={key}>
                {key}: {value}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-3">
          <h3>Về công ty</h3>
          <ul>
            {companyInfo.map((info, index) => (
              <li key={index}>{info}</li>
            ))}
          </ul>
        </div>
        <div className="col-span-2">
          <h3>Khác</h3>
          <ul>
            {others.map((other, index) => (
              <li key={index}>{other}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="col-span-2"></div>
    </footer>
  )
}
