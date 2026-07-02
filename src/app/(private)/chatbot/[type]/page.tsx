import { ChatbotPage } from "@/features/(private)/chatbot/chatbot-page"

export default async function Page({ params }: { params: { type: string } }) {
  console.log("params in chatbot page.tsx", await params)

  return <ChatbotPage />
}
