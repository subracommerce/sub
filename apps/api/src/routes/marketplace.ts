import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { productSearchService } from "../services/product-search";
import { authenticate } from "../middleware/auth";

const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  marketplaces: z.array(z.string()).optional(),
  maxResults: z.number().int().positive().max(100).optional(),
});

const compareSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  marketplaces: z.array(z.string()).optional(),
});

export const marketplaceRoutes: FastifyPluginAsync = async (fastify) => {
  // Search products across marketplaces
  fastify.post(
    "/marketplace/search",
    { onRequest: [authenticate] },
    async (request, reply) => {
      try {
        const { query, marketplaces, maxResults } = searchSchema.parse(
          request.body
        );

        const result = await productSearchService.searchProducts(
          query,
          marketplaces || ["amazon", "ebay"],
          maxResults || 20
        );

        return reply.send({
          success: true,
          data: result,
        });
      } catch (error: any) {
        fastify.log.error(error);
        if (error.name === "ZodError") {
          return reply.status(400).send({
            success: false,
            error: error.errors[0].message,
          });
        }
        return reply.status(500).send({
          success: false,
          error: error.message || "Search failed",
        });
      }
    }
  );

  // Compare prices across marketplaces
  fastify.post(
    "/marketplace/compare",
    { onRequest: [authenticate] },
    async (request, reply) => {
      try {
        const { productName, marketplaces } = compareSchema.parse(request.body);

        const result = await productSearchService.comparePrice(
          productName,
          marketplaces || ["amazon", "ebay"]
        );

        return reply.send({
          success: true,
          data: result,
        });
      } catch (error: any) {
        fastify.log.error(error);
        if (error.name === "ZodError") {
          return reply.status(400).send({
            success: false,
            error: error.errors[0].message,
          });
        }
        return reply.status(500).send({
          success: false,
          error: error.message || "Price comparison failed",
        });
      }
    }
  );

  // Get supported marketplaces
  fastify.get(
    "/marketplace/supported",
    { onRequest: [authenticate] },
    async (request, reply) => {
      return reply.send({
        success: true,
        data: {
          marketplaces: [
            {
              id: "amazon",
              name: "Amazon",
              icon: "🛒",
              supported: true,
              features: ["search", "compare"],
            },
            {
              id: "ebay",
              name: "eBay",
              icon: "🏪",
              supported: true,
              features: ["search", "compare"],
            },
            {
              id: "walmart",
              name: "Walmart",
              icon: "🏬",
              supported: false,
              comingSoon: true,
            },
            {
              id: "shopify",
              name: "Shopify",
              icon: "🛍️",
              supported: false,
              comingSoon: true,
            },
          ],
        },
      });
    }
  );
};

