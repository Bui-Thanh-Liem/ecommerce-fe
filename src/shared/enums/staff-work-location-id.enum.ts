export enum StaffWorkLocationID {
  REMOTE = "Remote", // staff làm việc từ xa, không thuộc chi nhánh nào
  STORE_BASED = "StoreBased", // staff làm việc tại một chi nhánh cụ thể, chỉ thuộc một chi nhánh
  REGIONAL = "Regional", // staff làm việc tại chi nhánh nào đó, có thể là nhiều chi nhánh
  HEADQUARTERS = "Headquarters", // staff làm việc tại trụ sở chính, có thể quản lý nhiều chi nhánh
}
