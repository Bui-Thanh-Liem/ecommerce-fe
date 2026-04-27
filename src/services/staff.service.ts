import { CreateStaffDto } from "@/shared/dtos/req/create-staff.dto";
import { apiCall } from "@/utils/call-api.util";

export const staffServices = {
  create: async (payload: CreateStaffDto) => {
    const res = await apiCall("/staffs", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return res;
  },
  
  
  findAll: async () => {
    const res = await apiCall("/staffs", {
      method: "GET",
    });

    return res;
  }
}