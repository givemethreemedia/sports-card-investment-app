// lib/ebay-scraper.ts
import puppeteer, { LaunchOptions } from 'puppeteer';

export interface SoldListing {
  title: string;
  price: number;
  imageUrl: string;
  link: string;
  date: string;
}

/**
 * Scrapes eBay for sold listings matching `query`, up to `limit` items.
 */
export default async function scrapeEbaySold(
  query: string,
  limit: number
): Promise<SoldListing[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  // go to search results filtered to “Sold listings”
  const searchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(
    query
  )}&LH_Sold=1&_ipg=${limit}`;
  await page.goto(searchUrl, { waitUntil: 'networkidle2' });

  // grab up to `limit` items
  const items = await page.$$eval('.s-item', (nodes, max) => {
    return nodes.slice(0, max).map((n) => {
      const title = (n.querySelector('.s-item__title') as HTMLElement)?.innerText || '';
      const priceText = (n.querySelector('.s-item__price') as HTMLElement)?.innerText || '';
      const price = parseFloat(priceText.replace(/[^0-9\.]/g, '')) || 0;
      const imageUrl = (n.querySelector('.s-item__image-img') as HTMLImageElement)?.src || '';
      const link = (n.querySelector('.s-item__link') as HTMLAnchorElement)?.href || '';
      const date = (n.querySelector('.s-item__title--tagblock .s-item__title--tag') as HTMLElement)
        ?.innerText || '';
      return { title, price, imageUrl, link, date };
    });
  }, limit);

  await browser.close();
  return items;
}
