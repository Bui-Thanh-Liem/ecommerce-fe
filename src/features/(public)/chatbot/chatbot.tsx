"use client"

import { useEffect, useRef, useState } from "react"
import { Send, X } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface ChatMessage {
  id: string
  sources?: any[]
  content?: string
  isStreaming?: boolean
  /** true khi đang chờ sản phẩm/câu trả lời, chưa có chunk thật nào về */
  isThinking?: boolean
  /** label hiển thị kèm dấu "..." khi đang nghĩ, ví dụ "Đang tìm kiếm sản phẩm..." */
  thinkingLabel?: string
  /** true khi tin nhắn này là thông báo lỗi từ server (type: "error") */
  isError?: boolean
  type: "user" | "assistant"
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
    </span>
  )
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Auto scroll xuống cuối mỗi khi có message mới
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

      // Thêm message assistant tạm - hiện "..." ngay lập tức, chưa có content thật
      const assistantMessageId = (Date.now() + 1).toString()
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          type: "assistant",
          content: "",
          isStreaming: true,
          isThinking: true,
          thinkingLabel: "Đang suy nghĩ...",
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
                isThinking: false,
                isError: true,
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
        // Chỉ cập nhật label hiển thị cạnh dấu "...", KHÔNG đụng vào content thật
        return {
          ...msg,
          isThinking: true,
          thinkingLabel: data.content || "Đang suy nghĩ...",
        }

      case "sources":
        // Sản phẩm tham khảo có thể đến trước khi câu trả lời bắt đầu stream
        return { ...msg, sources: data.data || [] }

      case "start_answer":
        // Reset content cho sạch, nhưng GIỮ isThinking = true -> dots vẫn chạy
        // liên tục đến khi answer_chunk THẬT đầu tiên về, tránh khoảng trống
        // hiện cursor rỗng nếu sau đó lỗi xảy ra mà chưa có chunk nào.
        return { ...msg, content: "" }

      case "answer_chunk":
        return {
          ...msg,
          isThinking: false,
          content: (msg.content || "") + data.content,
        }

      case "end":
        return { ...msg, isStreaming: false, isThinking: false }

      case "error":
        return {
          ...msg,
          isStreaming: false,
          isThinking: false,
          isError: true,
          content: data.content || "❌ Có lỗi xảy ra, vui lòng thử lại.",
        }

      default:
        return msg
    }
  }

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
      {/* Panel chat - bung ra từ góc phải dưới */}
      <div
        role="dialog"
        aria-label="AI Shopping Assistant"
        aria-hidden={!isOpen}
        className={`flex h-150 max-h-[calc(100vh-7rem)] w-95 max-w-[calc(100vw-2rem)] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-200 ease-out ${
          isOpen
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-x-3 border-b bg-white px-5 py-4">
          <Image
            width={36}
            height={36}
            alt="chat-bot"
            src="/images/chat-bot.png"
          />
          <div>
            <h1 className="font-semibold text-gray-800">Trợ lý mua sắm AI</h1>
            <p className="text-sm text-gray-500">
              Hỏi bất cứ điều gì về sản phẩm
            </p>
          </div>
          <button
            type="button"
            aria-label="Đóng chat"
            onClick={() => setIsOpen(false)}
            className="ml-auto rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div
          ref={chatContainerRef}
          className="flex-1 space-y-6 overflow-y-auto bg-gray-50 p-5"
        >
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <p className="mb-2 text-2xl">👋</p>
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
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  msg.type === "user"
                    ? "bg-blue-600 text-white"
                    : "border border-gray-100 bg-white shadow-sm"
                }`}
              >
                {msg.type === "assistant" &&
                  msg.sources &&
                  msg.sources.length > 0 && (
                    <div className="mb-3">
                      <p className="mb-2 text-xs font-medium text-gray-500">
                        Sản phẩm tham khảo:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources
                          .slice(0, 4)
                          .map((product: any, idx: number) => (
                            <Badge variant="secondary" key={idx}>
                              {product.name || product.sku}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}

                {msg.isThinking && !msg.content ? (
                  <div className="flex items-center gap-2 text-gray-400">
                    {msg.thinkingLabel && (
                      <span className="text-xs">{msg.thinkingLabel}</span>
                    )}
                    <TypingDots />
                  </div>
                ) : (
                  <div
                    className={`leading-relaxed whitespace-pre-wrap ${
                      msg.isError ? "text-red-600" : ""
                    }`}
                  >
                    {msg.content}
                    {msg.isStreaming && (
                      <span className="animate-pulse">▋</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-3">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ví dụ: Tôi muốn mua áo thun nam màu đen..."
              className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Gửi"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-2 text-center text-[10px] text-gray-400">
            AI có thể sai sót • Hãy kiểm tra thông tin sản phẩm
          </p>
        </div>
      </div>

      {/* Nút bong bóng - mở/đóng widget, luôn nằm cố định góc phải dưới */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Đóng trợ lý AI" : "Mở trợ lý AI"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:scale-105 hover:bg-blue-700"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Image
            width={56}
            height={56}
            alt="chat-bot"
            src="/images/chat-bot.png"
            className="animate-pulse"
          />
        )}
      </button>
    </div>
  )
}
