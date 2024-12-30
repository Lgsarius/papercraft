"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIAssistant } from "./AIAssistant"
import { GrammarChecker } from "./GrammarChecker"
import { CitationManager, Citation } from "./CitationManager"
import { Bot, BookOpen, Wand2 } from "lucide-react"

interface EditorSidebarProps {
  text: string
  onCite: (citation: Citation) => void
}

export function EditorSidebar({ text, onCite }: EditorSidebarProps) {
  return (
    <aside className="w-96 border-l bg-background flex flex-col">
      <Tabs defaultValue="sources" className="flex-1">
        <TabsList className="flex w-full justify-between border-b rounded-none px-2 h-14 bg-background">
          <TabsTrigger 
            value="sources" 
            className="flex-1 flex items-center gap-2 data-[state=active]:bg-muted rounded-none h-10"
          >
            <BookOpen className="h-4 w-4" />
            <span>Quellen</span>
          </TabsTrigger>
          <TabsTrigger 
            value="grammar" 
            className="flex-1 flex items-center gap-2 data-[state=active]:bg-muted rounded-none h-10"
          >
            <Wand2 className="h-4 w-4" />
            <span>Grammatik</span>
          </TabsTrigger>
          <TabsTrigger 
            value="ai" 
            className="flex-1 flex items-center gap-2 data-[state=active]:bg-muted rounded-none h-10"
          >
            <Bot className="h-4 w-4" />
            <span>KI</span>
          </TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-hidden">
          <TabsContent value="sources" className="mt-0 h-full p-4">
            <CitationManager onCite={onCite} />
          </TabsContent>
          <TabsContent value="grammar" className="mt-0 h-full p-4">
            <GrammarChecker text={text} />
          </TabsContent>
          <TabsContent value="ai" className="mt-0 h-full p-4">
            <AIAssistant />
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  )
} 