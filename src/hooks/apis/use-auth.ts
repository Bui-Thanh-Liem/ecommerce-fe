import { authServices } from "@/services/auth.service"
import { SignInDto } from "@/shared/dtos/req/sign-in.dto"
import { useStaffContext } from "@/context/staff.context"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useSignIn = () => {
  const { setStaff } = useStaffContext()

  return useMutation({
    //
    mutationFn: (payload: SignInDto) => authServices.signIn(payload),

    //
    onSuccess: (data) => {
      //
      if (data?.statusCode === 201) {
        const staff = data.metadata!.staff
        setStaff(staff)
      }
    },
  })
}

export const useWhoami = () => {
  return useQuery({
    queryKey: ["whoami"],
    queryFn: authServices.whoami,

    // --- Các options phổ biến ---
    enabled: true, // Tự động chạy khi component mount (false thì phải gọi refetch thủ công)

    staleTime: 1000 * 60 * 5, // Dữ liệu "tươi" trong 5 phút
    gcTime: 1000 * 60 * 10, // Giữ trong cache 10 phút sau khi unmount

    refetchOnWindowFocus: false, // Không fetch lại khi chuyển tab
    retry: 1, // Thử lại 1 lần duy nhất nếu lỗi

    // Trả về dữ liệu mặc định để UI không bị trống khi đang load
    placeholderData: (previousData) => previousData,

    // Tự động fetch lại sau mỗi 30s (nếu cần sync liên tục)
    // refetchInterval: 30000,
  })
}
