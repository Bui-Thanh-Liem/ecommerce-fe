"use client"

import { useEffect, useRef, useState } from "react"
import { Send, X } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface SourceItem {
  sku?: string
  name?: string
}

interface ChatMessage {
  id: string
  content: string
  sources?: SourceItem[]
  isStreaming?: boolean
  /** true khi chưa có answer_chunk thực sự nào -> hiện dấu "..." */
  isThinking?: boolean
  isError?: boolean
  type: "user" | "assistant"
}

/** Khớp @Param('type') type: DocumentType trong RagController -> GET /api/rag/ask/:type */
type DocumentType = "public" | "internal"

/** Các event mà BE hiện gửi qua SSE, theo đúng ask() đã sửa */
type StreamEvent =
  | { type: "sources"; data: SourceItem[] }
  | { type: "start_answer" }
  | { type: "answer_chunk"; content: string }
  | { type: "end" }
  | { type: "error"; content?: string }

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
    </span>
  )
}

interface ChatbotProps {
  /** Loại nguồn dữ liệu để hỏi, mặc định "public" cho widget khách hàng */
  type?: DocumentType
}

export function Chatbot({ type = "public" }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    return () => abortControllerRef.current?.abort()
  }, [])

  // Áp dụng 1 event đã parse vào đúng message assistant tương ứng
  const applyEvent = (assistantMessageId: string, event: StreamEvent) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== assistantMessageId) return m

        switch (event.type) {
          case "sources":
            return { ...m, sources: event.data || [] }
          case "start_answer":
            // Reset content cho sạch, giữ isThinking=true đến khi có chunk thật đầu tiên
            return { ...m, content: "" }
          case "answer_chunk":
            return {
              ...m,
              isThinking: event.content ? false : m.isThinking, // chỉ tắt khi có content thật
              content: m.content + (event.content ?? ""),
            }
          case "end":
            return { ...m, isStreaming: false, isThinking: false }
          case "error":
            return {
              ...m,
              isStreaming: false,
              isThinking: false,
              isError: true,
              content: event.content || "❌ Có lỗi xảy ra, vui lòng thử lại.",
            }
          default:
            return m
        }
      })
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const currentQuestion = input.trim()

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      type: "user",
      content: currentQuestion,
    }

    const assistantMessageId = crypto.randomUUID()
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      type: "assistant",
      content: "",
      isStreaming: true,
      isThinking: true,
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput("")
    setIsLoading(true)

    const patchAssistant = (patch: Partial<ChatMessage>) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantMessageId ? { ...m, ...patch } : m))
      )
    }

    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    let receivedEndEvent = false

    try {
      const url = `/api/rag/ask/${type}?question=${encodeURIComponent(currentQuestion)}`
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "text/event-stream" },
        signal: controller.signal,
      })

      if (!response.ok || !response.body) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Mỗi SSE event cách nhau bởi 1 dòng trống
        const rawEvents = buffer.split("\n\n")
        buffer = rawEvents.pop() || "" // phần chưa nhận đủ, giữ lại

        for (const rawEvent of rawEvents) {
          // QUAN TRỌNG: không giả định có khoảng trắng sau "data:".
          // Một số adapter/proxy gửi "data:{...}" thay vì "data: {...}",
          // nếu chỉ match "data: " (có space) sẽ bỏ sót toàn bộ event.
          const dataLines = rawEvent
            .split("\n")
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.replace(/^data:\s?/, ""))

          if (dataLines.length === 0) continue

          const rawData = dataLines.join("\n")

          try {
            const event = JSON.parse(rawData) as StreamEvent
            applyEvent(assistantMessageId, event)
            if (event.type === "end" || event.type === "error") {
              receivedEndEvent = true
            }
          } catch (err) {
            console.error("Không parse được SSE event:", rawData, err)
          }
        }
      }

      if (!receivedEndEvent) {
        // Kết nối đóng mà không có event "end"/"error" tường minh
        // -> nhiều khả năng generator throw lỗi giữa chừng ở BE
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? m.content
                ? { ...m, isStreaming: false, isThinking: false }
                : {
                    ...m,
                    isStreaming: false,
                    isThinking: false,
                    isError: true,
                    content: "❌ Kết nối bị ngắt giữa chừng, vui lòng thử lại.",
                  }
              : m
          )
        )
      }
    } catch (error) {
      if ((error as any)?.name === "AbortError") return

      console.error("Chat error:", error)
      patchAssistant({
        isStreaming: false,
        isThinking: false,
        isError: true,
        content: "❌ Có lỗi xảy ra, vui lòng thử lại.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
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
                        {msg.sources.slice(0, 4).map((product, idx) => (
                          <Badge variant="secondary" key={idx}>
                            {product.name || product.sku}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                {msg.isThinking && !msg.content ? (
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-xs">Đang suy nghĩ...</span>
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

      {/* Nút bong bóng */}
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
