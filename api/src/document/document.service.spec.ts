import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from './document.entity';
import { DocumentChunks } from './document-chunks.entity';
import { GeminiService } from '../gemini/gemini.service';
import { TextChunker } from '../text-chunker/text-chunker.service';

describe('DocumentService', () => {
  let service: DocumentService;
  let cacheManager: { get: jest.Mock; set: jest.Mock };
  let geminiService: { query: jest.Mock; generateEmbedding: jest.Mock };
  let documentChunksRepository: {
    find: jest.Mock;
    createQueryBuilder: jest.Mock;
  };

  beforeEach(async () => {
    cacheManager = { get: jest.fn(), set: jest.fn() };
    geminiService = { query: jest.fn(), generateEmbedding: jest.fn() };
    documentChunksRepository = {
      find: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        { provide: 'CACHE_MANAGER', useValue: cacheManager },
        { provide: TextChunker, useValue: {} },
        { provide: GeminiService, useValue: geminiService },
        { provide: getRepositoryToken(Document), useValue: {} },
        {
          provide: getRepositoryToken(DocumentChunks),
          useValue: documentChunksRepository,
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('analyzeAllChunks', () => {
    it('returns cached text if present', async () => {
      cacheManager.get.mockResolvedValue('cached');
      const result = await service.analyzeAllChunks('query', 1);
      expect(result).toBe('cached');
    });

    it('fetches, concatenates, and queries AI if not cached', async () => {
      cacheManager.get.mockResolvedValue(undefined);
      documentChunksRepository.find.mockResolvedValue([
        { content: 'chunk1' },
        { content: 'chunk2' },
      ]);
      geminiService.query.mockResolvedValue('ai-response');
      const result = await service.analyzeAllChunks('query', 1);
      expect(result).toBe('ai-response');
      expect(geminiService.query).toHaveBeenCalledWith('query: chunk1\nchunk2');
      expect(cacheManager.set).toHaveBeenCalledWith(
        'ai-response-1',
        'ai-response',
      );
    });
  });

  describe('semanticSearch', () => {
    it('returns cached results if present', async () => {
      const cached = [
        { id: 1, content: 'foo', page_number: 1, similarity: 0.1 },
      ];
      cacheManager.get.mockResolvedValue(cached);
      const result = await service.semanticSearch('query', 1);
      expect(result).toBe(cached);
    });

    it('performs search and caches results if not cached', async () => {
      cacheManager.get.mockResolvedValue(undefined);
      geminiService.generateEmbedding.mockResolvedValue([1, 2, 3]);
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawMany: jest
          .fn()
          .mockResolvedValue([
            { id: 1, content: 'foo', page_number: 1, similarity: 0.1 },
          ]),
      };
      documentChunksRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.semanticSearch('query', 1);
      expect(geminiService.generateEmbedding).toHaveBeenCalledWith('query');
      expect(documentChunksRepository.createQueryBuilder).toHaveBeenCalled();
      expect(cacheManager.set).toHaveBeenCalledWith('query-query', [
        { id: 1, content: 'foo', page_number: 1, similarity: 0.1 },
      ]);
      expect(result).toEqual([
        { id: 1, content: 'foo', page_number: 1, similarity: 0.1 },
      ]);
    });

    it('throws error if something fails', async () => {
      cacheManager.get.mockRejectedValue(new Error('fail'));
      await expect(service.semanticSearch('query', 1)).rejects.toThrow(
        'Failed to perform semantic search',
      );
    });
  });
});
