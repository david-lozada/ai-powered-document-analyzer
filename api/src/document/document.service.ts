import { Injectable } from '@nestjs/common';
import { DocumentDto } from './document.dto';
import { TextExtractionService } from '../textExtraction/textExtraction.service';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class DocumentService {
  constructor(
    private readonly textExtractionService: TextExtractionService,
    private readonly geminiService: GeminiService,
  ) {}
  async analyzeDocument(file: Express.Multer.File, dto: DocumentDto) {
    try {
      if (!file.path) {
        throw new Error('File path is missing. Multer did not save the file.');
      }
      const text: string = await this.textExtractionService.extractText(
        file.path,
      );
      const query = `${dto.description}: ${text}`;
      return await this.geminiService.query(query);
    } catch (err) {
      console.error('Error analyzing document:', err);
      throw new Error('Failed to analyze document');
    }
  }
}
