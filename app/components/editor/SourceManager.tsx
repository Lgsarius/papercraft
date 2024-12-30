"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Trash2, BookOpen } from "lucide-react"
import { toast } from "sonner"

interface SourceManagerProps {
  sources: string[]
  onChange?: (sources: string[]) => void
}

export function SourceManager({ sources = [], onChange }: SourceManagerProps) {
  const [newSource, setNewSource] = useState("")

  const addSource = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSource.trim()) return

    const updatedSources = [...sources, newSource.trim()]
    onChange?.(updatedSources)
    setNewSource("")
    toast.success("Quelle hinzugefügt")
  }

  const removeSource = (index: number) => {
    const updatedSources = sources.filter((_, i) => i !== index)
    onChange?.(updatedSources)
    toast.success("Quelle entfernt")
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Literaturverwaltung
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={addSource} className="flex gap-2 mb-4">
          <Input
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            placeholder="Neue Quelle hinzufügen..."
          />
          <Button type="submit" size="icon" disabled={!newSource.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </form>
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-2">
            {sources.map((source, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg bg-muted"
              >
                <span className="text-sm flex-1 mr-2">{source}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSource(index)}
                  className="h-8 w-8 text-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 