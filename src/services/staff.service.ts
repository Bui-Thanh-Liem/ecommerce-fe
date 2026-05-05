import {
  CreateStaffDto,
  UpdateStaffDto,
} from "@/shared/dtos/req/create-staff.dto"
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
    const res = await apiCall<IStaff[]>("/staffs", {
      method: "GET",
    })

    return handleResponse<IStaff[]>(res)
  },

  update: async (id: string, payload: UpdateStaffDto) => {
    const res = await apiCall(`/staffs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },
}
