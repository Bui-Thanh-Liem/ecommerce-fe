export default function PaymentErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1 className="text-4xl font-bold text-red-600">Payment Failed!</h1>
      <p className="mt-4 text-lg text-gray-700">
        Sorry, your payment failed. Please try again.
      </p>
    </div>
  )
}
