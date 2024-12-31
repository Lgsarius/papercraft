"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Loader2, Send, Eraser, Copy } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import { useChat } from "@/app/hooks/useChat"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism/one-dark"

export function AIAssistant() {
  const { 
    messages, 
    input, 
    isLoading, 
    sendMessage, 
    setInput, 
    clearChat 
  } = useChat()
  
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <h2 className="font-semibold">KI-Assistent</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearChat}
          title="Chat zurücksetzen"
        >
          <Eraser className="h-4 w-4 mr-2" />
          Zurücksetzen
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-custom">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${
                message.role === "assistant" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`group relative rounded-lg px-4 py-2 max-w-[85%] ${
                  message.role === "assistant"
                    ? "bg-muted hover:bg-muted/80"
                    : "bg-primary text-primary-foreground"
                } transition-colors`}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            {...props}
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code {...props} className={className}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
                {message.role === "assistant" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-10 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => navigator.clipboard.writeText(message.content)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-lg px-4 py-2 bg-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-none mt-4 pt-4 border-t">
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Fragen Sie den Assistenten..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
} 