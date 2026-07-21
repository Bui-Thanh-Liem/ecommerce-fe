import { ICustomerAddress } from "@/shared/interfaces/models/customer/customer-address.interface"

export function convertAddressToString(
  address?: ICustomerAddress,
  location?: string
): string {
  if (!address) return location || ""

  //
  const {
    country,
    wardCommune,
    provinceCity,
    districtTown,
    address: addressDetail,
  } = address

  return `${addressDetail}, ${wardCommune?.name}, ${districtTown?.name}, ${provinceCity?.name}, ${country?.name}`
}
