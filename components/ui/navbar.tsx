"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Menu } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: "Features", href: "/features" },
    { name: "Preise", href: "/pricing" },
    { name: "Blog", href: "/blog" },
    { name: "Über uns", href: "/about" },
  ]

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold inline-block">PaperCraft</span>
          </Link>
          <div className="hidden md:flex gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <div className="hidden md:flex gap-2">
            <Link href="/login">
              <Button variant="ghost">Anmelden</Button>
            </Link>
            <Link href="/register">
              <Button>Registrieren</Button>
            </Link>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1 text-lg"
                  >
                    {item.name}
                  </Link>
                ))}
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full" variant="ghost">
                    Anmelden
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">
                    Registrieren
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
} 