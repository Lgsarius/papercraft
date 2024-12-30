import { Check, Loader2 } from 'lucide-react'

interface StatusIndicatorProps {
  saving: boolean
  error: boolean
}

export function StatusIndicator({ saving, error }: StatusIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {saving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Speichern...</span>
        </>
      ) : error ? (
        <span className="text-destructive">Fehler beim Speichern</span>
      ) : (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span>Gespeichert</span>
        </>
      )}
    </div>
  )
} 