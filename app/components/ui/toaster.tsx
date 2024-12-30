"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = {
  position?: "top-right" | "top-center" | "top-left" | "bottom-right" | "bottom-center" | "bottom-left"
  richColors?: boolean
}

export function Toaster({ position = "top-right", richColors = true }: ToasterProps = {}) {
  return (
    <Sonner
      position={position}
      richColors={richColors}
      theme="system"
      className="toaster group"
    />
  )
} 