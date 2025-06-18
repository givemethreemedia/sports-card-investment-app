// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!data?.user || error) {
        router.push('/login');
      } else {
        setEmail(data.user.email || '');
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold">Welcome, {email}</h1>
      <button
        className="mt-4 bg-red-500 text-white p-2 rounded"
        onClick={async () => {
          await supabase.auth.signOut();
          router.push('/login');
        }}
      >
        Sign Out
      </button>
    </main>
  );
}
