import amazonPaapi from "amazon-paapi";

/**
 * Amazon Product Advertising API Service
 * Provides real-time product search from Amazon
 * 
 * Docs: https://webservices.amazon.com/paapi5/documentation/
 */

export interface AmazonProduct {
  asin: string;
  title: string;
  url: string;
  price: number;
  currency: string;
  imageUrl?: string;
  rating?: number;
  reviews?: number;
  description?: string;
  brand?: string;
  inStock: boolean;
}

export class AmazonAPIService {
  private client: any;
  private isConfigured: boolean = false;

  constructor() {
    // Check if Amazon API credentials are configured
    if (
      process.env.AMAZON_ACCESS_KEY_ID &&
      process.env.AMAZON_SECRET_ACCESS_KEY &&
      process.env.AMAZON_ASSOCIATE_TAG
    ) {
      this.client = amazonPaapi.AmazonPaapi();
      this.isConfigured = true;
      console.log("✅ Amazon PA-API configured");
    } else {
      console.warn("⚠️  Amazon PA-API credentials not found. Using mock data.");
      this.isConfigured = false;
    }
  }

  /**
   * Check if Amazon API is configured
   */
  isAvailable(): boolean {
    return this.isConfigured;
  }

  /**
   * Search for products on Amazon
   * @param query Search query
   * @param maxResults Maximum number of results (default: 10)
   */
  async searchProducts(
    query: string,
    maxResults: number = 10
  ): Promise<AmazonProduct[]> {
    if (!this.isConfigured) {
      throw new Error(
        "Amazon API not configured. Please set AMAZON_ACCESS_KEY_ID, AMAZON_SECRET_ACCESS_KEY, and AMAZON_ASSOCIATE_TAG"
      );
    }

    try {
      console.log(`🔍 Searching Amazon for: "${query}" (max ${maxResults} results)`);

      const requestParameters = {
        Keywords: query,
        Resources: [
          "Images.Primary.Large",
          "ItemInfo.Title",
          "ItemInfo.Features",
          "ItemInfo.ContentInfo",
          "Offers.Listings.Price",
          "Images.Primary.Medium",
          "ItemInfo.ByLineInfo",
        ],
        PartnerTag: process.env.AMAZON_ASSOCIATE_TAG,
        PartnerType: "Associates",
        Marketplace: "www.amazon.com",
        ItemCount: maxResults,
      };

      const response = await this.client.SearchItems(
        process.env.AMAZON_ACCESS_KEY_ID,
        process.env.AMAZON_SECRET_ACCESS_KEY,
        requestParameters
      );

      if (!response || !response.SearchResult || !response.SearchResult.Items) {
        console.log("⚠️  Amazon API returned no results");
        return [];
      }

      const products: AmazonProduct[] = response.SearchResult.Items.map(
        (item: any) => {
          const asin = item.ASIN || "";
          const title = item.ItemInfo?.Title?.DisplayValue || "Unknown Product";
          const url = item.DetailPageURL || `https://www.amazon.com/dp/${asin}`;

          // Extract price
          let price = 0;
          let currency = "USD";
          if (
            item.Offers &&
            item.Offers.Listings &&
            item.Offers.Listings.length > 0
          ) {
            const listing = item.Offers.Listings[0];
            if (listing.Price) {
              price = listing.Price.Amount || 0;
              currency = listing.Price.Currency || "USD";
            }
          }

          // Extract image
          let imageUrl = undefined;
          if (item.Images && item.Images.Primary && item.Images.Primary.Large) {
            imageUrl = item.Images.Primary.Large.URL;
          }

          // Extract rating and reviews
          let rating = undefined;
          let reviews = undefined;
          if (item.ItemInfo && item.ItemInfo.ByLineInfo) {
            rating = item.ItemInfo.ByLineInfo.Rating?.Value || undefined;
            reviews = item.ItemInfo.ByLineInfo.Reviews?.Count || undefined;
          }

          // Extract brand
          let brand = undefined;
          if (
            item.ItemInfo &&
            item.ItemInfo.ByLineInfo &&
            item.ItemInfo.ByLineInfo.Brand
          ) {
            brand = item.ItemInfo.ByLineInfo.Brand.DisplayValue;
          }

          // Extract description (first feature)
          let description = undefined;
          if (
            item.ItemInfo &&
            item.ItemInfo.Features &&
            item.ItemInfo.Features.DisplayValues &&
            item.ItemInfo.Features.DisplayValues.length > 0
          ) {
            description = item.ItemInfo.Features.DisplayValues[0];
          }

          return {
            asin,
            title,
            url,
            price,
            currency,
            imageUrl,
            rating,
            reviews,
            description,
            brand,
            inStock: true, // Amazon API usually only returns in-stock items
          };
        }
      );

      console.log(`✅ Amazon API returned ${products.length} products`);
      return products;
    } catch (error: any) {
      console.error("❌ Amazon API error:", error.message);
      // Don't throw - return empty array so we can fall back to other sources
      return [];
    }
  }

  /**
   * Get product details by ASIN
   * @param asin Amazon Standard Identification Number
   */
  async getProductByASIN(asin: string): Promise<AmazonProduct | null> {
    if (!this.isConfigured) {
      throw new Error("Amazon API not configured");
    }

    try {
      const requestParameters = {
        ItemIds: [asin],
        Resources: [
          "Images.Primary.Large",
          "ItemInfo.Title",
          "ItemInfo.Features",
          "Offers.Listings.Price",
          "ItemInfo.ByLineInfo",
        ],
        PartnerTag: process.env.AMAZON_ASSOCIATE_TAG,
        PartnerType: "Associates",
        Marketplace: "www.amazon.com",
      };

      const response = await this.client.GetItems(
        process.env.AMAZON_ACCESS_KEY_ID,
        process.env.AMAZON_SECRET_ACCESS_KEY,
        requestParameters
      );

      if (!response || !response.ItemsResult || !response.ItemsResult.Items) {
        return null;
      }

      const item = response.ItemsResult.Items[0];
      // Transform to AmazonProduct (same as above)
      return {
        asin: item.ASIN || asin,
        title: item.ItemInfo?.Title?.DisplayValue || "Unknown Product",
        url: item.DetailPageURL || `https://www.amazon.com/dp/${asin}`,
        price: item.Offers?.Listings?.[0]?.Price?.Amount || 0,
        currency: item.Offers?.Listings?.[0]?.Price?.Currency || "USD",
        imageUrl:
          item.Images?.Primary?.Large?.URL || item.Images?.Primary?.Medium?.URL,
        rating: item.ItemInfo?.ByLineInfo?.Rating?.Value,
        reviews: item.ItemInfo?.ByLineInfo?.Reviews?.Count,
        description: item.ItemInfo?.Features?.DisplayValues?.[0],
        brand: item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue,
        inStock: true,
      };
    } catch (error: any) {
      console.error("❌ Amazon API error (GetItems):", error.message);
      return null;
    }
  }
}

export const amazonAPIService = new AmazonAPIService();

