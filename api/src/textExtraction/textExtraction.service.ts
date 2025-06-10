import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import pdfParse from 'pdf-parse';

@Injectable()
export class TextExtractionService {
  async extractText(filePath: string): Promise<string> {
    try {
      // Read the PDF file
      const fileBuffer = fs.readFileSync(filePath);

      // Extract text from the PDF using pdf-parse
      const { text } = await pdfParse(fileBuffer);

      // Return the extracted text
      return text;
    } catch (err) {
      console.error('Error recognizing text:', err);
      throw new Error('Failed to recognize text');
    }
  }
}