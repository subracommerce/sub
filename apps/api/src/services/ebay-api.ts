import axios from "axios";

/**
 * eBay Finding API Service
 * Provides real-time product search from eBay
 * 
 * Docs: https://developer.ebay.com/DevZone/finding/Concepts/FindingAPIGuide.html
 */

export interface EbayProduct {
  itemId: string;
  title: string;
  url: string;
  price: number;
  currency: string;
  imageUrl?: string;
  condition?: string;
  shippingCost?: number;
  location?: string;
  seller?: string;
  sellerRating?: number;
  bids?: number;
  isAuction: boolean;
}

export class EbayAPIService {
  private appId: string | undefined;
  private baseUrl: string = "https://svcs.ebay.com/services/search/FindingService/v1";
  private isConfigured: boolean = false;

  constructor() {
    this.appId = process.env.EBAY_APP_ID;
    
    if (this.appId) {
      this.isConfigured = true;
      console.log("✅ eBay Finding API configured");
    } else {
      console.warn("⚠️  eBay API credentials not found. Using mock data.");
      this.isConfigured = false;
    }
  }

  /**
   * Check if eBay API is configured
   */
  isAvailable(): boolean {
    return this.isConfigured;
  }

  /**
   * Search for products on eBay
   * @param query Search query
   * @param maxResults Maximum number of results (default: 10)
   */
  async searchProducts(
    query: string,
    maxResults: number = 10
  ): Promise<EbayProduct[]> {
    if (!this.isConfigured) {
      throw new Error("eBay API not configured. Please set EBAY_APP_ID");
    }

    try {
      console.log(`🔍 Searching eBay for: "${query}" (max ${maxResults} results)`);

      const params = {
        "OPERATION-NAME": "findItemsAdvanced",
        "SERVICE-VERSION": "1.0.0",
        "SECURITY-APPNAME": this.appId,
        "RESPONSE-DATA-FORMAT": "JSON",
        "REST-PAYLOAD": "",
        "keywords": query,
        "paginationInput.entriesPerPage": maxResults.toString(),
        "sortOrder": "BestMatch",
      };

      const response = await axios.get(this.baseUrl, { params });

      const data = response.data;

      // eBay's API structure is deeply nested
      if (
        !data.findItemsAdvancedResponse ||
        !data.findItemsAdvancedResponse[0].searchResult ||
        !data.findItemsAdvancedResponse[0].searchResult[0].item
      ) {
        console.log("⚠️  eBay API returned no results");
        return [];
      }

      const items = data.findItemsAdvancedResponse[0].searchResult[0].item;

      const products: EbayProduct[] = items.map((item: any) => {
        const itemId = item.itemId?.[0] || "";
        const title = item.title?.[0] || "Unknown Product";
        const url = item.viewItemURL?.[0] || "";

        // Extract price
        const price =
          parseFloat(item.sellingStatus?.[0]?.currentPrice?.[0].__value__) || 0;
        const currency =
          item.sellingStatus?.[0]?.currentPrice?.[0]["@currencyId"] || "USD";

        // Extract image
        const imageUrl = item.galleryURL?.[0] || item.pictureURLLarge?.[0];

        // Extract condition
        const condition = item.condition?.[0]?.conditionDisplayName?.[0];

        // Extract shipping cost
        const shippingCost = parseFloat(
          item.shippingInfo?.[0]?.shippingServiceCost?.[0].__value__
        );

        // Extract location
        const location = item.location?.[0];

        // Extract seller info
        const seller = item.sellerInfo?.[0]?.sellerUserName?.[0];
        const sellerRating = parseInt(
          item.sellerInfo?.[0]?.positiveFeedbackPercent?.[0]
        );

        // Check if auction
        const isAuction = item.listingInfo?.[0]?.listingType?.[0] === "Auction";
        const bids = parseInt(item.sellingStatus?.[0]?.bidCount?.[0]) || 0;

        return {
          itemId,
          title,
          url,
          price,
          currency,
          imageUrl,
          condition,
          shippingCost: isNaN(shippingCost) ? undefined : shippingCost,
          location,
          seller,
          sellerRating: isNaN(sellerRating) ? undefined : sellerRating,
          bids: isAuction ? bids : undefined,
          isAuction,
        };
      });

      console.log(`✅ eBay API returned ${products.length} products`);
      return products;
    } catch (error: any) {
      console.error("❌ eBay API error:", error.message);
      // Don't throw - return empty array so we can fall back to other sources
      return [];
    }
  }

