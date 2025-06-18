import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q') || '2023 Prizm Wembanyama';
  const token = process.env.EBAY_PROD_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json({ error: 'Missing eBay token' }, { status: 500 });
  }

  const response = await fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&filter=buyingOptions:{AUCTION}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  return NextResponse.json(data);
}
