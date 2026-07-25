export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1 className="text-4xl font-bold text-green-600">Payment Successful!</h1>
      <p className="mt-4 text-lg text-gray-700">
        Thank you for your purchase. Your payment has been processed
        successfully.
      </p>
    </div>
  )
}
