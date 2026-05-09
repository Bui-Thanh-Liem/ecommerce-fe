import { CreateStaffDto, UpdateStaffDto } from "@/shared/dtos/req/staff.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IStaff } from "@/shared/interfaces/models/staff.interface"
import { apiCall } from "@/utils/call-api.util"
import { handleResponse } from "@/utils/handle-response.util"

export const staffServices = {
  create: async (payload: CreateStaffDto) => {
    const res = await apiCall("/staffs", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },

  findAll: async () => {
    const res = await apiCall<ResMetadataDto<IStaff>>("/staffs", {
      method: "GET",
    })

    return handleResponse<ResMetadataDto<IStaff>>(res)
  },

  update: async (id: string, payload: UpdateStaffDto) => {
    const res = await apiCall(`/staffs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/staffs/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
