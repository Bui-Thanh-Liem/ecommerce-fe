import { sepayService } from "@/services/payment/sepay.service"
import { CreateCheckoutDto } from "@/shared/dtos/req/sepay.dto"
import { useMutation } from "@tanstack/react-query"

export const useSepayCheckout = () => {
  return useMutation({
    mutationFn: (payload: CreateCheckoutDto) => sepayService.checkout(payload),
    onSuccess: () => {},
  })
}
