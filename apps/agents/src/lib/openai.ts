import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is required");
}

export const openai = new OpenAI({
  apiKey,
});

/**
 * Generate a chat completion using GPT-4
 */
export async function generateCompletion(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: options?.model || "gpt-4-turbo-preview",
    messages,
    temperature: options?.temperature || 0.7,
    max_tokens: options?.maxTokens || 1000,
  });

  return response.choices[0]?.message?.content || "";
}

/**
 * Generate structured output using GPT-4 with function calling
 */
export async function generateStructured<T>(
  prompt: string,
  schema: any,
  options?: {
    model?: string;
    temperature?: number;
  }
): Promise<T> {
  const response = await openai.chat.completions.create({
    model: options?.model || "gpt-4-turbo-preview",
    messages: [{ role: "user", content: prompt }],
    temperature: options?.temperature || 0.3,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content || "{}";
  return JSON.parse(content) as T;
}

