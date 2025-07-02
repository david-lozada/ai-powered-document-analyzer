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
      this.configService.get<string>('AI_MODEL') || 'gemini-1.5-pro';

    if (!apiKey) {
      throw new Error('AI_API_KEY is not defined in the environment');
    }
    this.googleAI = new GoogleGenerativeAI(apiKey); // Now properly assigned

    this.chatModel = this.googleAI.getGenerativeModel({
      model: modelType,
    });

    this.embeddingModel = this.googleAI.getGenerativeModel({
      model: 'embedding-001',
    });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const result = await this.embeddingModel.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.error('Embedding generation error:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  async query(text: string): Promise<string> {
    const result = await this.chatModel.generateContent(text);
    return result.response.text();
  }
}
