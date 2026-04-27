import { IPermission } from "@/shared/interfaces/models/permission.interface";
import { apiCall } from "@/utils/call-api.util";

export const permissionServices = {
   
  findAll: async () => {
    const res = await apiCall<IPermission[]>("/permissions", {
      method: "GET",
    });

    return res;
  }
}