'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RecoverPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', recoveryPhrase: '', newPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/'), 2000);
    } catch (err) {
      setError('Recovery failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Account Recovery</h2>
          <p className="text-gray-600 mt-2">Use your 12-word phrase</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold">Password Reset!</h3>
            <p>Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleRecover} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">12-Word Recovery Phrase</label>
              <textarea
                value={formData.recoveryPhrase}
                onChange={(e) => setFormData({ ...formData, recoveryPhrase: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg text-gray-900"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg text-gray-900"
                minLength={8}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg">
              {loading ? 'Recovering...' : 'Recover Account'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-blue-600">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
