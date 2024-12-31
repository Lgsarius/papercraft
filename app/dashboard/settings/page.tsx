"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/app/firebase/config"
import { useAuthState } from "react-firebase-hooks/auth"
import {
  updatePassword,
  updateEmail,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  linkWithCredential,
  linkWithPopup,
  unlink,
  signInWithPopup
} from "firebase/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import { PasswordStrength } from "@/components/ui/password-strength"
import { User, Settings, Shield, Mail } from "lucide-react"
import { GoogleIcon } from "@/components/ui/icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const [user] = useAuthState(auth)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [notifications, setNotifications] = useState({
    email: true,
    deadlines: true,
    updates: false,
  })
  const [showEmailSetup, setShowEmailSetup] = useState(false)
  const [setupData, setSetupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    setup: false,
    confirm: false,
    delete: false,
  })

  const isGoogleUser = user?.providerData.some(
    (provider) => provider.providerId === "google.com"
  )
  const hasEmailProvider = user?.providerData.some(
    (provider) => provider.providerId === "password"
  )

  if (!user) {
    router.push("/login")
    return null
  }

  const handleReauthenticate = async (password: string) => {
    if (!user?.email) return false
    
    try {
      const credential = EmailAuthProvider.credential(user.email, password)
      await reauthenticateWithCredential(user, credential)
      return true
    } catch (error) {
      console.error("Reauthentication failed:", error)
      toast.error("Falsches Passwort")
      return false
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const isReauthenticated = await handleReauthenticate(currentPassword)
      if (!isReauthenticated) {
        setLoading(false)
        return
      }

      await updatePassword(user, newPassword)
      toast.success("Passwort erfolgreich geändert")
      setCurrentPassword("")
      setNewPassword("")
    } catch (error) {
      console.error("Error updating password:", error)
      toast.error("Fehler beim Ändern des Passworts")
    } finally {
      setLoading(false)
    }
  }

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const isReauthenticated = await handleReauthenticate(currentPassword)
      if (!isReauthenticated) {
        setLoading(false)
        return
      }

      await updateEmail(user, newEmail)
      toast.success("E-Mail erfolgreich geändert")
      setCurrentPassword("")
      setNewEmail("")
    } catch (error) {
      console.error("Error updating email:", error)
      toast.error("Fehler beim Ändern der E-Mail")
    } finally {
      setLoading(false)
    }
  }

  const handleAccountDelete = async () => {
    if (!confirm("Sind Sie sicher? Diese Aktion kann nicht rückgängig gemacht werden.")) {
      return
    }

    setLoading(true)

    try {
      await deleteUser(user)
      toast.success("Konto erfolgreich gelöscht")
      router.push("/")
    } catch (error) {
      console.error("Error deleting account:", error)
      toast.error("Fehler beim Löschen des Kontos")
    } finally {
      setLoading(false)
      setShowDeleteDialog(false)
    }
  }

  const handleLinkGoogle = async () => {
    if (!user) return

    try {
      const provider = new GoogleAuthProvider()
      provider.addScope('https://www.googleapis.com/auth/userinfo.email')
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile')
      
      await linkWithPopup(user, provider)
      toast.success("Google-Konto erfolgreich verknüpft")
    } catch (error: any) {
      console.error("Error linking Google account:", error)
      if (error.code === 'auth/credential-already-in-use') {
        toast.error("Dieses Google-Konto ist bereits mit einem anderen Konto verknüpft")
      } else if (error.code === 'auth/popup-blocked') {
        toast.error("Popup wurde blockiert. Bitte erlauben Sie Popups für diese Seite")
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast.error("Vorgang abgebrochen")
      } else if (error.code === 'auth/cancelled-popup-request') {
        return
      } else if (error.code === 'auth/provider-already-linked') {
        toast.error("Google-Konto ist bereits verknüpft")
      } else {
        toast.error("Fehler beim Verknüpfen des Google-Kontos")
      }
    }
  }

  const handleUnlinkGoogle = async () => {
    if (!hasEmailProvider) {
      toast.error("Sie benötigen mindestens eine andere Anmeldemethode")
      return
    }

    try {
      await unlink(user, "google.com")
      toast.success("Google-Konto erfolgreich getrennt")
    } catch (error: any) {
      console.error("Error unlinking Google account:", error)
      if (error.code === 'auth/no-such-provider') {
        toast.error("Google-Konto ist nicht verknüpft")
      } else {
        toast.error("Fehler beim Trennen des Google-Kontos")
      }
    }
  }

  const handleEmailPasswordSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (setupData.password !== setupData.confirmPassword) {
      toast.error("Passwörter stimmen nicht überein")
      return
    }

    if (setupData.password.length < 6) {
      toast.error("Passwort muss mindestens 6 Zeichen lang sein")
      return
    }

    setLoading(true)
    try {
      const credential = EmailAuthProvider.credential(
        setupData.email,
        setupData.password
      )
      
      await linkWithCredential(user, credential)
      toast.success("E-Mail/Passwort erfolgreich eingerichtet")
      setShowEmailSetup(false)
      setSetupData({ email: "", password: "", confirmPassword: "" })
    } catch (error: any) {
      console.error("Error setting up email/password:", error)
      if (error.code === "auth/email-already-in-use") {
        toast.error("Diese E-Mail-Adresse wird bereits verwendet")
      } else if (error.code === "auth/invalid-email") {
        toast.error("Ungültige E-Mail-Adresse")
      } else if (error.code === "auth/weak-password") {
        toast.error("Passwort ist zu schwach")
      } else {
        toast.error("Fehler beim Einrichten von E-Mail/Passwort")
      }
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <motion.div 
      className="container max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Kontoeinstellungen und Präferenzen.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <Tabs defaultValue="account" className="flex-1">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-64 flex-shrink-0">
                <TabsList className="lg:flex-col h-auto lg:space-x-0 lg:space-y-2">
                  <TabsTrigger value="account" className="w-full justify-start">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Konto
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="w-full justify-start">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Präferenzen
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="w-full justify-start">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Sicherheit
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1">
                <Card>
                  <CardContent className="p-6">
                    <TabsContent value="account" className="mt-0 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-xl font-semibold">Profil</h2>
                            <p className="text-sm text-muted-foreground">
                              Ihre persönlichen Informationen
                            </p>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <div className="grid gap-6">
                            <div className="space-y-4">
                              <h3 className="text-lg font-medium">Anmeldemethoden</h3>
                              <div className="space-y-4">
                                <Card>
                                  <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                      <div className="p-2 rounded-full bg-background border">
                                        <GoogleIcon className="h-5 w-5" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium">Google</h4>
                                        <p className="text-sm text-muted-foreground">
                                          {isGoogleUser ? user.email : "Nicht verknüpft"}
                                        </p>
                                      </div>
                                    </div>
                                    {isGoogleUser ? (
                                      <Button 
                                        variant="outline" 
                                        onClick={handleUnlinkGoogle}
                                        disabled={!hasEmailProvider}
                                      >
                                        Trennen
                                      </Button>
                                    ) : (
                                      <Button variant="outline" onClick={handleLinkGoogle}>
                                        Verknüpfen
                                      </Button>
                                    )}
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                      <div className="p-2 rounded-full bg-background border">
                                        <Mail className="h-5 w-5" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium">E-Mail/Passwort</h4>
                                        <p className="text-sm text-muted-foreground">
                                          {hasEmailProvider ? "Aktiviert" : "Nicht aktiviert"}
                                        </p>
                                      </div>
                                    </div>
                                    {!hasEmailProvider && (
                                      <Button 
                                        variant="outline" 
                                        onClick={() => setShowEmailSetup(true)}
                                      >
                                        Einrichten
                                      </Button>
                                    )}
                                  </CardContent>
                                </Card>
                              </div>
                            </div>

                            {!isGoogleUser && (
                              <>
                                <Separator />
                                <div className="space-y-4">
                                  <h2 className="text-xl font-semibold">E-Mail ändern</h2>
                                  <form onSubmit={handleEmailChange} className="space-y-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="current-password-email">Aktuelles Passwort</Label>
                                      <div className="relative">
                                        <Input
                                          id="current-password-email"
                                          type={showPasswords.current ? "text" : "password"}
                                          value={currentPassword}
                                          onChange={(e) => setCurrentPassword(e.target.value)}
                                          required
                                        />
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                          onClick={() => togglePasswordVisibility('current')}
                                        >
                                          {showPasswords.current ? (
                                            <EyeOff className="h-4 w-4" />
                                          ) : (
                                            <Eye className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="new-email">Neue E-Mail</Label>
                                      <Input
                                        id="new-email"
                                        type="email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        required
                                      />
                                    </div>
                                    <Button type="submit" disabled={loading}>
                                      E-Mail ändern
                                    </Button>
                                  </form>
                                </div>

                                <div className="space-y-4">
                                  <h2 className="text-xl font-semibold">Passwort ändern</h2>
                                  <form onSubmit={handlePasswordChange} className="space-y-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="current-password">Aktuelles Passwort</Label>
                                      <div className="relative">
                                        <Input
                                          id="current-password"
                                          type={showPasswords.current ? "text" : "password"}
                                          value={currentPassword}
                                          onChange={(e) => setCurrentPassword(e.target.value)}
                                          required
                                        />
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                          onClick={() => togglePasswordVisibility('current')}
                                        >
                                          {showPasswords.current ? (
                                            <EyeOff className="h-4 w-4" />
                                          ) : (
                                            <Eye className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="new-password">Neues Passwort</Label>
                                      <div className="relative">
                                        <Input
                                          id="new-password"
                                          type={showPasswords.new ? "text" : "password"}
                                          value={newPassword}
                                          onChange={(e) => setNewPassword(e.target.value)}
                                          required
                                          minLength={6}
                                        />
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                          onClick={() => togglePasswordVisibility('new')}
                                        >
                                          {showPasswords.new ? (
                                            <EyeOff className="h-4 w-4" />
                                          ) : (
                                            <Eye className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                    <Button type="submit" disabled={loading}>
                                      Passwort ändern
                                    </Button>
                                  </form>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="preferences" className="mt-0 space-y-6">
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-xl font-semibold">Erscheinungsbild</h2>
                          <p className="text-sm text-muted-foreground">
                            Passen Sie das Aussehen der Anwendung an
                          </p>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Dunkles Design</Label>
                              <p className="text-sm text-muted-foreground">
                                Wechseln Sie zwischen hellem und dunklem Design
                              </p>
                            </div>
                            <Switch
                              checked={theme === "dark"}
                              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Systemeinstellung folgen</Label>
                              <p className="text-sm text-muted-foreground">
                                Design automatisch an Ihr System anpassen
                              </p>
                            </div>
                            <Switch
                              checked={theme === "system"}
                              onCheckedChange={(checked) => setTheme(checked ? "system" : "light")}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div>
                          <h2 className="text-xl font-semibold">Benachrichtigungen</h2>
                          <p className="text-sm text-muted-foreground">
                            Verwalten Sie Ihre Benachrichtigungseinstellungen
                          </p>
                        </div>

                        <div className="space-y-4">
                          <motion.div 
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="flex items-center justify-between"
                          >
                            <motion.div variants={item} className="space-y-0.5">
                              <Label>E-Mail-Benachrichtigungen</Label>
                              <p className="text-sm text-muted-foreground">
                                Erhalten Sie wichtige Updates per E-Mail
                              </p>
                            </motion.div>
                            <Switch
                              checked={notifications.email}
                              onCheckedChange={(checked) => 
                                setNotifications(prev => ({ ...prev, email: checked }))
                              }
                            />
                          </motion.div>

                          <motion.div 
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="flex items-center justify-between"
                          >
                            <motion.div variants={item} className="space-y-0.5">
                              <Label>Deadline-Erinnerungen</Label>
                              <p className="text-sm text-muted-foreground">
                                Benachrichtigungen über bevorstehende Abgabetermine
                              </p>
                            </motion.div>
                            <Switch
                              checked={notifications.deadlines}
                              onCheckedChange={(checked) => 
                                setNotifications(prev => ({ ...prev, deadlines: checked }))
                              }
                            />
                          </motion.div>

                          <motion.div 
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="flex items-center justify-between"
                          >
                            <motion.div variants={item} className="space-y-0.5">
                              <Label>Produktupdates</Label>
                              <p className="text-sm text-muted-foreground">
                                Informationen über neue Funktionen und Verbesserungen
                              </p>
                            </motion.div>
                            <Switch
                              checked={notifications.updates}
                              onCheckedChange={(checked) => 
                                setNotifications(prev => ({ ...prev, updates: checked }))
                              }
                            />
                          </motion.div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="security" className="mt-0 space-y-6">
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-xl font-semibold text-destructive">Gefahrenzone</h2>
                          <p className="text-sm text-muted-foreground">
                            Irreversible Aktionen für Ihr Konto
                          </p>
                        </div>

                        <Separator />

                        <Card className="border-destructive">
                          <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                              <h3 className="font-medium">Konto löschen</h3>
                              <p className="text-sm text-muted-foreground">
                                Wenn Sie Ihr Konto löschen, werden alle Ihre Daten unwiderruflich gelöscht.
                              </p>
                            </div>
                            <Button 
                              variant="destructive" 
                              onClick={handleAccountDelete}
                              disabled={loading}
                              className="transition-transform hover:scale-105"
                            >
                              {loading ? (
                                <div className="flex items-center gap-2">
                                  <Spinner className="h-4 w-4" />
                                  Wird gelöscht...
                                </div>
                              ) : (
                                "Konto löschen"
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Tabs>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                Diese Aktion kann nicht rückgängig gemacht werden. Alle Ihre Daten werden permanent gelöscht.
              </p>
              <div className="space-y-2">
                <Label htmlFor="delete-password">
                  Bitte geben Sie Ihr Passwort ein, um fortzufahren
                </Label>
                <div className="relative">
                  <Input
                    id="delete-password"
                    type={showPasswords.delete ? "text" : "password"}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Ihr aktuelles Passwort"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility('delete')}
                  >
                    {showPasswords.delete ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeletePassword("")
              setShowDeleteDialog(false)
            }}>
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleAccountDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={!deletePassword || loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner className="h-4 w-4" />
                  Wird gelöscht...
                </div>
              ) : (
                "Konto löschen"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showEmailSetup} onOpenChange={setShowEmailSetup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>E-Mail/Passwort einrichten</DialogTitle>
            <DialogDescription>
              Richten Sie eine E-Mail/Passwort-Anmeldung für Ihr Konto ein.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEmailPasswordSetup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="setup-email">E-Mail</Label>
              <Input
                id="setup-email"
                type="email"
                value={setupData.email}
                onChange={(e) => setSetupData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="setup-password">Passwort</Label>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="setup-password"
                    type={showPasswords.setup ? "text" : "password"}
                    value={setupData.password}
                    onChange={(e) => setSetupData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility('setup')}
                  >
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {showPasswords.setup ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </motion.div>
                  </Button>
                </div>
                <PasswordStrength password={setupData.password} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="setup-confirm-password">Passwort bestätigen</Label>
              <div className="relative">
                <Input
                  id="setup-confirm-password"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={setupData.confirmPassword}
                  onChange={(e) => setSetupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEmailSetup(false)
                  setSetupData({ email: "", password: "", confirmPassword: "" })
                }}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    Wird eingerichtet...
                  </div>
                ) : (
                  "Einrichten"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
} 