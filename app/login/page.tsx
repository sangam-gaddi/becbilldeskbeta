'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IdCard, Lock, Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import toast from 'react-hot-toast';
import Input from '@/components/Input';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.toUpperCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      toast.success(`Welcome back, ${data.student.studentName}! Redirecting...`, {
        duration: 2000,
      });

      // Wait for toast then redirect
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
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
            Welcome Back
          </h2>
          <p className="text-gray-400 text-center mb-8">Login with your USN</p>

          <form onSubmit={handleLogin}>
            <Input
              icon={IdCard}
              type="text"
              placeholder="USN (e.g., 2BA23IS083)"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value.toUpperCase())}
              required
              maxLength={10}
            />

            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between mb-6">
              <Link href="/recover" className="text-sm text-green-400 hover:underline">
                Forgot password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : 'Login'}
            </motion.button>
          </form>
        </div>

        <div className="px-8 py-4 bg-gray-900/50 backdrop-blur-sm flex justify-center border-t border-white/5">
          <p className="text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-green-400 hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}