// scripts/getRawAverages.ts
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const accessToken = process.env.EBAY_ACCESS_TOKEN;
const EBAY_API_BASE = 'https://api.ebay.com/buy/browse/v1';

async function fetchSoldRawListings(searchQuery: string): Promise<number[]> {
  const now = new Date();
  const past30 = new Date();
  past30.setDate(now.getDate() - 30);

  const filterDate = past30.toISOString();
  let prices: number[] = [];
  let offset = 0;
  let morePages = true;

  while (morePages) {
    const response = await axios.get(`${EBAY_API_BASE}/item_summary/search`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      params: {
        q: searchQuery + ' -PSA -BGS -SGC',
        filter: `conditionIds:{3000},soldDate:[${filterDate}..]`,
        sort: 'soldDate desc',
        limit: 50,
        offset,
      },
    });

    const items = response.data.itemSummaries || [];
    items.forEach((item: any) => {
      if (item.price?.value) prices.push(parseFloat(item.price.value));
    });

    offset += 50;
    morePages = response.data.total > offset;
  }

  return prices;
}

async function main() {
  const searchTerm = process.argv.slice(2).join(' ');
  if (!searchTerm) {
    console.error('❌ Please provide a search term (e.g. "2020 Prizm LaMelo Ball")');
    process.exit(1);
  }

  console.log(`🔍 Searching for raw sold listings of: ${searchTerm}`);
  const prices = await fetchSoldRawListings(searchTerm);

  if (prices.length === 0) {
    console.log('⚠️ No matching raw card sales in the last 30 days.');
    return;
  }

  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  console.log(`✅ ${prices.length} raw card sales found. 30-day average: $${avg.toFixed(2)}`);
}

main().catch(console.error);
