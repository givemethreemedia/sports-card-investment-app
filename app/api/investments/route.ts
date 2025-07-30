// app/api/investments/route.ts
import { NextResponse } from 'next/server';
import scrapeEbaySold, { SoldListing } from '@/lib/ebay-scraper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || 'sports cards';
  const limit = Number(searchParams.get('limit') || '50');

  try {
    const listings: SoldListing[] = await scrapeEbaySold(q, limit);
    return NextResponse.json(listings);
  } catch (err) {
    console.error('scrape failed', err);
    return NextResponse.json(
      { error: 'Failed to fetch sold listings.' },
      { status: 500 }
    );
  }
}
