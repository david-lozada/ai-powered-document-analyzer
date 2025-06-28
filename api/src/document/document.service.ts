import { Inject, Injectable } from '@nestjs/common';
import { DocumentDto } from './document.dto';
import { TextExtractionService } from '../textExtraction/textExtraction.service';
import { GeminiService } from '../gemini/gemini.service';
import { Cache } from 'cache-manager';
import { Document } from './document.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentService {
  constructor(
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
    @Inject('DOCUMENT_REPOSITORY')
    private documentRepository: Repository<Document>,
    private readonly textExtractionService: TextExtractionService,
    private readonly geminiService: GeminiService,
  ) {}
  async analyzeDocument(file: Express.Multer.File, dto: DocumentDto) {
    try {
      const cacheKey = `extracted-text-${file.originalname}`;
      const cachedText = await this.cacheManager.get<string>(cacheKey);
      if (cachedText) {
        const query = `${dto.description}: ${cachedText}`;
        return await this.geminiService.query(query);
      }

      let text: string = '';
      if (file.path)
        text = await this.textExtractionService.extractText(file.path);
      if (!file.path && file.buffer)
        text = await this.textExtractionService.extractTextFromBuffer(
          file.buffer,
        );
      const query = `${dto.description}: ${text}`;

      // Save in cache
      await this.cacheManager.set(cacheKey, text);

      return await this.geminiService.query(query);
    } catch (err) {
      console.error('Error analyzing document:', err);
      throw new Error('Failed to analyze document');
    }
  }

  async findOne(): Promise<Document[]> {
    return this.documentRepository.find();
  }
}
