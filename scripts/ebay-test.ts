// scripts/ebay-test.ts
import 'dotenv/config';
import axios from 'axios';

const accessToken = 'v^1.1#i^1#I^3#r^0#f^0#p^3#t^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';

const ebayApiUrl = 'https://api.ebay.com/buy/browse/v1/item_summary/search?q=psa%2010%20zion%20williamson';

async function fetchEbayData() {
  try {
    const response = await axios.get(ebayApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ eBay response:', response.data);
  } catch (error: any) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

fetchEbayData();
