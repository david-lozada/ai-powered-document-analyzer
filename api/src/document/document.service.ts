import { Inject, Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(DocumentService.name);
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
   * @returns {string} - The response given by the AI
   */
  async processDocument(file: Express.Multer.File): Promise<Document> {
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
    await this.documentChunksRepository.save(embeddings);
    return document;
  }

  /**
   * Perform semantic search on document chunks using vector similarity.
   * @param query - The search query to find relevant chunks
   * @param documentId - Optional document ID to filter results
   * @param topK - Number of top results to return
   * @returns {Promise<SearchResult[]>} - Array of search results
   */
  async semanticSearch(
    query: string,
    documentId: number,
    topK: number = 5,
  ): Promise<SearchResult[] | void> {
    try {
      // check for cached results first
      const cacheKey = `query-${query}`;
      const cachedResponse =
        await this.cacheManager.get<SearchResult[]>(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }
      // 1. Generate embedding for the search query
      const queryEmbedding = toPgvectorString(
        await this.generateEmbedding(query),
      );
      // 2. Perform vector similarity search in the database
      const results = this.documentChunksRepository
        .createQueryBuilder()
        .select(['id', 'content', 'page_number'])
        .addSelect('embedding <=> :embedding', 'similarity')
        .setParameter('embedding', queryEmbedding)
        .orderBy('similarity', 'ASC')
        .limit(topK);

      if (documentId) {
        results.where('document_id = :documentId', { documentId });
      }

      const rawResults: RawResult[] = await results.getRawMany();
      // 3. Format and return results
      const customRawResults: RawResult[] = rawResults.map((result) => ({
        id: result.id,
        content: result.content,
        page_number: result.page_number,
        similarity: result.similarity,
      }));
      // cache the results
      await this.cacheManager.set<RawResult[]>(cacheKey, customRawResults);
      return customRawResults;
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
    // check for cached results first
    const cacheKey = `ai-response-${documentId}`;
    const cachedText = await this.cacheManager.get<string>(cacheKey);
    if (cachedText) {
      return cachedText;
    }
    // 1. Fetch all chunks for the document
    const chunks = await this.documentChunksRepository.find({
      where: { document: { id: documentId } },
      order: { page_number: 'ASC' },
    });

    // 2. Concatenate all chunk contents
    const fullText = chunks.map((chunk) => chunk.content).join('\n');

    // 3. Combine user query with the full text
    const prompt = `${query}: ${fullText}`;
    const aiResponse = await this.geminiService.query(prompt);
    // cache the response
    await this.cacheManager.set<string>(cacheKey, aiResponse);
    // 4. Send to AI service
    return aiResponse;
  }

  /**
   * Retrieves all documents sorted by upload date (newest first)
   * @returns Promise<Document[]> Array of documents
   * @throws Error if database operation fails
   */
  async getAllDocuments(skip = 0, take = 10): Promise<Document[]> {
    try {
      return await this.documentRepository.find({
        select: ['id', 'original_name', 'uploaded_at'],
        order: { uploaded_at: 'DESC' },
        skip,
        take,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to fetch documents: ${error.message}`,
          error.stack,
        );
        throw new Error(
          'Failed to retrieve documents. Please try again later.',
        );
      }
      // Handle non-Error thrown values
      this.logger.error(
        'Failed to fetch documents due to unexpected error type',
        error,
      );
      throw new Error('An unknown error occurred');
    }
  }

  async getDocumentById(id: number): Promise<Document | null> {
    try {
      return await this.documentRepository.findOne({
        where: { id },
        select: ['id', 'original_name', 'uploaded_at'],
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to fetch document with ID ${id}: ${error.message}`,
          error.stack,
        );
        throw new Error('Failed to retrieve document. Please try again later.');
      }
      // Handle non-Error thrown values
      this.logger.error(
        `Failed to fetch document with ID ${id} due to unexpected error type`,
        error,
      );
      throw new Error('An unknown error occurred');
    }
  }
}
