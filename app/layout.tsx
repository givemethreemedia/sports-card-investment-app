// app/layout.tsx
import './globals.css';
import { createBrowserClient } from '@supabase/ssr';
import { SupabaseProvider } from './supabase-provider';

export const metadata = {
  title: 'CardScout',
  description: 'Find your next gem',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return (
    <html lang="en">
      <body>
        <SupabaseProvider client={supabase}>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
