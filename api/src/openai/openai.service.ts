import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class OpenaiService { 
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      	baseURL: process.env.AI_BASE_URL || 'https://api.deepseek.com', // Replace with the DeepSeek API base URL
        apiKey: process.env.AI_API_KEY, // Replace with your DeepSeek API key
    });
  }

  async query(text: string): Promise<string | null> {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: 'user', content: text }
        ],
        model: "deepseek-chat",
      });

      console.log(completion.choices[0].message.content);

      if (completion.choices.length > 0) {
        return completion.choices[0].message.content;
      } else {
        return 'No response from AI';
      }
    } catch (error) {
      console.error('Error querying AI:', error);
      throw error;
    }
  }
}