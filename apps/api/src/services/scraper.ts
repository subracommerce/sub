import puppeteer, { Browser, Page } from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

// Use stealth plugin to avoid detection
puppeteerExtra.use(StealthPlugin());

/**
 * ScraperService
 * Handles web scraping for product data from various marketplaces
 */
export class ScraperService {
  private browser: Browser | null = null;

  /**
   * Initialize browser instance
   */
  async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteerExtra.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--disable-gpu",
        ],
      });
      console.log("✅ Scraper browser initialized");
    }
  }

  /**
   * Close browser instance
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log("✅ Scraper browser closed");
    }
  }

  /**
   * Scrape Amazon for products
   */
  async scrapeAmazon(query: string): Promise<any[]> {
    await this.initialize();

    const page = await this.browser!.newPage();
    const products: any[] = [];

    try {
      // Set user agent
      await page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      );

      // Navigate to Amazon search
      const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
      await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 30000 });

      // Wait for products to load
      await page.waitForSelector('[data-component-type="s-search-result"]', {
        timeout: 10000,
      });

      // Extract product data
      const scrapedProducts = await page.evaluate(() => {
        const results = Array.from(
          document.querySelectorAll('[data-component-type="s-search-result"]')
        );

        return results.slice(0, 10).map((result) => {
          const titleElement = result.querySelector("h2 a span");
          const priceElement = result.querySelector(".a-price .a-offscreen");
          const ratingElement = result.querySelector(".a-icon-star-small span");
          const reviewsElement = result.querySelector('[aria-label*="stars"]');
          const imageElement = result.querySelector(".s-image") as HTMLImageElement;
          const linkElement = result.querySelector("h2 a") as HTMLAnchorElement;

          // Extract price
          let price = 0;
          if (priceElement) {
            const priceText = priceElement.textContent?.replace(/[^0-9.]/g, "") || "0";
            price = parseFloat(priceText);
          }

          // Extract rating
          let rating = 0;
          if (ratingElement) {
            const ratingText = ratingElement.textContent?.split(" ")[0] || "0";
            rating = parseFloat(ratingText);
          }

          // Extract reviews count
          let reviews = 0;
          if (reviewsElement) {
            const reviewsText =
              reviewsElement.getAttribute("aria-label")?.match(/\d+/)?.[0] || "0";
            reviews = parseInt(reviewsText.replace(/,/g, ""));
          }

          return {
            title: titleElement?.textContent?.trim() || "",
            price,
            rating,
            reviews,
            imageUrl: imageElement?.src || "",
            productUrl: linkElement?.href || "",
            marketplace: "amazon",
          };
        });
      });

      products.push(...scrapedProducts.filter((p) => p.title && p.price > 0));

      console.log(`✅ Scraped ${products.length} products from Amazon for "${query}"`);
    } catch (error: any) {
      console.error(`❌ Amazon scraping error for "${query}":`, error.message);
    } finally {
      await page.close();
    }

    return products;
  }

  /**
   * Scrape eBay for products
   */
  async scrapeEbay(query: string): Promise<any[]> {
    await this.initialize();

    const page = await this.browser!.newPage();
    const products: any[] = [];

    try {
      // Set user agent
      await page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      );

      // Navigate to eBay search
      const searchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`;
      await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 30000 });

      // Wait for products to load
      await page.waitForSelector(".s-item", { timeout: 10000 });

      // Extract product data
      const scrapedProducts = await page.evaluate(() => {
        const results = Array.from(document.querySelectorAll(".s-item"));

        return results.slice(0, 10).map((result) => {
          const titleElement = result.querySelector(".s-item__title");
          const priceElement = result.querySelector(".s-item__price");
          const imageElement = result.querySelector(".s-item__image img") as HTMLImageElement;
          const linkElement = result.querySelector(".s-item__link") as HTMLAnchorElement;
          const shippingElement = result.querySelector(".s-item__shipping");

          // Extract price
          let price = 0;
          if (priceElement) {
            const priceText = priceElement.textContent?.replace(/[^0-9.]/g, "") || "0";
            price = parseFloat(priceText);
          }

          // Extract shipping cost
          let shippingCost = 0;
          if (shippingElement) {
            const shippingText = shippingElement.textContent || "";
            if (shippingText.includes("Free")) {
              shippingCost = 0;
            } else {
              const match = shippingText.match(/[\d.]+/);
              shippingCost = match ? parseFloat(match[0]) : 0;
            }
          }

          return {
            title: titleElement?.textContent?.trim() || "",
            price,
            shippingCost,
            rating: 4.0, // eBay doesn't always show ratings in search
            reviews: 0,
            imageUrl: imageElement?.src || "",
            productUrl: linkElement?.href || "",
            marketplace: "ebay",
          };
        });
      });

      products.push(...scrapedProducts.filter((p) => p.title && p.price > 0));

      console.log(`✅ Scraped ${products.length} products from eBay for "${query}"`);
    } catch (error: any) {
      console.error(`❌ eBay scraping error for "${query}":`, error.message);
    } finally {
      await page.close();
    }

    return products;
  }

  /**
   * Scrape Walmart for products
   */
  async scrapeWalmart(query: string): Promise<any[]> {
    await this.initialize();

    const page = await this.browser!.newPage();
    const products: any[] = [];

    try {
      // Set user agent
      await page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      );

      // Navigate to Walmart search
      const searchUrl = `https://www.walmart.com/search?q=${encodeURIComponent(query)}`;
      await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 30000 });

      // Wait for products to load
      await page.waitForSelector('[data-testid="list-view"]', { timeout: 10000 });

      // Extract product data
      const scrapedProducts = await page.evaluate(() => {
        const results = Array.from(document.querySelectorAll('[data-item-id]'));

        return results.slice(0, 10).map((result) => {
          const titleElement = result.querySelector('[data-automation-id="product-title"]');
          const priceElement = result.querySelector('[data-automation-id="product-price"]');
          const imageElement = result.querySelector("img") as HTMLImageElement;
          const linkElement = result.querySelector("a") as HTMLAnchorElement;

          // Extract price
          let price = 0;
          if (priceElement) {
            const priceText = priceElement.textContent?.replace(/[^0-9.]/g, "") || "0";
            price = parseFloat(priceText);
          }

          return {
            title: titleElement?.textContent?.trim() || "",
            price,
            rating: 4.0,
            reviews: 0,
            imageUrl: imageElement?.src || "",
            productUrl: linkElement?.href
              ? `https://www.walmart.com${linkElement.href}`
              : "",
            marketplace: "walmart",
          };
        });
      });

      products.push(...scrapedProducts.filter((p) => p.title && p.price > 0));

      console.log(`✅ Scraped ${products.length} products from Walmart for "${query}"`);
    } catch (error: any) {
      console.error(`❌ Walmart scraping error for "${query}":`, error.message);
    } finally {
      await page.close();
    }

    return products;
  }

  /**
   * Scrape all marketplaces
   */
  async scrapeAll(query: string, marketplaces: string[] = ["amazon", "ebay"]): Promise<any[]> {
    const allProducts: any[] = [];

    // Run scrapers in parallel
    const scrapers = marketplaces.map((marketplace) => {
      switch (marketplace.toLowerCase()) {
        case "amazon":
          return this.scrapeAmazon(query);
        case "ebay":
          return this.scrapeEbay(query);
        case "walmart":
          return this.scrapeWalmart(query);
        default:
          return Promise.resolve([]);
      }
    });

    const results = await Promise.allSettled(scrapers);

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        allProducts.push(...result.value);
      } else {
        console.error(
          `❌ Scraper failed for ${marketplaces[index]}:`,
          result.reason
        );
      }
    });

    console.log(
      `✅ Total scraped: ${allProducts.length} products from ${marketplaces.length} marketplaces`
    );

    return allProducts;
  }
}

// Singleton instance
export const scraperService = new ScraperService();

// Graceful shutdown
process.on("SIGINT", async () => {
  await scraperService.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await scraperService.close();
  process.exit(0);
});

