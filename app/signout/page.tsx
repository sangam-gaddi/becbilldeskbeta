'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignOutPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        const response = await fetch('/api/auth/logout', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Wait a bit for cookie to clear
        await new Promise(resolve => setTimeout(resolve, 500));

        // Redirect to home
        router.push('/');
        router.refresh();
      } catch (error) {
        console.error('Logout error:', error);
        setError('Logout failed. Redirecting...');
        
        // Redirect anyway after 1 second
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 1000);
      }
    };

    handleSignOut();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        {error ? (
          <div className="text-red-600 mb-4">{error}</div>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Signing out...</p>
          </>
        )}
      </div>
    </div>
  );
}
