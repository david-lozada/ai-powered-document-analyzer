import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// import { DocumentDto } from './document.dto';
import { Cache } from 'cache-manager';
import { GeminiService } from '../gemini/gemini.service';
import { TextChunker } from '../text-chunker/text-chunker.service';
import { Document } from './document.entity';
import { DocumentChunks } from './document-chunks.entity';
import { toPgvectorString } from '../utils/functions.utils';
import { RawResult, SearchResult } from './document.types';

@Injectable()
export class DocumentService {
  constructor(
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
    private readonly chunker: TextChunker,
    private readonly geminiService: GeminiService,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(DocumentChunks)
    private readonly documentChunksRepository: Repository<DocumentChunks>,
  ) {}

  private async generateEmbedding(text: string) {
    return this.geminiService.generateEmbedding(text);
  }
  /**
   * Save document, extract text chunks, generate embeddings, and save them.
   * @param {file} file - The file to analyze
   * @param {object} dto - The dto given by the user in this case only a description.
   * @returns {string} - The response given by the AI
   */
  async processDocument(file: Express.Multer.File): Promise<DocumentChunks[]> {
    // 1. Create the parent document record first
    // console.log('Processing document:', file);
    const document = await this.documentRepository.save({
      filename: file.originalname,
      original_name: file.originalname,
      uploaded_at: new Date(),
    });

    // 2. Process chunks as before but now with document reference
    const textChunks = await this.chunker.extractTextChunks(file);

    const embeddings = await Promise.all(
      textChunks.map(async (chunk) => ({
        content: chunk.text,
        embedding: toPgvectorString(await this.generateEmbedding(chunk.text)),
        page_number: chunk.page,
        document: { id: document.id }, // Reference the parent document
      })),
    );

    // 3. Save chunks with document reference
    return await this.documentChunksRepository.save(embeddings);
  }

  async semanticSearch(
    query: string,
    documentId: number,
    topK: number = 5,
  ): Promise<SearchResult[]> {
    try {
      // 1. Generate embedding for the search query
      const queryEmbedding = toPgvectorString(
        await this.generateEmbedding(query),
      );
      // console.log('queryEmbedding', queryEmbedding);
      // 2. Perform vector similarity search in the database
      const results = this.documentChunksRepository
        .createQueryBuilder('chunk')
        .select(['chunk.id', 'chunk.content', 'chunk.page_number'])
        .addSelect('chunk.embedding <=> :embedding', 'similarity')
        .setParameter('embedding', queryEmbedding)
        .orderBy('similarity', 'ASC') // Lower is more similar in pgvector
        .limit(topK);
      // console.log('results', results);

      if (documentId) {
        results.where('chunk.document_id = :documentId', { documentId });
      }

      const rawResults: RawResult[] = await results.getRawMany();

      // 3. Format and return results
      return rawResults.map((result) => ({
        id: result.chunk_id,
        content: result.chunk_content,
        page_number: result.chunk_page_number,
        similarity: result.similarity,
      }));
    } catch (error) {
      console.error('Error performing semantic search:', error);
      throw new Error('Failed to perform semantic search');
    }
  }

  /**
   * Analyze document, get content and fetch the AI
   * @returns {string} - The response given by the AI
   * @param query - The user query to analyze the document with
   * @param documentId - The ID of the actual document to analyze
   */
  async analyzeAllChunks(query: string, documentId: number): Promise<string> {
    // 1. Fetch all chunks for the document
    const chunks = await this.documentChunksRepository.find({
      where: { document: { id: documentId } },
      order: { page_number: 'ASC' },
    });

    // 2. Concatenate all chunk contents
    const fullText = chunks.map((chunk) => chunk.content).join('\n');

    // 3. Combine user query with the full text
    const prompt = `${query}: ${fullText}`;

    // 4. Send to AI service
    return this.geminiService.query(prompt);
  }
}
