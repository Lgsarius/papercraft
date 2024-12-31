"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIAssistant } from "./AIAssistant"
import { GrammarChecker } from "./GrammarChecker"
import { CitationManager, Citation } from "./CitationManager"
import { Bot, BookOpen, Wand2 } from "lucide-react"
import { BurgerMenu } from "@/components/ui/burger-menu"
import { cn } from "@/lib/utils"

interface EditorSidebarProps {
  text: string
  onCite: (citation: Citation) => void
}

export function EditorSidebar({ text, onCite }: EditorSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside 
      className={cn(
        "border-l bg-background flex-none transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-96"
      )}
    >
      <div className="h-full flex flex-col">
        <div className="flex-none flex items-center justify-between h-14 px-4 border-b">
          <BurgerMenu 
            variant="ghost"
            size="sm"
            isOpen={!isCollapsed}
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
          {!isCollapsed && (
            <span className="font-medium text-sm">Assistenten</span>
          )}
        </div>

        {!isCollapsed ? (
          <Tabs defaultValue="sources" className="flex-1 flex flex-col">
            <TabsList className="flex w-full justify-between border-b rounded-none px-2 h-14 bg-background flex-none">
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

            <TabsContent value="sources" className="flex-1 p-4 overflow-y-auto scrollbar-custom">
              <CitationManager onCite={onCite} />
            </TabsContent>
            <TabsContent value="grammar" className="flex-1 p-4 overflow-y-auto scrollbar-custom">
              <GrammarChecker text={text} />
            </TabsContent>
            <TabsContent value="ai" className="flex-1 p-4 overflow-y-auto scrollbar-custom">
              <AIAssistant />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex-1 flex flex-col items-center pt-4 gap-4">
            <button 
              className="w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center"
              onClick={() => setIsCollapsed(false)}
            >
              <BookOpen className="h-5 w-5" />
            </button>
            <button 
              className="w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center"
              onClick={() => setIsCollapsed(false)}
            >
              <Wand2 className="h-5 w-5" />
            </button>
            <button 
              className="w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center"
              onClick={() => setIsCollapsed(false)}
            >
              <Bot className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
} 