// lib/getGemRate.ts

import puppeteer from "puppeteer";

export async function getGemRate(searchTerm: string, cardName: string): Promise<number> {
  const browser = await puppeteer.launch({
    headless: true, // ✅ Use true instead of "new" to avoid TS error
  });

  const page = await browser.newPage();

  const url = `https://www.gemrate.com/population/${encodeURIComponent(searchTerm)}`;
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Example scraping logic (replace with your actual selector logic)
  const gemRate = await page.evaluate(() => {
    const el = document.querySelector(".gem-rate-number");
    const text = el?.textContent || "0%";
    return parseFloat(text.replace("%", "")) || 0;
  });

  await browser.close();
  return gemRate;
}
