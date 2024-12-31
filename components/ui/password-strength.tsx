"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const calculateStrength = (password: string) => {
    let strength = 0
    
    // Length check
    if (password.length >= 8) strength += 1
    
    // Contains number
    if (/\d/.test(password)) strength += 1
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1
    
    // Contains special char
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1

    return strength
  }

  const strength = calculateStrength(password)
  const percentage = (strength / 5) * 100

  const strengthText = [
    "Sehr schwach",
    "Schwach",
    "Mittel",
    "Stark",
    "Sehr stark"
  ][strength] || ""

  const strengthColor = [
    "bg-destructive",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-green-600"
  ][strength] || "bg-gray-200"

  return (
    <div className="space-y-2">
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", strengthColor)}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
      {password && (
        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          Passwortstärke: {strengthText}
        </motion.p>
      )}
      {strength < 3 && password && (
        <motion.ul
          className="text-sm text-muted-foreground list-disc list-inside"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {password.length < 8 && (
            <li>Mindestens 8 Zeichen</li>
          )}
          {!/\d/.test(password) && (
            <li>Eine Zahl</li>
          )}
          {!/[a-z]/.test(password) && (
            <li>Ein Kleinbuchstabe</li>
          )}
          {!/[A-Z]/.test(password) && (
            <li>Ein Großbuchstabe</li>
          )}
          {!/[!@#$%^&*(),.?":{}|<>]/.test(password) && (
            <li>Ein Sonderzeichen</li>
          )}
        </motion.ul>
      )}
    </div>
  )
} 