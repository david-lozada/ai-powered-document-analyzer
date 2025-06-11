import { Injectable } from '@nestjs/common';
import fs from 'node:fs';
import pdfParse from 'pdf-parse';

@Injectable()
export class TextExtractionService {
  async extractText(filePath: string): Promise<string> {
    try {
      // Read the PDF file
      const fileBuffer = fs.readFileSync(filePath);
      // console.log('fileBuffer :>> ', fileBuffer);
      // Extract text from the PDF using pdf-parse
      const response = await pdfParse(fileBuffer);
      console.log('text :>> ', response);

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
