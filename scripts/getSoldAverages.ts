// scripts/getSoldAverages.ts
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const EBAY_ACCESS_TOKEN = process.env.EBAY_ACCESS_TOKEN;

if (!EBAY_ACCESS_TOKEN) {
  throw new Error('Missing EBAY_ACCESS_TOKEN in environment variables.');
}

const headers = {
  'Authorization': `Bearer ${EBAY_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

const getSoldAverages = async (query: string) => {
  const grades = ['10', '9'];
  const results: Record<string, { avgPrice: number, count: number }> = {};

  for (const grade of grades) {
    const response = await axios.get(
      `https://api.ebay.com/buy/browse/v1/item_summary/search`,
      {
        headers,
        params: {
          q: `${query} PSA ${grade}`,
          filter: 'price:[100..],conditions:{1000},soldDate:[NOW-30DAYS..NOW]',
          limit: 50,
          sort: '-price',
        },
      }
    );

    const items = response.data.itemSummaries || [];
    const prices = items.map((item: any) => item.price.value).filter((p: number) => !!p);
    const total = prices.reduce((acc: number, val: number) => acc + val, 0);
    const avg = prices.length ? total / prices.length : 0;

    results[`PSA ${grade}`] = {
      avgPrice: parseFloat(avg.toFixed(2)),
      count: prices.length,
    };
  }

  console.log(`📊 30-Day eBay Auction Averages for: ${query}`);
  console.log(results);
};

const input = process.argv[2];

if (!input) {
  console.error('❌ Please provide a card search string.');
  process.exit(1);
}

getSoldAverages(input).catch(err => {
  console.error('Error fetching sold averages:', err.message);
});
