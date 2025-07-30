// lib/ebay-scraper.ts

import puppeteer, { Browser } from 'puppeteer'

export interface SoldListing {
  title: string
  price: number
  imageUrl: string
  link: string
}

export default async function scrapeEbay(
  query: string,
  limit = 50
): Promise<SoldListing[]> {
  const browser: Browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await page.goto(
    `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(
      query
    )}&_sop=12&LH_Sold=1`,
    { waitUntil: 'networkidle2' }
  )

  const listings: SoldListing[] = await page.$$eval('.s-item', (nodes) =>
    nodes.slice(0, limit).map((n) => {
      const title = (n.querySelector('.s-item__title')?.textContent || '').trim()
      const priceText = n.querySelector('.s-item__price')?.textContent || ''
      const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0
      const imgEl = n.querySelector('.s-item__image-img') as HTMLImageElement | null
      const imageUrl = imgEl?.src || ''
      const linkEl = n.querySelector('.s-item__link') as HTMLAnchorElement | null
      const link = linkEl?.href || ''
      return { title, price, imageUrl, link }
    })
  )

  await browser.close()
  return listings
}
