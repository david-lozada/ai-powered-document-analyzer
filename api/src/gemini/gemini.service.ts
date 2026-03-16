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
    delay = 4000,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      if (
        retries > 0 &&
        (error.status === 429 ||
          error.statusText === 'Too Many Requests' ||
          error.message?.includes('429'))
      ) {
        console.warn(
          `Gemini API rate limit hit. Retrying in ${delay}ms... (Retries left: ${retries})`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
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
          outputDimensionality: 768,
        } as any);
        return result.embedding.values;
      } catch (error) {
        console.error('Embedding generation error:', error);
        throw error;
      }
    });
  }

  async query(text: string): Promise<string> {
    return this.retryWithBackoff(async () => {
      const result = await this.chatModel.generateContent(text);
      return result.response.text();
    });
  }
}
