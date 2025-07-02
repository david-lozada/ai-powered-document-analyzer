import { Inject, Injectable } from '@nestjs/common';
// import { DocumentDto } from './document.dto';
import { GeminiService } from '../gemini/gemini.service';
import { Cache } from 'cache-manager';
import { TextChunker } from '../text-chunker/text-chunker.service';
import { DocumentChunks } from './document-chunks.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentService {
  constructor(
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
    @Inject('DOCUMENT_CHUNKS_REPOSITORY')
    private documentChunksRepository: Repository<DocumentChunks>,
    private readonly chunker: TextChunker,
    private readonly geminiService: GeminiService,
  ) {}

  private async generateEmbedding(text: string) {
    return this.geminiService.generateEmbedding(text);
  }
  /**
   * Analyze document, get content and fetch the AI
   * @param {file} file - The file to analyze
   * @param {object} dto - The dto given by the user in this case only a description.
   * @returns {string} - The response given by the AI
   */
  /*async analyzeDocument(
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
  }*/
  async processDocument(file: Express.Multer.File): Promise<DocumentChunks[]> {
    // 1. Extract text (using your existing PDF/text extraction)
    const textChunks = await this.chunker.extractTextChunks(file);

    // 2. Generate embeddings
    const embeddings = await Promise.all(
      textChunks.map(async (chunk) => ({
        content: chunk.text,
        embedding: await this.generateEmbedding(chunk.text),
        page_number: chunk.page,
      })),
    );
    // 3. Store in Supabase
    try {
      const result = await this.documentChunksRepository.save(embeddings);
      console.log('Insert Result:', result);
      return result;
    } catch (error) {
      console.error('Error inserting document chunks:', error);
      throw new Error('Failed to insert document chunks');
    }
  }
}
