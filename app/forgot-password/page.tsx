"use client"

import { useState } from "react"
import { auth } from "@/app/firebase/config"
import { sendPasswordResetEmail } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      setIsEmailSent(true)
      toast.success("E-Mail gesendet", {
        description: "Überprüfen Sie Ihren Posteingang für weitere Anweisungen."
      })
    } catch (error: any) {
      toast.error("Fehler", {
        description: error.message === "Firebase: Error (auth/user-not-found)."
          ? "Es wurde kein Konto mit dieser E-Mail-Adresse gefunden."
          : "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Passwort zurücksetzen</CardTitle>
          <CardDescription>
            {isEmailSent
              ? "Überprüfen Sie Ihren Posteingang für weitere Anweisungen."
              : "Geben Sie Ihre E-Mail-Adresse ein, um Ihr Passwort zurückzusetzen."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            {!isEmailSent && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="max@beispiel.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {!isEmailSent ? (
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Link zum Zurücksetzen senden
              </Button>
            ) : (
              <Button
                type="button"
                className="w-full"
                onClick={() => setIsEmailSent(false)}
              >
                Erneut senden
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <Link href="/login" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zum Login
              </Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 