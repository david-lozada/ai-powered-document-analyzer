// gemini.service.ts
import { Injectable } from '@nestjs/common';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable() // Don't forget this decorator
export class GeminiService {
  private readonly googleAI: GoogleGenerativeAI; // <-- Declare the property
  private readonly embeddingModel: GenerativeModel;
  private readonly chatModel: GenerativeModel;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('AI_API_KEY');
    const modelType =
      this.configService.get<string>('AI_MODEL') || 'gemini-2.0-flash';

    if (!apiKey) {
      throw new Error('AI_API_KEY is not defined in the environment');
    }
    this.googleAI = new GoogleGenerativeAI(apiKey); // Now properly assigned

    this.chatModel = this.googleAI.getGenerativeModel(
      { model: modelType },
      { apiVersion: 'v1beta' },
    );

    this.embeddingModel = this.googleAI.getGenerativeModel({
      model: 'gemini-embedding-001',
    });
  }

  /**
   * Retries an async operation with exponential backoff on 429 errors.
   */
  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    retries = 5,
    delay = 1000,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      if (
        retries > 0 &&
        (error.status === 429 ||
          error.statusText === 'Too Many Requests' ||
          error.message?.includes('429') ||
          error.message?.includes('Quota') ||
          error.message?.includes('rate limit'))
      ) {
        // If Google tells us to wait (like 45s), we should probably wait a bit longer than 1s
        const waitTime = error.message?.includes('Quota') ? 10000 : delay;
        console.warn(
          `Gemini API rate limit hit. Retrying in ${waitTime}ms... (Retries left: ${retries})`,
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        return this.retryWithBackoff(operation, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    return this.retryWithBackoff(async () => {
      try {
        const result = await this.embeddingModel.embedContent({
          content: { parts: [{ text }] },
        } as any);
        return result.embedding.values;
      } catch (error) {
        console.error('Embedding generation error:', error);
        throw error;
      }
    });
  }

  async batchGenerateEmbeddings(texts: string[]): Promise<number[][]> {
    return this.retryWithBackoff(async () => {
      try {
        const result = await this.embeddingModel.batchEmbedContents({
          requests: texts.map((text) => ({
            content: { parts: [{ text }], role: 'user' },
          })),
        });
        return result.embeddings.map((e) => e.values);
      } catch (error) {
        console.error('Batch embedding generation error:', error);
        throw error;
      }
    });
  }

  async query(text: string, model?: string): Promise<string> {
    const activeModel = model
      ? this.googleAI.getGenerativeModel(
          { model },
          { apiVersion: 'v1beta' },
        )
      : this.chatModel;

    return this.retryWithBackoff(async () => {
      const result = await activeModel.generateContent(text);
      return result.response.text();
    });
  }

  async *streamQuery(text: string, model?: string): AsyncGenerator<string> {
    const activeModel = model
      ? this.googleAI.getGenerativeModel(
          { model },
          { apiVersion: 'v1beta' },
        )
      : this.chatModel;

    const result = await activeModel.generateContentStream(text);
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        yield chunkText;
      }
    }
  }
}
