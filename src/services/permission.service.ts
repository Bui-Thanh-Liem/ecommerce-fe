import { apiCall } from "@/utils/call-api.util";

export const permissionServices = {
   
  findAll: async () => {
    const res = await apiCall("/permissions", {
      method: "GET",
    });

    return res;
  }
}