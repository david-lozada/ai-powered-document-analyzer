import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import fs from 'node:fs';
import pdfParse from 'pdf-parse';

@Injectable()
export class TextExtractionService {
  constructor(@Inject('CACHE_MANAGER') private cacheManager: Cache) {}

  async extractText(filePath: string): Promise<string> {
    try {
      const cacheKey = `extracted-text-${filePath}`;
      const cachedText = await this.cacheManager.get<string>(cacheKey);
      if (cachedText) return cachedText;

      // Check if the file exists
      if (!fs.existsSync(filePath))
        throw new Error(`File not found at path: ${filePath}`);

      // Read the PDF file
      const fileBuffer = fs.readFileSync(filePath);
      if (!fileBuffer || fileBuffer.length === 0) {
        throw new Error('File is empty or could not be read');
      }

      // Extract text from the PDF using pdf-parse
      const { text } = await pdfParse(fileBuffer);
      if (!text || text.trim() === '')
        throw new Error('Text extraction failed or no text found in the PDF');

      // Save in cache
      await this.cacheManager.set(cacheKey, text);

      // Return the extracted text
      return text || 'Document is empty or text could not be extracted';
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error recognizing text:', err.message);
        throw new Error('Failed to recognize text: ' + err.message);
      } else {
        console.error('Unknown error:', err);
        throw new Error('Failed to recognize text due to an unknown error');
      }
    }
  }
}
