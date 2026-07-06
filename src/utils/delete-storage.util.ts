export function deleteStorage(type: "customer" | "staff") {
  if (type === "staff") {
    localStorage.removeItem("staff_storage")
  } else {
    localStorage.removeItem("customer_storage")
  }
}
