// app/api/scrape/route.ts
import { NextResponse } from 'next/server';
import scrapeEbaySold, { SoldListing } from '@/lib/ebay-scraper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'sports cards';
  const limit = Number(searchParams.get('limit') || '50');

  try {
    // 1) perform scrape
    const listings: SoldListing[] = await scrapeEbaySold(query, limit);

    // 2) return JSON response
    return NextResponse.json(listings);
  } catch (error) {
    console.error('Scrape error:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch listings' }), { status: 500 });
  }
}
