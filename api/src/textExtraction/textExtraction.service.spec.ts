import { Test, TestingModule } from '@nestjs/testing';
import { TextExtractionService } from './textExtraction.service';

describe('TextExtractionService', () => {
  let service: TextExtractionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TextExtractionService],
    }).compile();

    service = module.get<TextExtractionService>(TextExtractionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
