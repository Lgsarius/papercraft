"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, AlertTriangle } from "lucide-react"
import { useGrammarContext } from "@/app/context/GrammarContext"
import ReactMarkdown from 'react-markdown'

interface Message {
  role: "user" | "assistant" | "system"
  content: string
  type?: "grammar" | "chat"
}

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { feedback } = useGrammarContext()

  // Convert grammar feedback to messages
  useEffect(() => {
    if (feedback.length > 0) {
      const lastFeedback = feedback[feedback.length - 1]
      if (lastFeedback.type === 'grammar' && lastFeedback.errors) {
        const feedbackMessage = formatGrammarFeedback(lastFeedback.errors)
        setMessages(prev => [...prev, {
          role: 'system',
          content: feedbackMessage,
          type: 'grammar'
        }])
      }
    }
  }, [feedback])

  const formatGrammarFeedback = (errors: any[]) => {
    return `### Grammatik-Feedback

${errors.map((error, index) => `
${index + 1}. **Problem**: ${error.message}
   - Kontext: \`${error.context}\`
   - Vorschläge: ${error.replacements.join(', ')}
`).join('\n')}

---
`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessage: Message = { role: "user", content: input, type: "chat" }
    setMessages(prev => [...prev, newMessage])
    setInput("")
    setIsLoading(true)

    // Hier können Sie die KI-Integration hinzufügen
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Ich bin Ihr Schreibassistent. Wie kann ich Ihnen helfen?",
        type: "chat"
      }])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Schreibassistent</h2>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : message.type === "grammar"
                    ? "bg-yellow-100 dark:bg-yellow-900/20"
                    : "bg-muted"
                }`}
              >
                {message.type === "grammar" ? (
                  <div className="prose dark:prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                Schreibt...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ihre Nachricht..."
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
} 