  /**
   * Search for auctions only
   * @param query Search query
   * @param maxResults Maximum number of results
   */
  async searchAuctions(
    query: string,
    maxResults: number = 10
  ): Promise<EbayProduct[]> {
    if (!this.isConfigured) {
      throw new Error("eBay API not configured");
    }

    try {
      const params = {
        "OPERATION-NAME": "findItemsAdvanced",
        "SERVICE-VERSION": "1.0.0",
        "SECURITY-APPNAME": this.appId,
        "RESPONSE-DATA-FORMAT": "JSON",
        "REST-PAYLOAD": "",
        "keywords": query,
        "paginationInput.entriesPerPage": maxResults.toString(),
        "sortOrder": "EndTimeSoonest",
        "itemFilter(0).name": "ListingType",
        "itemFilter(0).value": "Auction",
      };

      const response = await axios.get(this.baseUrl, { params });

      const data = response.data;

      if (
        !data.findItemsAdvancedResponse ||
        !data.findItemsAdvancedResponse[0].searchResult ||
        !data.findItemsAdvancedResponse[0].searchResult[0].item
      ) {
        return [];
      }

      const items = data.findItemsAdvancedResponse[0].searchResult[0].item;

      const products: EbayProduct[] = items.map((item: any) => ({
        itemId: item.itemId?.[0] || "",
        title: item.title?.[0] || "Unknown Product",
        url: item.viewItemURL?.[0] || "",
        price:
          parseFloat(item.sellingStatus?.[0]?.currentPrice?.[0].__value__) || 0,
        currency:
          item.sellingStatus?.[0]?.currentPrice?.[0]["@currencyId"] || "USD",
        imageUrl: item.galleryURL?.[0],
        condition: item.condition?.[0]?.conditionDisplayName?.[0],
        shippingCost: parseFloat(
          item.shippingInfo?.[0]?.shippingServiceCost?.[0].__value__
        ),
        location: item.location?.[0],
        seller: item.sellerInfo?.[0]?.sellerUserName?.[0],
        sellerRating: parseInt(
          item.sellerInfo?.[0]?.positiveFeedbackPercent?.[0]
        ),
        bids: parseInt(item.sellingStatus?.[0]?.bidCount?.[0]) || 0,
        isAuction: true,
      }));

      console.log(`✅ eBay API returned ${products.length} auctions`);
      return products;
    } catch (error: any) {
      console.error("❌ eBay API error (auctions):", error.message);
      return [];
    }
  }

  /**
   * Search for Buy It Now items only
   * @param query Search query
   * @param maxResults Maximum number of results
   */
  async searchBuyItNow(
    query: string,
    maxResults: number = 10
  ): Promise<EbayProduct[]> {
    if (!this.isConfigured) {
      throw new Error("eBay API not configured");
    }

    try {
      const params = {
        "OPERATION-NAME": "findItemsAdvanced",
        "SERVICE-VERSION": "1.0.0",
        "SECURITY-APPNAME": this.appId,
        "RESPONSE-DATA-FORMAT": "JSON",
        "REST-PAYLOAD": "",
        "keywords": query,
        "paginationInput.entriesPerPage": maxResults.toString(),
        "sortOrder": "PricePlusShippingLowest",
        "itemFilter(0).name": "ListingType",
        "itemFilter(0).value": "FixedPrice",
      };

      const response = await axios.get(this.baseUrl, { params });

      const data = response.data;

      if (
        !data.findItemsAdvancedResponse ||
        !data.findItemsAdvancedResponse[0].searchResult ||
        !data.findItemsAdvancedResponse[0].searchResult[0].item
      ) {
        return [];
      }

      const items = data.findItemsAdvancedResponse[0].searchResult[0].item;

      const products: EbayProduct[] = items.map((item: any) => ({
        itemId: item.itemId?.[0] || "",
        title: item.title?.[0] || "Unknown Product",
        url: item.viewItemURL?.[0] || "",
        price:
          parseFloat(item.sellingStatus?.[0]?.currentPrice?.[0].__value__) || 0,
        currency:
          item.sellingStatus?.[0]?.currentPrice?.[0]["@currencyId"] || "USD",
        imageUrl: item.galleryURL?.[0],
        condition: item.condition?.[0]?.conditionDisplayName?.[0],
        shippingCost: parseFloat(
          item.shippingInfo?.[0]?.shippingServiceCost?.[0].__value__
        ),
        location: item.location?.[0],
        seller: item.sellerInfo?.[0]?.sellerUserName?.[0],
        sellerRating: parseInt(
          item.sellerInfo?.[0]?.positiveFeedbackPercent?.[0]
        ),
        bids: undefined,
        isAuction: false,
      }));

      console.log(`✅ eBay API returned ${products.length} Buy It Now items`);
      return products;
    } catch (error: any) {
      console.error("❌ eBay API error (Buy It Now):", error.message);
      return [];
    }
  }
}

export const ebayAPIService = new EbayAPIService();

