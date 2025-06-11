import {
  GenerateContentRequest,
  GenerateContentResponse,
  GenerateContentResult,
  GenerativeModel,
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService {
  private readonly googleAI: GoogleGenerativeAI;
  private readonly model: GenerativeModel;
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('AI_API_KEY');
    const modelType = this.configService.get<string>('AI_MODEL');

    if (!apiKey || !modelType) {
      throw new Error(
        'AI_API_KEY or AI_MODEL is not set in the environment variables.',
      );
    }

    this.googleAI = new GoogleGenerativeAI(apiKey);
    this.model = this.googleAI.getGenerativeModel({
      model: modelType,
    });
  }

  async query(text: string): Promise<string | null> {
    try {
      const request: GenerateContentRequest = {
        contents: [
          {
            role: 'user',
            parts: [{ text }],
          },
        ],
      };

      const response: GenerateContentResult =
        await this.model.generateContent(request);
      const content: string =
        response.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
        'No response from AI';

      return content;
    } catch (error) {
      console.error('Error querying AI:', error);
      throw error;
    }
  }
}
