'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/app/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, CheckCircle, Quote, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleIcon } from '@/components/ui/icons';
import { PasswordStrength } from '@/components/ui/password-strength';

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      if (result.user) {
        await result.user.updateProfile({
          displayName: formData.name
        });
      }
      toast.success('Konto erfolgreich erstellt');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Diese E-Mail-Adresse wird bereits verwendet');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Das Passwort ist zu schwach');
      } else {
        toast.error('Fehler bei der Registrierung');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Erfolgreich mit Google registriert');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google signup error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        return;
      }
      toast.error('Fehler bei der Google-Registrierung');
    }
  };

  return (
    <div className='min-h-screen flex'>
      {/* Left Side - Form */}
      <div className='flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <Link 
            href='/'
            className='inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Zurück zur Startseite
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className='text-3xl font-bold tracking-tight'>
              Konto erstellen
            </h2>
            <p className='mt-2 text-muted-foreground'>
              Registrieren Sie sich für ein kostenloses Konto und starten Sie noch heute
            </p>
          </motion.div>
        </div>

        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='bg-card p-8 shadow rounded-lg space-y-6'
          >
            <Button 
              variant='outline' 
              onClick={handleGoogleSignup} 
              disabled={loading}
              className='w-full'
            >
              <GoogleIcon className='mr-2 h-4 w-4' />
              Mit Google fortfahren
            </Button>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Oder mit E-Mail
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Name</Label>
                <div className='relative'>
                  <User className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='name'
                    placeholder='Max Mustermann'
                    type='text'
                    autoCapitalize='words'
                    autoComplete='name'
                    autoCorrect='off'
                    disabled={loading}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className='pl-10'
                    required
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>E-Mail</Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='email'
                    placeholder='name@example.com'
                    type='email'
                    autoCapitalize='none'
                    autoComplete='email'
                    autoCorrect='off'
                    disabled={loading}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className='pl-10'
                    required
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password'>Passwort</Label>
                <div className='space-y-2'>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                    <Input
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      disabled={loading}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className='pl-10'
                      required
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                  <PasswordStrength password={formData.password} />
                </div>
              </div>

              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Wird registriert...' : 'Registrieren'}
              </Button>
            </form>
          </motion.div>

          <p className='mt-6 text-center text-sm text-muted-foreground'>
            Bereits ein Konto?{' '}
            <Link
              href='/login'
              className='font-medium text-primary hover:text-primary/90'
            >
              Anmelden
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Features */}
      <div className='hidden lg:flex lg:flex-1 bg-muted'>
        <div className='flex-1 flex flex-col justify-center px-8 lg:px-12'>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='space-y-8'
          >
            <h3 className='text-2xl font-bold tracking-tight'>
              Alles, was Sie für Ihre wissenschaftliche Arbeit brauchen
            </h3>
            <div className='grid gap-6'>
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className='flex gap-4'
                >
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className='font-semibold'>{feature.title}</h4>
                    <p className='text-sm text-muted-foreground'>
                      {feature.description}
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

const features = [
  {
    title: 'KI-gestützte Recherche',
    description: 'Finden Sie relevante Quellen schnell und effizient.',
    icon: <Search className='h-5 w-5 text-primary' />,
  },
  {
    title: 'Intelligentes Zitieren',
    description: 'Automatische Zitaterkennung und -formatierung.',
    icon: <Quote className='h-5 w-5 text-primary' />,
  },
  {
    title: 'Plagiatsprüfung',
    description: 'Stellen Sie akademische Integrität sicher.',
    icon: <CheckCircle className='h-5 w-5 text-primary' />,
  },
]; 