"use client"

import { useState, useRef, useEffect } from "react"

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content?: string
  sources?: any[]
  isStreaming?: boolean
}

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Auto scroll xuống cuối
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentQuestion = input.trim()
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuestion }),
      })

      if (!response.body) throw new Error("No response body")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      // Thêm message assistant tạm
      const assistantMessageId = (Date.now() + 1).toString()
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          type: "assistant",
          content: "",
          isStreaming: true,
        },
      ])

      let buffer = ""

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n\n")

        buffer = lines.pop() || "" // Giữ lại phần chưa hoàn chỉnh

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6))

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? updateMessageFromStream(msg, data)
                    : msg
                )
              )
            } catch (err) {
              console.error("Parse error:", err)
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.isStreaming
            ? {
                ...msg,
                content: "❌ Có lỗi xảy ra, vui lòng thử lại.",
                isStreaming: false,
              }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Xử lý từng chunk từ server
  const updateMessageFromStream = (
    msg: ChatMessage,
    data: any
  ): ChatMessage => {
    switch (data.type) {
      case "thinking":
        return { ...msg, content: data.content || "Đang suy nghĩ..." }

      case "sources":
        return {
          ...msg,
          sources: data.data || [],
          content: msg.content || "",
        }

      case "answer_chunk":
        return {
          ...msg,
          content: (msg.content || "") + data.content,
        }

      case "end":
        return { ...msg, isStreaming: false }

      default:
        return msg
    }
  }

  return (
    <div className="flex h-[60vh] flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          AI Shopping Assistant
        </h1>
        <p className="text-sm text-gray-500">Hỏi bất cứ điều gì về sản phẩm</p>
      </div>

      {/* Chat Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 space-y-6 overflow-y-auto bg-gray-50 p-6"
      >
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <p className="mb-2 text-2xl text-gray-400">👋</p>
              <p className="text-gray-500">
                Chào bạn! Bạn đang tìm sản phẩm gì hôm nay?
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                msg.type === "user"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-100 bg-white shadow-sm"
              }`}
            >
              {msg.type === "assistant" &&
                msg.sources &&
                msg.sources.length > 0 && (
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-medium text-gray-500">
                      Sản phẩm tham khảo:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {msg.sources
                        .slice(0, 4)
                        .map((product: any, idx: number) => (
                          <div
                            key={idx}
                            className="rounded-full bg-gray-100 px-3 py-1 text-xs"
                          >
                            {product.name || product.sku}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              <div className="leading-relaxed whitespace-pre-wrap">
                {msg.content}
                {msg.isStreaming && <span className="animate-pulse">▋</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ví dụ: Tôi muốn mua áo thun nam màu đen..."
            className="flex-1 rounded-full border border-gray-300 px-6 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-full bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Đang trả lời..." : "Gửi"}
          </button>
        </form>
        <p className="mt-2 text-center text-[10px] text-gray-400">
          AI có thể sai sót • Hãy kiểm tra thông tin sản phẩm
        </p>
      </div>
    </div>
  )
}
