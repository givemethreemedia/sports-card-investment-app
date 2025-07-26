// app/login/page.tsx
'use client';

import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      router.push('/investments'); // ✅ Redirect after login
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setMessage('Login error: ' + error.message);
    } else {
      setMessage('Check your email for the magic link!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight mb-4"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
        >
          Send Magic Link
        </button>
        {message && <p className="mt-4 text-sm text-center text-gray-700">{message}</p>}
      </form>
    </div>
  );
}
