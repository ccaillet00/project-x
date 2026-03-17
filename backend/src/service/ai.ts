import { Ollama } from "ollama";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { logger } from "./logger";

// Test other models from ollama
// ⚠️ Not more than 7 billion parameters ⚠️
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "granite4:1b";

export let ollama: Ollama;

export const initializeOllama = async () => {
  if (ollama) return;
  logger.info("Initializing Ollama...");
  const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:12434";
  logger.info(`Initializing Ollama with model: ${OLLAMA_MODEL}`);
  logger.info(`Using Ollama host: ${OLLAMA_HOST}`);
  ollama = new Ollama({
    host: OLLAMA_HOST,
  });
  // This will pull the model from the server
  // ⚠️ Can take a few minutes ⚠️
  logger.info("Pulling model from server... This can take a few minutes");
  await ollama.pull({ model: OLLAMA_MODEL });
};

const textAnalysisResult = z.object({
  sentiment: z.enum(["ok", "dangerous"]),
  correction: z.string().max(1024),
});

export async function textAnalysis(text: string) {
  await initializeOllama();
  logger.info(`Analyzing text: ${text}`);
  const response = await ollama.chat({
    model: OLLAMA_MODEL,
    messages: [
      {
        role: "user",
        content: `
        Your job is to analyze a text or tweet for harmful content.
        - sentiment: ok if the content is not harmful or factually wrong, dangerous if the content is harmful or wrong.
        - correction: a correction of the text if it is wrong or harmful.
        
        Text / Tweet
        
        ${text}`,
      },
    ],
    format: zodToJsonSchema(textAnalysisResult),
  });
  logger.info("Analysis done");
  return JSON.parse(response.message.content) as z.infer<
    typeof textAnalysisResult
  >;
}
