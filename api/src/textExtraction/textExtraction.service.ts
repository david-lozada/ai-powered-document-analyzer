import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import fs from 'node:fs';
import pdfParse from 'pdf-parse';

@Injectable()
export class TextExtractionService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async extractText(filePath: string): Promise<string> {
    try {
      // Read the PDF file
      const fileBuffer = fs.readFileSync(filePath); //TODO implement redis to gte same file
      // console.log('fileBuffer :>> ', fileBuffer);
      // Extract text from the PDF using pdf-parse
      const response = await pdfParse(fileBuffer);
      // console.log('text :>> ', response);

      // Return the extracted text
      return (
        response.text || 'Document is empty or text could not be extracted'
      );
    } catch (err) {
      console.error('Error recognizing text:', err);
      throw new Error('Failed to recognize text');
    }
  }
}
