import { Inject, Injectable } from '@nestjs/common';
import { DocumentDto } from './document.dto';
import { GeminiService } from '../gemini/gemini.service';
import { Cache } from 'cache-manager';
import { TextExtractionService } from '../text-extraction/text-extraction.service';
import { TEXT_EXTRACTION_SERVICE } from '../text-extraction/text-extraction.constants';
// import { Document } from './document.entity';
// import { Repository } from 'typeorm';

@Injectable()
export class DocumentService {
  constructor(
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
    // @Inject('DOCUMENT_REPOSITORY')
    // private documentRepository: Repository<Document>,
    @Inject(TEXT_EXTRACTION_SERVICE)
    private readonly textExtractionService: TextExtractionService,
    private readonly geminiService: GeminiService,
  ) {
    this.verifyServiceMethods();
  }
  private verifyServiceMethods() {
    const requiredMethods = ['extractText', 'extractTextFromBuffer'];
    requiredMethods.forEach((method) => {
      if (typeof this.textExtractionService[method] !== 'function') {
        throw new Error(
          `TextExtractionService is missing required method: ${method}`,
        );
      }
    });
  }
  /**
   * Analyze document, get content and fetch the AI
   * @param {file} file - The file to analyze
   * @param {object} dto - The dto given by the user in this case only a description.
   * @returns {string} - The response given by the AI
   */
  async analyzeDocument(
    file: Express.Multer.File,
    dto: DocumentDto,
  ): Promise<string | null> {
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

  /*async findOne(): Promise<Document[]> {
    return this.documentRepository.find();
  }*/
}
