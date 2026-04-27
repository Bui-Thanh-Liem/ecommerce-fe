import { deleteStorage } from "./delete-storage.util";
import { OkResponse } from "@/shared/classes/response.class";
import { useStaffStore } from "@/storages/staff.storage";

const apiUrl = process.env.SERVER_API_URL;
const apiKey = process.env.API_KEY || '';

interface ResRefreshToken {
  access_token: string;
  refresh_token: string;
}

export const apiCall = async <T>(
  endpoint: string,
  options: any = {},
  isClientId: boolean = false,
): Promise<OkResponse<T>> => {
  try {
    const staff = useStaffStore.getState().staff;

    // Tạo headers object
    const headers: HeadersInit = {};

    //
    if (isClientId && staff) {
      headers["x-client-id"] = staff?.id || "";
    }

    // CHỈ set Content-Type cho non-FormData requests
    // Nếu là FormData, để browser tự động set Content-Type với boundary
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const config = {
      method: "GET",
      ...options, // Spread options trước
      headers: {
        ...headers,
        ...options.headers, // Allow override từ options
        "x-api-key": apiKey, // Add API key to headers
      },
    };

    // Initial API call
    let response = await fetch(`${apiUrl}${endpoint}`, config);
    // console.log("Đang gọi api::", `${apiUrl}${endpoint}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result = (await response.json()) as OkResponse<T>;

    // Tại đây kiểm tra xem có hết hạn access_token không, có thì refresh lại access_token
    if (
      result.statusCode === 401 &&
      result.message === "TokenExpiredError: jwt expired"
    ) {
      console.log("Access token đã hết hạn tiến hành refresh");

      // Fix: Get refresh_token, not access_token again
      const refresh_token = localStorage.getItem("refresh_token") || "";

      // Fix: Proper fetch call with headers
      const refreshResponse = await fetch(`${apiUrl}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey, // Add API key to headers
        },
        body: JSON.stringify({ refresh_token }),
      });

      const resRefreshToken =
        (await refreshResponse.json()) as OkResponse<ResRefreshToken>;

      if (resRefreshToken?.statusCode === 200) {
        
        // Update the Authorization header with new token
        config.headers = {
          ...config.headers,
        };

        // Retry the original request with new token
        response = await fetch(`${apiUrl}${endpoint}`, config);
        result = await response.json();
      } else {
        deleteStorage();
      }
    } else if ([401, 403].includes(result.statusCode)) {
      deleteStorage();
    }

    return result;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};