"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { 
  Folder, File, ChevronRight, Settings, Search, Plus, 
  BookOpen, MessageSquare, Library, Menu, Bold, Italic, 
  List, ListOrdered, Quote as QuoteIcon, Link, Image,
  Pencil
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export function AnimatedWriting() {
  const [text, setText] = useState("")
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Wie kann ich Ihnen bei Ihrer wissenschaftlichen Arbeit helfen?" },
    { role: "user", content: "Kannst du mir helfen, die Einleitung zu strukturieren?" },
    { role: "assistant", content: "Natürlich! Eine gute Einleitung sollte folgende Elemente enthalten:\n\n1. Hinführung zum Thema\n2. Problemstellung\n3. Zielsetzung\n4. Methodisches Vorgehen\n5. Aufbau der Arbeit" }
  ])
  const [activeTab, setActiveTab] = useState<'ki' | 'quellen' | 'pruefer'>('ki')

  const fullText = `# Einführung in die KI-gestützte Forschung

Die Integration von künstlicher Intelligenz in wissenschaftliche Arbeitsprozesse hat in den letzten Jahren...

## Methodische Grundlagen

### 2.1 Maschinelles Lernen
- Supervised Learning
- Unsupervised Learning
- Reinforcement Learning`

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        currentIndex = 0
      }
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="relative w-full max-w-[1200px] mx-auto h-[600px] rounded-lg overflow-hidden border shadow-lg bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Bar */}
      <div className="h-10 bg-background border-b flex items-center px-4 justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-sm text-muted-foreground">PaperCraft Editor</div>
      </div>

      <div className="flex h-[calc(100%-2.5rem)]">
        {/* Left Sidebar - Navigation */}
        <motion.div 
          className="w-16 border-r bg-muted/30 flex flex-col items-center py-4 space-y-4"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="ghost" size="icon" className="rounded-full">
            <Menu className="h-5 w-5" />
          </Button>
          <Separator className="w-8" />
          <Button variant="ghost" size="icon" className="rounded-full">
            <BookOpen className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Library className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
        </motion.div>

     

        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          {/* Editor Toolbar */}
          <motion.div 
            className="h-10 border-b flex items-center px-4 gap-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button variant="ghost" size="icon">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Italic className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="icon">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="icon">
              <QuoteIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Link className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Image className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Editor Content */}
          <motion.div 
            className="flex-1 p-6 font-mono text-sm overflow-auto bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {text.split("\n").map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="min-h-[1.5em]"
              >
                {line}
              </motion.div>
            ))}
            <motion.div
              className="inline-block w-2 h-4 bg-primary ml-1"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </motion.div>
        </div>

        {/* Right Sidebar - AI Chat */}
        <motion.div 
          className="w-80 border-l bg-muted/30"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between gap-2">
                <Button 
                  variant={activeTab === 'ki' ? 'secondary' : 'ghost'}
                  size="sm" 
                  className="flex items-center gap-2 flex-1"
                  onClick={() => setActiveTab('ki')}
                >
                  <MessageSquare className={`h-4 w-4 ${activeTab === 'ki' ? 'text-primary' : ''}`} />
                  <span className="text-sm font-medium">KI</span>
                </Button>
                <Button 
                  variant={activeTab === 'quellen' ? 'secondary' : 'ghost'}
                  size="sm" 
                  className="flex items-center gap-2 flex-1"
                  onClick={() => setActiveTab('quellen')}
                >
                  <BookOpen className={`h-4 w-4 ${activeTab === 'quellen' ? 'text-primary' : ''}`} />
                  <span className="text-sm font-medium">Quellen</span>
                </Button>
                <Button 
                  variant={activeTab === 'pruefer' ? 'secondary' : 'ghost'}
                  size="sm" 
                  className="flex items-center gap-2 flex-1"
                  onClick={() => setActiveTab('pruefer')}
                >
                  <Pencil className={`h-4 w-4 ${activeTab === 'pruefer' ? 'text-primary' : ''}`} />
                  <span className="text-sm font-medium">Prüfer</span>
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1 p-4">
              {activeTab === 'ki' && (
                <div className="space-y-4">
                  {messages.map((message, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`rounded-lg p-3 max-w-[80%] ${
                        message.role === 'assistant' 
                          ? 'bg-muted' 
                          : 'bg-primary text-primary-foreground'
                      }`}>
                        {message.content}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              {activeTab === 'quellen' && (
                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm">Ihre Quellen werden hier angezeigt...</p>
                </div>
              )}
              {activeTab === 'pruefer' && (
                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm">Prüfungsergebnisse werden hier angezeigt...</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
} 