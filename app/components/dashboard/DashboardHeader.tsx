import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "./UserNav"

export function DashboardHeader() {
  return (
    <header className="border-b fixed top-0 left-0 right-0 bg-background z-30">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="font-semibold">PaperCraft</div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
} 