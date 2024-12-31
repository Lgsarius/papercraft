'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/app/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, BookText, Brain, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleIcon } from '@/components/ui/icons';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success('Erfolgreich angemeldet');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/invalid-credential') {
        toast.error('Ungültige E-Mail oder Passwort');
      } else {
        toast.error('Fehler beim Anmelden');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Erfolgreich mit Google angemeldet');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google login error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        return;
      }
      toast.error('Fehler bei der Google-Anmeldung');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link 
            href="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Startseite
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight">
              Willkommen zurück
            </h2>
            <p className="mt-2 text-muted-foreground">
              Melden Sie sich an, um fortzufahren
            </p>
          </motion.div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card p-8 shadow rounded-lg space-y-6"
          >
            <Button 
              variant="outline" 
              onClick={handleGoogleLogin} 
              disabled={loading}
              className="w-full"
            >
              <GoogleIcon className="mr-2 h-4 w-4" />
              Mit Google fortfahren
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Oder mit E-Mail
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={loading}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Passwort</Label>
                  <Link 
                    href="/forgot-password"
                    className="text-sm text-primary hover:text-primary/90"
                  >
                    Passwort vergessen?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    disabled={loading}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Wird angemeldet..." : "Anmelden"}
              </Button>
            </form>
          </motion.div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Noch kein Konto?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:text-primary/90"
            >
              Jetzt registrieren
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex lg:flex-1 bg-muted">
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold tracking-tight">
              Entdecken Sie die Vorteile von PaperCraft
            </h3>
            <div className="grid gap-6">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const benefits = [
  {
    title: "Intelligente Textanalyse",
    description: "Verbessern Sie Ihren wissenschaftlichen Schreibstil mit KI-Unterstützung.",
    icon: <Brain className="h-5 w-5 text-primary" />,
  },
  {
    title: "Strukturierte Arbeitsweise",
    description: "Organisieren Sie Ihre Arbeit mit professionellen Vorlagen.",
    icon: <BookText className="h-5 w-5 text-primary" />,
  },
  {
    title: "Effiziente Zusammenarbeit",
    description: "Arbeiten Sie nahtlos im Team und mit Betreuern.",
    icon: <Zap className="h-5 w-5 text-primary" />,
  },
] 