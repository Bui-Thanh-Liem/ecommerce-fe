export function ChatbotPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Chatbot</h1>
      <p>Ask questions about your products and documents.</p>
      <div className="flex flex-col gap-2">
        <label htmlFor="question" className="font-semibold">
          Question:
        </label>
        <input
          type="text"
          id="question"
          name="question"
          placeholder="Enter your question..."
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>
      <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
        Ask
      </button>
    </div>
  )
}
