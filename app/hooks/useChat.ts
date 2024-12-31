import { useState } from "react"
import { toast } from "sonner"

interface Message {
  role: "user" | "assistant"
  content: string
}

const INITIAL_MESSAGES: Message[] = [{
  role: "assistant",
  content: "Hallo! Ich bin Ihr KI-Assistent für akademisches Schreiben. Ich kann Ihnen bei der Formulierung, Strukturierung und Recherche helfen. Wie kann ich Sie unterstützen?"
}]

export function useChat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()
      setMessages(prev => [...prev, { role: "assistant", content: data.response }])
    } catch (error) {
      toast.error("Fehler beim Senden der Nachricht")
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages(INITIAL_MESSAGES)
    toast.success("Chat zurückgesetzt")
  }

  return {
    messages,
    input,
    isLoading,
    sendMessage,
    setInput,
    clearChat,
  }
} 