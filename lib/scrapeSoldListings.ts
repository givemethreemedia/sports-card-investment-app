// lib/scrapeSoldListings.ts
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

interface Movement {
  id: number;
  title: string;
  end_avg: number;
  img_url: string;
  sport: string;
  player: string;
  date: string; // e.g. "2025-07-26"
  url: string;
}

async function fetchMovements(offset = 0, limit = 50): Promise<Movement[]> {
  const res = await fetch(
    `https://marketmovers.sportscardinvestor.com/stats/movements?ct=sports-card&offset=${offset}&graded=0&min_sales=1&sort_by=end_avg&sort_dir=desc&limit=${limit}`
  );
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const json = await res.json();
  return json.data as Movement[];
}

export async function scrapeAndStore() {
  let offset = 0;
  const limit = 50;
  while (true) {
    const items = await fetchMovements(offset, limit);
    if (items.length === 0) break;

    // prepare rows for upsert
    const rows = items.map((m) => ({
      name: m.title,
      url: m.url,
      image_url: m.img_url,
      sold_price: m.end_avg,
      date_sold: m.date,
      player: m.player,
      sport: m.sport,
    }));

    const { error } = await supabase
      .from('sold_listings')
      .upsert(rows, { onConflict: 'url' });

    if (error) {
      console.error('Supabase upsert error:', error);
      break;
    }

    console.log(`Inserted/updated ${rows.length} listings (offset ${offset})`);

    offset += limit;
    // Optional: throttle to avoid hammering the endpoint
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log('Scrape complete');
}

// If run directly:
if (require.main === module) {
  scrapeAndStore().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
