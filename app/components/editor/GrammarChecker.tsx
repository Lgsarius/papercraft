"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Loader2, Wand2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

interface GrammarError {
  message: string
  offset: number
  length: number
  replacements: string[]
}

export function GrammarChecker({ text }: { text: string }) {
  const [errors, setErrors] = useState<GrammarError[]>([])
  const [isChecking, setIsChecking] = useState(false)

  const checkGrammar = async () => {
    setIsChecking(true)
    try {
      const response = await fetch("https://api.languagetool.org/v2/check", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          text,
          language: "de-DE",
        }),
      })

      const data = await response.json()
      setErrors(data.matches)
    } catch (error) {
      toast.error("Fehler bei der Grammatikprüfung")
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          <h2 className="font-semibold">Grammatikprüfung</h2>
        </div>
        <Button
          onClick={checkGrammar}
          disabled={isChecking}
          size="sm"
          variant="outline"
        >
          {isChecking ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Check className="h-4 w-4 mr-2" />
          )}
          Text prüfen
        </Button>
      </div>

      <ScrollArea className="flex-1 -mx-2">
        <div className="space-y-3 px-2">
          {errors.map((error, i) => (
            <div key={i} className="rounded-lg border bg-card p-4">
              <div className="text-sm text-muted-foreground mb-2">
                <span>{error.context?.text.slice(0, error.offset)}</span>
                <span className="bg-destructive/20 text-destructive font-medium px-1">
                  {error.context?.text.slice(error.offset, error.offset + error.length)}
                </span>
                <span>{error.context?.text.slice(error.offset + error.length)}</span>
              </div>
              <p className="text-sm font-medium text-destructive mb-2">
                {error.message}
              </p>
              {error.replacements.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {error.replacements.slice(0, 3).map((replacement, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast.success(`Vorschlag "${replacement}" übernommen`)
                      }}
                    >
                      {replacement}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 