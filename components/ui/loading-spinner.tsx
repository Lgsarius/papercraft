export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted-foreground/20 border-r-muted-foreground"></div>
      </div>
    </div>
  )
} 