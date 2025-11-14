'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Mail, Lock, Loader, IdCard, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import toast from 'react-hot-toast';
import Input from '@/components/Input';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [usn, setUsn] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [verifyPhrase, setVerifyPhrase] = useState('');
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [phraseCopied, setPhraseCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    gsap.to('.blurred-background', {
      opacity: 1,
      duration: 0.5,
    });

    gsap.fromTo(
      '.auth-card',
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
    );
  }, []);

  const generateRecoveryPhrase = () => {
    import('bip39').then((bip39) => {
      const mnemonic = bip39.generateMnemonic();
      setRecoveryPhrase(mnemonic);
      setShowRecoveryPhrase(true);
    });
  };

  const handleContinue = () => {
    if (!phraseCopied) {
      toast.error('Please copy your recovery phrase first!');
      return;
    }
    setShowRecoveryPhrase(false);
    setShowVerification(true);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!showRecoveryPhrase && !showVerification) {
      generateRecoveryPhrase();
      return;
    }

    if (showVerification) {
      // Verify the phrase matches
      if (verifyPhrase.trim().toLowerCase() !== recoveryPhrase.trim().toLowerCase()) {
        toast.error('Recovery phrase does not match! Please try again.');
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usn: usn.toUpperCase(),
            email: email.toLowerCase(),
            password,
            recoveryPhrase,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Signup failed');
        }

        toast.success(`Welcome ${data.student.studentName}! Redirecting to dashboard...`, {
          duration: 2000,
        });

        // Wait a moment for the toast to show, then redirect
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);

      } catch (error: any) {
        toast.error(error.message || 'Signup failed');
        setIsLoading(false);
      }
    }
  };

  const copyRecoveryPhrase = () => {
    navigator.clipboard.writeText(recoveryPhrase);
    setPhraseCopied(true);
    toast.success('Recovery phrase copied to clipboard!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      <div className="blurred-background absolute inset-0 opacity-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-2xl"
          style={{
            backgroundImage: "url('/img/about.webp')",
            transform: 'scale(1.1)',
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-card max-w-md w-full mx-4 bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10 z-10"
      >
        <div className="p-8">
          <h2 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Create Account
          </h2>
          <p className="text-gray-400 text-center mb-8">
            {showVerification ? 'Verify Recovery Phrase' : 'Join BecBillDESK today'}
          </p>

          <form onSubmit={handleSignUp}>
            {!showRecoveryPhrase && !showVerification ? (
              <>
                <Input
                  icon={IdCard}
                  type="text"
                  placeholder="USN (e.g., 2BA23IS083)"
                  value={usn}
                  onChange={(e) => setUsn(e.target.value.toUpperCase())}
                  required
                  maxLength={10}
                />
                <p className="text-xs text-gray-400 -mt-4 mb-4 ml-1">
                  Your name will be fetched automatically from USN
                </p>
                
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  icon={Lock}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <PasswordStrengthMeter password={password} />

                <motion.button
                  className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader className="animate-spin mx-auto size-6" /> : 'Generate Recovery Phrase'}
                </motion.button>
              </>
            ) : showRecoveryPhrase ? (
              <>
                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-400 font-semibold mb-2 text-sm"> Important: Save Your Recovery Phrase</p>
                  <p className="text-gray-300 text-xs mb-4">
                    Write down these 12 words in order. You&apos;ll need them to recover your account.
                  </p>
                  <div className="bg-gray-800/50 p-4 rounded-lg mb-3">
                    <p className="text-white text-sm font-mono leading-relaxed">{recoveryPhrase}</p>
                  </div>
                  <button
                    type="button"
                    onClick={copyRecoveryPhrase}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    {phraseCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Phrase</span>
                      </>
                    )}
                  </button>
                </div>

                <motion.button
                  type="button"
                  onClick={handleContinue}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50"
                  whileHover={{ scale: phraseCopied ? 1.02 : 1 }}
                  whileTap={{ scale: phraseCopied ? 0.98 : 1 }}
                  disabled={!phraseCopied}
                >
                  Continue to Verify
                </motion.button>
              </>
            ) : (
              <>
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-400 font-semibold mb-2 text-sm"> Verify Your Recovery Phrase</p>
                  <p className="text-gray-300 text-xs mb-4">
                    Please type or paste your 12-word recovery phrase to verify you&apos;ve saved it correctly.
                  </p>
                </div>

                <div className="relative mb-6">
                  <textarea
                    placeholder="Type your 12-word recovery phrase here..."
                    value={verifyPhrase}
                    onChange={(e) => setVerifyPhrase(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200 font-mono text-sm"
                  />
                </div>

                <motion.button
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || !verifyPhrase}
                >
                  {isLoading ? <Loader className="animate-spin mx-auto size-6" /> : 'Complete Sign Up'}
                </motion.button>

                <button
                  type="button"
                  onClick={() => {
                    setShowVerification(false);
                    setShowRecoveryPhrase(true);
                    setVerifyPhrase('');
                  }}
                  className="w-full mt-3 text-sm text-gray-400 hover:text-white transition-colors"
                >
                   Back to recovery phrase
                </button>
              </>
            )}
          </form>
        </div>

        <div className="px-8 py-4 bg-gray-900/50 backdrop-blur-sm flex justify-center border-t border-white/5">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-green-400 hover:underline font-semibold">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}