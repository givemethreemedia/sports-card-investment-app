// app/api/scrape/route.ts

import { NextResponse } from 'next/server'
import scrapeEbay, { SoldListing } from '@/lib/ebay-scraper'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || 'sports cards'
  const limit = Number(searchParams.get('limit') || '50')

  // 1) run your scraper, which returns a plain array of SoldListing
  let listings: SoldListing[] = []
  try {
    listings = await scrapeEbay(q, limit)
  } catch (err) {
    console.error('eBay scrape failed:', err)
    return NextResponse.json({ error: 'Scrape failed' }, { status: 500 })
  }

  // 2) return it as JSON
  return NextResponse.json(listings)
}
